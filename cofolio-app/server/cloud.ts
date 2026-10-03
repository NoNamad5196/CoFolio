import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import {
  emptyWorkspace,
  importSchema,
  projectSchema,
  roleSchema,
  workspaceSchema,
} from "../src/v2/domain.ts";
import { importProject } from "./import.ts";
import { runPipeline } from "./pipeline.ts";
import {
  analyzeRules,
  collectEvidence,
  ruleSuggestions,
} from "../src/v2/analysis.ts";

class CloudError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
const credentials = z.object({
  email: z.string().trim().email().max(250),
  password: z.string().min(10).max(128),
  name: z.string().trim().min(1).max(100).default("개발자"),
});
const workspaceResponse = z.object({
  workspace: workspaceSchema,
  revision: z.number().int().min(0),
});
function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email || "",
    name: String(
      user.user_metadata?.name || user.user_metadata?.display_name || "개발자",
    ).slice(0, 100),
  };
}
async function input(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new CloudError(415, "JSON 요청이 필요합니다.");
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 2_000_000) {
        await reader.cancel();
        throw new CloudError(413, "입력 내용이 너무 큽니다.");
      }
      chunks.push(chunk.value);
    }
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new CloudError(400, "올바른 JSON 요청이 아닙니다.");
  }
}
function databaseError(error: { code?: string }) {
  if (["PT409", "40001", "23505"].includes(error.code || ""))
    return new CloudError(
      409,
      "다른 창에서 내용이 변경되었습니다. 현재 내용을 백업한 뒤 새로고침해주세요.",
    );
  if (error.code === "42501")
    return new CloudError(403, "이 포트폴리오에 접근할 수 없습니다.");
  return new CloudError(
    503,
    "계정 저장소에 연결하지 못했습니다. 입력은 보존됩니다. 잠시 후 다시 시도해주세요.",
  );
}
export function createCloudHandler(
  options: { url?: string; key?: string; fetch?: typeof fetch } = {},
) {
  // Per-instance protection; Supabase also enforces its own authentication limits.
  const limits = new Map<string, { count: number; expires: number }>();
  function limit(key: string, max: number) {
    const time = Date.now();
    const entry = limits.get(key);
    if (!entry || entry.expires < time)
      limits.set(key, { count: 1, expires: time + 60000 });
    else if (++entry.count > max)
      throw new CloudError(429, "요청이 많습니다. 1분 후 다시 시도해주세요.");
    if (limits.size > 10000)
      for (const [id, value] of limits)
        if (value.expires < time) limits.delete(id);
  }
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const headers = new Headers({
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
    });
    const json = (value: unknown, status = 200) => {
      headers.set("Content-Type", "application/json; charset=utf-8");
      return new Response(JSON.stringify(value), { status, headers });
    };
    const redirect = (path: string) => {
      headers.set("Location", new URL(path, url.origin).href);
      return new Response(null, { status: 303, headers });
    };
    const supabaseUrl =
      options.url || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      options.key ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;
    let client: ReturnType<typeof createServerClient> | undefined;
    function supabase() {
      if (!supabaseUrl || !supabaseKey)
        throw new CloudError(
          503,
          "계정 서버의 연결 설정이 필요합니다. 잠시 후 다시 시도해주세요.",
        );
      client ||= createServerClient(supabaseUrl, supabaseKey, {
        global: {
          fetch: (input, init) => (options.fetch || fetch)(input, {
            ...init,
            signal: init?.signal
              ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)])
              : AbortSignal.timeout(15000),
          }),
        },
        cookieOptions: {
          httpOnly: true,
          secure: url.protocol === "https:",
          sameSite: "lax",
          path: "/",
        },
        cookies: {
          getAll: () =>
            parseCookieHeader(request.headers.get("cookie") || "").map((c) => ({
              name: c.name,
              value: c.value || "",
            })),
          setAll: (cookies) => {
            for (const { name, value, options: cookieOptions } of cookies)
              headers.append(
                "Set-Cookie",
                serializeCookieHeader(name, value, {
                  ...cookieOptions,
                  httpOnly: true,
                  secure: url.protocol === "https:",
                  sameSite: "lax",
                  path: "/",
                }),
              );
          },
        },
      });
      return client;
    }
    async function currentUser(required = false) {
      const { data, error } = await supabase().auth.getUser();
      if (
        error &&
        error.name !== "AuthSessionMissingError" &&
        ![400, 401, 403].includes(error.status || 0)
      )
        throw new CloudError(
          503,
          "로그인 상태를 확인하지 못했습니다. 다시 시도해주세요.",
        );
      if (required && !data.user)
        throw new CloudError(401, "로그인이 필요합니다.");
      return data.user;
    }
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        const origin = request.headers.get("origin");
        if (
          origin &&
          origin !== url.origin &&
          origin !== process.env.APP_ORIGIN
        )
          throw new CloudError(403, "허용되지 않은 출처의 요청입니다.");
      }
      const path = url.pathname;
      const ip =
        request.headers.get("x-vercel-forwarded-for") ||
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        "unknown";
      if (path === "/api/health" && request.method === "GET")
        return json({
          ok: !!(supabaseUrl && supabaseKey),
          storage: "supabase",
          aiConfigured: !!process.env.GEMINI_API_KEY,
        });
      if (path === "/api/auth/session" && request.method === "GET") {
        const user = await currentUser();
        return json({ user: user ? publicUser(user) : null });
      }
      if (path === "/api/auth/callback" && request.method === "GET") {
        const code = url.searchParams.get("code");
        if (!code) return redirect("/settings?auth=error");
        const { error } = await supabase().auth.exchangeCodeForSession(code);
        return redirect(
          error ? "/settings?auth=error" : "/settings?auth=confirmed",
        );
      }
      if (
        ["/api/auth/register", "/api/auth/login"].includes(path) &&
        request.method === "POST"
      ) {
        limit(`auth:${ip}`, 12);
        const data = credentials.parse(await input(request));
        const result = path.endsWith("register")
          ? await supabase().auth.signUp({
              email: data.email,
              password: data.password,
              options: {
                data: { name: data.name },
                emailRedirectTo: `${url.origin}/api/auth/callback`,
              },
            })
          : await supabase().auth.signInWithPassword({
              email: data.email,
              password: data.password,
            });
        if (result.error)
          throw new CloudError(
            result.error.status === 429 ? 429 : 400,
            result.error.code === "email_not_confirmed"
              ? "가입 확인 메일의 링크를 누른 뒤 로그인해주세요."
              : path.endsWith("login")
                ? "이메일 또는 비밀번호를 확인해주세요."
                : "가입을 처리하지 못했습니다. 이미 가입했다면 로그인하거나 잠시 후 다시 시도해주세요.",
          );
        if (!result.data.session)
          return json({ user: null, confirmationRequired: true });
        return json({ user: publicUser(result.data.user!) });
      }
      if (path === "/api/auth/logout" && request.method === "POST") {
        await input(request);
        const { error } = await supabase().auth.signOut({ scope: "local" });
        if (error && error.name !== "AuthSessionMissingError")
          throw new CloudError(
            503,
            "로그아웃하지 못했습니다. 다시 시도해주세요.",
          );
        return json({ ok: true });
      }
      if (
        path === "/api/workspace" &&
        ["GET", "PUT"].includes(request.method)
      ) {
        await currentUser(true);
        if (request.method === "GET") {
          const { data, error } = await supabase().rpc("cofolio_v2_load");
          if (error) throw databaseError(error);
          return json(
            data
              ? workspaceResponse.parse(data)
              : { workspace: emptyWorkspace(), revision: 0 },
          );
        }
        const data = workspaceResponse.parse(await input(request));
        const result = await supabase().rpc("cofolio_v2_save", {
          payload: data.workspace,
          expected_revision: data.revision,
        });
        if (result.error) throw databaseError(result.error);
        return json({ revision: z.number().int().min(1).parse(result.data) });
      }
      if (path === "/api/import" && request.method === "POST") {
        limit(`import:${ip}`, 20);
        return json(
          await importProject(importSchema.parse(await input(request))),
        );
      }
      if (path === "/api/analyze" && request.method === "POST") {
        limit(`analyze:${ip}`, 8);
        const { project, role } = z
          .object({ project: projectSchema, role: roleSchema })
          .parse(await input(request));
        // A public demo never creates billable model calls. AI requires an account.
        const user = process.env.GEMINI_API_KEY ? await currentUser() : null;
        if (user) return json(await runPipeline(project, role));
        return json({
          evidence: collectEvidence(project),
          analysis: analyzeRules(project, role),
          suggestions: ruleSuggestions(project),
        });
      }
      throw new CloudError(404, "요청한 기능을 찾을 수 없습니다.");
    } catch (error) {
      return json(
        {
          error:
            error instanceof CloudError
              ? error.message
              : error instanceof z.ZodError
                ? "입력 형식이나 길이를 확인해주세요."
                : error instanceof Error &&
                    /GitHub|README|프로젝트 이름|공개 저장소|가져올 자료/.test(
                      error.message,
                    )
                  ? error.message
                  : "요청을 처리하지 못했습니다. 입력은 보존됩니다. 잠시 후 다시 시도해주세요.",
        },
        error instanceof CloudError
          ? error.status
          : error instanceof z.ZodError
            ? 400
            : 502,
      );
    }
  };
}
