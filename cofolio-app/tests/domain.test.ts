import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeRules,
  collectEvidence,
  ruleSuggestions,
} from "../src/v2/analysis.ts";
import {
  decideSuggestion,
  editProject,
  emptyWorkspace,
  makeProject,
  workspaceSchema,
} from "../src/v2/domain.ts";
import { portfolioHtml, portfolioMarkdown } from "../src/v2/export.ts";
import { groundedNumbers, runPipeline } from "../server/pipeline.ts";
import { importProject, parseGithubUrl } from "../server/import.ts";

test("valid grounded model output completes all stages without changing source", async () => {
  const p = makeProject("검증 서비스");
  p.fields.implementation = "주문 API의 입력 검증을 구현했습니다.";
  const id = `${p.id}:user:implementation`;
  const result = await runPipeline(p, "backend", async (name, schema) => {
    if (name === "프로젝트 정보 추출")
      return schema.parse({
        facts: [{ evidenceId: id, quote: p.fields.implementation }],
      });
    if (name === "누락 정보 분석")
      return schema.parse({ findings: analyzeRules(p, "backend").findings });
    return schema.parse({
      suggestions: [
        {
          field: "summary",
          after: p.fields.implementation,
          reason: "구현 사실을 설명에 연결합니다.",
          evidenceIds: [id],
        },
      ],
    });
  });
  assert.equal(result.analysis.engine, "ai");
  assert.ok(result.analysis.stages.every((s) => s.status === "complete"));
  assert.equal(result.suggestions[0].status, "pending");
  assert.equal(p.fields.summary, "");
});

test("duplicate model criteria fall back while keeping validated extraction", async () => {
  const p = makeProject("중복 출력");
  p.fields.implementation = "입력 검증을 구현했습니다.";
  const result = await runPipeline(p, "backend", async (name, schema) =>
    name === "프로젝트 정보 추출"
      ? schema.parse({
          facts: [
            {
              evidenceId: `${p.id}:user:implementation`,
              quote: p.fields.implementation,
            },
          ],
        })
      : schema.parse({
          findings: Array.from(
            { length: 8 },
            () => analyzeRules(p, "backend").findings[0],
          ),
        }),
  );
  assert.equal(result.analysis.engine, "hybrid");
  assert.equal(
    new Set(result.analysis.findings.map((f) => f.criterion)).size,
    8,
  );
  assert.equal(result.analysis.stages[2].status, "fallback");
});

test("explicit README sections become project-level evidence without personal attribution", async () => {
  const { project } = await importProject({
    source: "readme",
    name: "주문 관리",
    content:
      "# 주문 관리\n## 문제\n동시 주문 시 재고가 음수가 됩니다.\n## 구현\n트랜잭션과 행 잠금을 사용합니다.\n## 본인 기여\n팀이 전체 API를 만들었습니다.\n## 결과\n처리량이 증가했습니다.",
    githubUrl: "",
  });
  const sections = project.evidence.filter((e) => e.field);
  assert.deepEqual(
    sections.map((e) => e.field),
    ["problem", "implementation"],
  );
  assert.equal(sections[0].excerpt, "동시 주문 시 재고가 음수가 됩니다.");
  const analysis = analyzeRules(project, "backend");
  for (const criterion of ["problem", "implementation"]) {
    const finding = analysis.findings.find((f) => f.criterion === criterion)!;
    assert.equal(finding.status, "improve");
    assert.ok(
      finding.evidenceIds.every((id) => sections.some((e) => e.id === id)),
    );
  }
  assert.equal(
    analysis.findings.find((f) => f.criterion === "contribution")?.status,
    "missing",
  );
  assert.equal(
    analysis.findings.find((f) => f.criterion === "outcome")?.status,
    "missing",
  );
  assert.equal(project.fields.implementation, "");
});

test("exports retain example attribution and profile links", () => {
  const w = emptyWorkspace();
  w.profile.github = "https://github.com/developer";
  const p = makeProject("참고 자료");
  p.source = "example";
  w.projects = [p];
  for (const output of [portfolioMarkdown(w), portfolioHtml(w)]) {
    assert.match(output, /예시 프로젝트/);
    assert.match(output, /https:\/\/github.com\/developer/);
  }
});

test("long source statements cannot create an invalid oversized suggestion", () => {
  const p = makeProject("긴 입력");
  p.fields.contribution = "가".repeat(12000);
  p.fields.problem = "나".repeat(12000);
  assert.deepEqual(ruleSuggestions(p), []);
  assert.equal(p.fields.contribution.length, 12000);
});

test("README alone never establishes personal contribution, reason or outcome", async () => {
  const { project } = await importProject({
    source: "readme",
    name: "주문 관리",
    content:
      "# 프로젝트\n팀이 API 20개를 개발해 성능을 90% 개선했습니다.\n## 설치\nnpm install",
    githubUrl: "",
  });
  const analysis = analyzeRules(project, "backend");
  for (const criterion of ["contribution", "techReason", "outcome"])
    assert.equal(
      analysis.findings.find((f) => f.criterion === criterion)?.status,
      "missing",
    );
  assert.equal(
    analysis.findings.find((f) => f.criterion === "documentation")?.status,
    "sufficient",
  );
  assert.equal(ruleSuggestions(project).length, 0);
});
test("manual input and user statements create distinct provenance", async () => {
  const { project } = await importProject({
    source: "manual",
    name: "API 서비스",
    content: "스터디 관리 서비스",
    githubUrl: "",
  });
  project.fields.contribution =
    "제가 회원 가입 API의 입력 검증을 구현했습니다.";
  const evidence = collectEvidence(project);
  assert.equal(evidence.length, 2);
  assert.ok(evidence.every((e) => e.kind === "user" && !e.verified));
});
test("all four roles use different review focuses", () => {
  const p = makeProject("모델 실험");
  p.fields.implementation = "데이터 분할과 모델 평가 실험을 재현합니다.";
  assert.equal(
    analyzeRules(p, "ai").findings.find((f) => f.criterion === "role")?.status,
    "improve",
  );
  assert.equal(
    analyzeRules(p, "game").findings.find((f) => f.criterion === "role")
      ?.status,
    "missing",
  );
  assert.equal(analyzeRules(p, "frontend").role, "frontend");
  assert.equal(analyzeRules(p, "backend").role, "backend");
});
test("rewrite is proposed without modifying original; reject preserves it", () => {
  const p = makeProject("테스트");
  p.fields.summary = "원문";
  p.fields.contribution = "주문 API를 구현했습니다.";
  p.suggestions = ruleSuggestions(p);
  assert.equal(p.fields.summary, "원문");
  const next = decideSuggestion(p, p.suggestions[0].id, "rejected");
  assert.equal(next.fields.summary, "원문");
  assert.equal(next.suggestions[0].status, "rejected");
});
test("apply and manual edit update the field; stale suggestions cannot overwrite newer text", () => {
  const p = makeProject("테스트");
  p.fields.contribution = "트랜잭션 구현";
  p.suggestions = ruleSuggestions(p);
  const next = decideSuggestion(
    p,
    p.suggestions[0].id,
    "applied",
    "직접 수정한 프로젝트 설명",
  );
  assert.equal(next.fields.summary, "직접 수정한 프로젝트 설명");
  assert.equal(next.suggestions[0].edited, true);
  assert.equal(next.revision, 1);
  const changed = editProject(p, {
    fields: { ...p.fields, summary: "새 원문" },
  });
  assert.throws(() =>
    decideSuggestion(changed, p.suggestions[0].id, "applied"),
  );
  assert.equal(changed.fields.summary, "새 원문");
});
test("AI outage returns validated deterministic analysis and extractive suggestion", async () => {
  const p = makeProject("테스트");
  p.fields.contribution = "주문 처리 모듈을 구현했습니다.";
  const result = await runPipeline(p, "backend", async () => {
    throw new Error("503");
  });
  assert.equal(result.analysis.engine, "rules");
  assert.equal(result.analysis.findings.length, 8);
  assert.equal(result.suggestions.length, 1);
  assert.equal(result.analysis.stages[0].status, "fallback");
});
test("malformed AI JSON and missing fields fall back without crashing", async () => {
  const p = makeProject("검증");
  const result = await runPipeline(p, "game", async (_name, schema) =>
    schema.parse({ invalid: true }),
  );
  assert.equal(result.analysis.engine, "rules");
  assert.equal(result.analysis.role, "game");
});
test("hallucinated extracted quotes are rejected", async () => {
  const p = makeProject("검증");
  p.fields.summary = "API를 구현했습니다.";
  const result = await runPipeline(p, "backend", async (_name, schema) =>
    schema.parse({
      facts: [{ evidenceId: `${p.id}:user:summary`, quote: "이용자 100만 명" }],
    }),
  );
  assert.equal(result.analysis.engine, "rules");
  assert.equal(result.analysis.facts.length, 0);
});
test("pipeline validates every stage, prevents unsupported personal claims and metric invention", async () => {
  const p = makeProject("API 프로젝트");
  p.fields.implementation = "주문 API에 입력 검증을 구현했습니다.";
  const base = analyzeRules(p, "backend");
  let stages = 0;
  const result = await runPipeline(p, "backend", async (name, schema) => {
    stages++;
    if (name === "프로젝트 정보 추출")
      return schema.parse({
        facts: [
          {
            evidenceId: `${p.id}:user:implementation`,
            quote: p.fields.implementation,
          },
        ],
      });
    if (name === "누락 정보 분석")
      return schema.parse({
        findings: base.findings.map((f) =>
          f.criterion === "contribution"
            ? {
                ...f,
                status: "sufficient",
                evidenceIds: [`${p.id}:user:implementation`],
              }
            : f,
        ),
      });
    return schema.parse({
      suggestions: [
        {
          field: "summary",
          after: "성능을 99% 개선했습니다.",
          reason: "테스트",
          evidenceIds: [`${p.id}:user:implementation`],
        },
      ],
    });
  });
  assert.equal(stages, 3);
  assert.equal(
    result.analysis.findings.find((f) => f.criterion === "contribution")
      ?.status,
    "missing",
  );
  assert.ok(result.suggestions.every((s) => !s.after.includes("99%")));
});
test("numeric grounding rejects unsupported metrics", () => {
  assert.equal(groundedNumbers("성능 90% 개선", "API 구현"), false);
  assert.equal(groundedNumbers("10개 API 구현", "API 10개 구현"), true);
});
test("GitHub URL parser blocks SSRF, credentials, lookalike hosts and file paths", () => {
  assert.deepEqual(
    parseGithubUrl("https://github.com/octocat/Hello-World.git"),
    { owner: "octocat", repo: "Hello-World" },
  );
  for (const url of [
    "http://localhost/x",
    "https://github.com.evil.test/a/b",
    "https://evil.test/a/b",
    "https://u:p@github.com/a/b",
    "https://github.com/a/b/blob/main/README.md",
  ])
    assert.throws(() => parseGithubUrl(url));
});
test("GitHub import consumes real-shaped public metadata and UTF-8 readme, no personal fields", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    return Response.json(
      url.endsWith("/readme")
        ? {
            content: Buffer.from("# 한글 README\n설치 방법").toString("base64"),
            encoding: "base64",
            html_url: "https://github.com/team/repo/blob/main/README.md",
          }
        : url.endsWith("/languages")
          ? { TypeScript: 1000 }
          : {
              name: "repo",
              full_name: "team/repo",
              private: false,
              description: "주문 서비스",
              homepage: "javascript:alert(1)",
              default_branch: "main",
            },
    );
  };
  try {
    const { project } = await importProject({
      source: "github",
      name: "",
      content: "",
      githubUrl: "https://github.com/team/repo",
    });
    assert.ok(project.readme.includes("한글"));
    assert.equal(project.fields.contribution, "");
    assert.equal(project.deployUrl, "");
    assert.equal(project.evidence.length, 2);
    assert.deepEqual(project.stack, ["TypeScript"]);
  } finally {
    globalThis.fetch = original;
  }
});
test("GitHub 404/403 and missing README have recoverable outcomes", async () => {
  const original = globalThis.fetch;
  try {
    for (const status of [403, 404]) {
      globalThis.fetch = async () => new Response("", { status });
      await assert.rejects(
        importProject({
          source: "github",
          name: "",
          content: "",
          githubUrl: "https://github.com/team/repo",
        }),
      );
    }
    globalThis.fetch = async (input) =>
      String(input).endsWith("/repo")
        ? Response.json({
            name: "repo",
            full_name: "team/repo",
            private: false,
          })
        : new Response("", { status: 404 });
    const result = await importProject({
      source: "github",
      name: "",
      content: "",
      githubUrl: "https://github.com/team/repo",
    });
    assert.equal(result.project.evidence.length, 1);
    assert.match(result.notice, /README는 확인하지 못/);
  } finally {
    globalThis.fetch = original;
  }
});
test("HTML export escapes scripts and unsafe links; export matches included order", () => {
  const w = emptyWorkspace();
  w.profile.name = "<script>alert(1)</script>";
  const first = makeProject("첫 프로젝트");
  const second = makeProject("두 번째");
  const excluded = makeProject("제외됨");
  excluded.included = false;
  first.githubUrl = "javascript:alert(1)";
  w.projects = [second, first, excluded];
  const html = portfolioHtml(w);
  assert.ok(!html.includes("<script>"));
  assert.ok(!html.includes("javascript:"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("제외됨"));
  assert.ok(html.indexOf("두 번째") < html.indexOf("첫 프로젝트"));
  const md = portfolioMarkdown(w);
  assert.ok(!md.includes("제외됨"));
  assert.ok(md.includes("\\<script"));
});
test("corrupt and oversized workspace documents fail schema validation", () => {
  assert.equal(workspaceSchema.safeParse({ version: 1 }).success, false);
  const w = emptyWorkspace();
  w.profile.name = "가".repeat(101);
  assert.equal(workspaceSchema.safeParse(w).success, false);
});
