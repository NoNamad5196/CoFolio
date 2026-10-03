import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { Store, HttpError } from "./database.ts";
import { importProject } from "./import.ts";
import { runPipeline } from "./pipeline.ts";
import {
  importSchema,
  projectSchema,
  roleSchema,
  workspaceSchema,
} from "../src/v2/domain.ts";

export function loadEnvironment() {
  // Legacy key is read only by the server. Vite exposes no VITE_* secrets in V2.
  for (const name of [".env.local", ".env"]) {
    if (!existsSync(name)) continue;
    for (const line of readFileSync(name, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (match && process.env[match[1]] === undefined)
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
    }
  }
}
const authSchema = z.object({
  email: z
    .string()
    .email()
    .max(250)
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(10).max(128),
  name: z.string().trim().min(1).max(100).default("개발자"),
});
async function body(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2_000_000) throw new HttpError(413, "입력 내용이 너무 큽니다.");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "올바른 JSON 요청이 아닙니다.");
  }
}
export function createApp(
  store: Store,
  options: { disableAi?: boolean; staticRoot?: string } = {},
) {
  const attempts = new Map<string, { count: number; expires: number }>();
  function limit(key: string, max: number) {
    const time = Date.now();
    const entry = attempts.get(key);
    if (!entry || entry.expires < time)
      attempts.set(key, { count: 1, expires: time + 60000 });
    else if (++entry.count > max)
      throw new HttpError(429, "요청이 많습니다. 1분 후 다시 시도해주세요.");
    if (attempts.size > 10000)
      for (const [id, v] of attempts) if (v.expires < time) attempts.delete(id);
  }
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "DENY");
    const json = (status: number, value: unknown) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(value));
    };
    try {
      const path = new URL(req.url || "/", "http://localhost").pathname;
      const token =
        req.headers.cookie?.match(
          /(?:^|;\s*)cofolio_session=([a-f0-9]{64})(?:;|$)/,
        )?.[1] || "";
      if (path.startsWith("/api/")) {
        if (!["GET", "HEAD"].includes(req.method || "GET")) {
          const origin = req.headers.origin;
          const allowed = process.env.APP_ORIGIN;
          if (
            origin &&
            origin !== allowed &&
            new URL(origin).host !== req.headers.host
          )
            throw new HttpError(403, "허용되지 않은 출처의 요청입니다.");
          if (!req.headers["content-type"]?.startsWith("application/json"))
            throw new HttpError(415, "JSON 요청이 필요합니다.");
        }
        if (path === "/api/health")
          return json(200, {
            ok: true,
            storage: "sqlite",
            aiConfigured: Boolean(
              process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
            ),
          });
        if (path === "/api/auth/session" && req.method === "GET")
          return json(200, { user: store.user(token) || null });
        if (
          (path === "/api/auth/register" || path === "/api/auth/login") &&
          req.method === "POST"
        ) {
          limit(`auth:${req.socket.remoteAddress}`, 12);
          const data = authSchema.parse(await body(req));
          const user = path.endsWith("register")
            ? await store.register(data.email, data.password, data.name)
            : await store.login(data.email, data.password);
          const session = store.session(user.id);
          res.setHeader(
            "Set-Cookie",
            `cofolio_session=${session}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${process.env.COOKIE_SECURE === "true" ? "; Secure" : ""}`,
          );
          return json(200, { user });
        }
        if (path === "/api/auth/logout" && req.method === "POST") {
          store.logout(token);
          res.setHeader(
            "Set-Cookie",
            "cofolio_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
          );
          return json(200, { ok: true });
        }
        if (path === "/api/workspace") {
          const user = store.user(token);
          if (!user) throw new HttpError(401, "로그인이 필요합니다.");
          if (req.method === "GET") return json(200, store.load(user.id));
          if (req.method === "PUT") {
            const data = z
              .object({
                workspace: workspaceSchema,
                revision: z.number().int().min(0),
              })
              .parse(await body(req));
            return json(200, {
              revision: store.save(user.id, data.workspace, data.revision),
            });
          }
        }
        if (path === "/api/import" && req.method === "POST") {
          limit(`import:${req.socket.remoteAddress}`, 20);
          return json(
            200,
            await importProject(importSchema.parse(await body(req))),
          );
        }
        if (path === "/api/analyze" && req.method === "POST") {
          limit(`ai:${req.socket.remoteAddress}`, 8);
          const data = z
            .object({ project: projectSchema, role: roleSchema })
            .parse(await body(req));
          return json(
            200,
            await runPipeline(
              data.project,
              data.role,
              options.disableAi
                ? async () => {
                    throw new Error("AI_DISABLED");
                  }
                : undefined,
            ),
          );
        }
        throw new HttpError(404, "요청한 기능을 찾을 수 없습니다.");
      }
      if (!options.staticRoot || !["GET", "HEAD"].includes(req.method || ""))
        throw new HttpError(404, "페이지를 찾을 수 없습니다.");
      const root = resolve(options.staticRoot);
      let file = resolve(root, "." + decodeURIComponent(path));
      if (!file.startsWith(root + sep) && file !== root)
        throw new HttpError(403, "허용되지 않은 경로입니다.");
      if (!existsSync(file) || !statSync(file).isFile()) {
        if (extname(path)) throw new HttpError(404, "파일을 찾을 수 없습니다.");
        file = resolve(root, "index.html");
      }
      res.setHeader(
        "Content-Type",
        (
          {
            ".html": "text/html; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".woff2": "font/woff2",
          } as Record<string, string>
        )[extname(file)] || "application/octet-stream",
      );
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; frame-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      );
      res.end(req.method === "HEAD" ? "" : readFileSync(file));
    } catch (error) {
      json(
        error instanceof HttpError
          ? error.status
          : error instanceof z.ZodError
            ? 400
            : 502,
        {
          error:
            error instanceof z.ZodError
              ? "입력 형식이나 길이를 확인해주세요."
              : error instanceof HttpError
                ? error.message
                : error instanceof Error &&
                    /GitHub|README|프로젝트 이름|공개 저장소|가져올 자료/.test(
                      error.message,
                    )
                  ? error.message
                  : "요청을 처리하지 못했습니다. 입력은 보존됩니다. 잠시 후 다시 시도해주세요.",
        },
      );
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  loadEnvironment();
  const port = Number(process.env.PORT || 4174);
  const store = new Store(
    process.env.DATABASE_PATH || resolve("data/cofolio.sqlite"),
  );
  const server = createApp(store, {
    staticRoot: existsSync("dist/index.html") ? resolve("dist") : undefined,
  });
  server.listen(port, process.env.HOST || "127.0.0.1", () =>
    console.log(`CoFolio API ready: http://127.0.0.1:${port}`),
  );
  for (const signal of ["SIGTERM", "SIGINT"] as const)
    process.on(signal, () =>
      server.close(() => {
        store.close();
        process.exit(0);
      }),
    );
}
