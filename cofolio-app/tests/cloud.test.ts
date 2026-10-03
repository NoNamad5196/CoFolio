import test from "node:test";
import assert from "node:assert/strict";
import { createCloudHandler } from "../server/cloud.ts";
import { makeProject } from "../src/v2/domain.ts";

const base = "https://cofolio.test";
function request(path: string, data?: unknown, origin = base) {
  return new Request(base + path, {
    method: data === undefined ? "GET" : "POST",
    headers:
      data === undefined
        ? {}
        : { "Content-Type": "application/json", Origin: origin },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
}
const fakeSettings = {
  url: "https://project.supabase.co",
  key: "test-anon-key",
};

test("cloud guest session, import and grounded fallback work without a database session", async () => {
  const handler = createCloudHandler({
    ...fakeSettings,
    fetch: async () => {
      throw new Error("Guest must not call Auth");
    },
  });
  assert.deepEqual(await (await handler(request("/api/auth/session"))).json(), {
    user: null,
  });
  const imported = await handler(
    request("/api/import", {
      source: "manual",
      name: "클라우드 QA",
      content: "주문 API를 개발했습니다.",
      githubUrl: "",
    }),
  );
  assert.equal(imported.status, 200);
  const { project } = await imported.json();
  project.fields.contribution = "주문 API의 입력 검증을 담당했습니다.";
  const result = await (
    await handler(request("/api/analyze", { project, role: "backend" }))
  ).json();
  assert.equal(result.analysis.engine, "rules");
  assert.equal(result.analysis.findings.length, 8);
  assert.equal(result.suggestions.length, 1);
  assert.equal((await handler(request("/api/workspace"))).status, 401);
});

test("cloud route rejects wrong origin, invalid inputs and unknown routes", async () => {
  const handler = createCloudHandler(fakeSettings);
  assert.equal(
    (await handler(request("/api/import", {}, "https://evil.test"))).status,
    403,
  );
  assert.equal(
    (await handler(request("/api/import", { source: "bad" }))).status,
    400,
  );
  assert.equal((await handler(request("/api/missing"))).status, 404);
  assert.equal(
    (
      await handler(
        new Request(base + "/api/import", { method: "POST", body: "{}" }),
      )
    ).status,
    415,
  );
  assert.equal(
    (await handler(request("/api/auth/callback"))).headers.get("location"),
    base + "/settings?auth=error",
  );
});

test("cloud signup supports email confirmation without inventing a logged-in session", async () => {
  const handler = createCloudHandler({
    ...fakeSettings,
    fetch: async (input) => {
      assert.ok(String(input).includes("/auth/v1/signup"));
      return Response.json({
        id: crypto.randomUUID(),
        email: "qa@example.test",
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {},
        user_metadata: { name: "QA" },
        created_at: new Date().toISOString(),
        identities: [],
      });
    },
  });
  const result = await handler(
    request("/api/auth/register", {
      email: "qa@example.test",
      password: "test-only-password",
      name: "QA",
    }),
  );
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), {
    user: null,
    confirmationRequired: true,
  });
  assert.match(result.headers.get("set-cookie") || "", /HttpOnly/i);
  assert.match(result.headers.get("set-cookie") || "", /Secure/i);
});

test("cloud import requests are bounded per function instance", async () => {
  const handler = createCloudHandler(fakeSettings);
  for (let i = 0; i < 8; i++)
    assert.equal(
      (
        await handler(
          request("/api/analyze", {
            project: makeProject("검토"),
            role: "game",
          }),
        )
      ).status,
      200,
    );
  assert.equal(
    (
      await handler(
        request("/api/analyze", { project: makeProject("검토"), role: "game" }),
      )
    ).status,
    429,
  );
});
