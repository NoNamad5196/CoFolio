import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { Store } from "../server/database.ts";
import { createApp } from "../server/index.ts";
import { emptyWorkspace, makeProject } from "../src/v2/domain.ts";
import {
  collectEvidence,
  analyzeRules,
  ruleSuggestions,
} from "../src/v2/analysis.ts";

function removeTestDirectory(path: string) {
  if (!resolve(path).startsWith(resolve(tmpdir()) + sep)) {
    throw new Error("Unsafe test cleanup path");
  }
  rmSync(path, { recursive: true, force: true });
}

test("database persists related evidence/analysis/suggestions across restart, with owner isolation and revision conflicts", async () => {
  const dir = mkdtempSync(join(tmpdir(), "cofolio-test-"));
  const path = join(dir, "test.sqlite");
  let db = new Store(path);
  try {
    const a = await db.register("a@qa.test", "test-password-a", "A");
    const b = await db.register("b@qa.test", "test-password-b", "B");
    const w = emptyWorkspace();
    const p = makeProject("개인 프로젝트");
    p.fields.contribution = "주문 API 모듈을 직접 구현했습니다.";
    p.evidence = collectEvidence(p);
    p.analysis = analyzeRules(p, "backend");
    p.suggestions = ruleSuggestions(p);
    w.projects.push(p);
    const revision = db.save(a.id, w, 0);
    assert.equal(revision, 1);
    assert.throws(() => db.save(b.id, w, 0), /접근/);
    assert.throws(() => db.save(a.id, w, 0), /다른 창/);
    assert.equal(db.load(b.id).workspace.projects.length, 0);
    for (const table of ["projects", "evidence", "analyses", "suggestions"])
      assert.equal(
        db.db.prepare(`SELECT count(*) AS n FROM ${table}`).get()?.n,
        1,
      );
    db.close();
    db = new Store(path);
    assert.equal(db.load(a.id).workspace.projects[0].name, "개인 프로젝트");
    await assert.rejects(db.login("a@qa.test", "wrong-password"), /올바르지/);
    const session = db.session(a.id);
    assert.equal(db.user(session)?.id, a.id);
    db.logout(session);
    assert.equal(db.user(session), undefined);
    const hash = db.db
      .prepare("SELECT password_hash FROM users WHERE id=?")
      .get(a.id)?.password_hash;
    assert.ok(!String(hash).includes("test-password-a"));
  } finally {
    db.close();
    removeTestDirectory(dir);
  }
});
test("HTTP auth, import, analysis fallback, save, logout, user separation and CSRF errors", async () => {
  const store = new Store(":memory:");
  const server = createApp(store, { disableAi: true });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("no address");
  const base = `http://127.0.0.1:${address.port}`;
  async function request(
    path: string,
    method = "GET",
    data?: unknown,
    cookie = "",
    origin?: string,
  ) {
    return fetch(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        ...(origin ? { Origin: origin } : {}),
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }
  try {
    assert.equal((await request("/api/workspace")).status, 401);
    assert.equal(
      (
        await request("/api/auth/register", "POST", {
          email: "bad",
          password: "x",
        })
      ).status,
      400,
    );
    const registered = await request("/api/auth/register", "POST", {
      email: "person@qa.test",
      password: "qa-password-123",
      name: "테스트",
    });
    assert.equal(registered.status, 200);
    const cookie = registered.headers.get("set-cookie")!.split(";")[0];
    assert.match(
      registered.headers.get("set-cookie")!,
      /HttpOnly; SameSite=Lax/,
    );
    const w = (
      await (await request("/api/workspace", "GET", undefined, cookie)).json()
    ).workspace;
    const imported = await request("/api/import", "POST", {
      source: "manual",
      name: "QA 프로젝트",
      content: "입력한 설명",
      githubUrl: "",
    });
    const { project } = await imported.json();
    assert.equal(imported.status, 200);
    project.fields.contribution = "프로젝트 테스트와 인증 API를 구현했습니다.";
    const analyzed = await request("/api/analyze", "POST", {
      project,
      role: "backend",
    });
    const result = await analyzed.json();
    assert.equal(result.analysis.engine, "rules");
    assert.equal(result.analysis.findings.length, 8);
    w.projects.push({ ...project, ...result });
    assert.equal(
      (
        await request(
          "/api/workspace",
          "PUT",
          { workspace: w, revision: 0 },
          cookie,
        )
      ).status,
      200,
    );
    assert.equal(
      (await (await request("/api/workspace", "GET", undefined, cookie)).json())
        .workspace.projects[0].name,
      "QA 프로젝트",
    );
    assert.equal(
      (
        await request(
          "/api/workspace",
          "PUT",
          { workspace: w, revision: 0 },
          cookie,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await request(
          "/api/workspace",
          "PUT",
          { workspace: w, revision: 1 },
          cookie,
          "https://evil.test",
        )
      ).status,
      403,
    );
    const registeredB = await request("/api/auth/register", "POST", {
      email: "second@qa.test",
      password: "qa-password-456",
    });
    const cookieB = registeredB.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (
        await request(
          "/api/workspace",
          "PUT",
          { workspace: w, revision: 0 },
          cookieB,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await (
          await request("/api/workspace", "GET", undefined, cookieB)
        ).json()
      ).workspace.projects.length,
      0,
    );
    await request("/api/auth/logout", "POST", {}, cookie);
    assert.equal(
      (await request("/api/workspace", "GET", undefined, cookie)).status,
      401,
    );
    const login = await request("/api/auth/login", "POST", {
      email: "person@qa.test",
      password: "qa-password-123",
    });
    assert.equal(login.status, 200);
    assert.equal((await request("/api/not-real")).status, 404);
  } finally {
    await new Promise<void>((r) => server.close(() => r()));
    store.close();
  }
});
