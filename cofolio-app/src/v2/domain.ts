import { z } from "zod";

export const roleSchema = z.enum(["backend", "frontend", "ai", "game"]);
export type Role = z.infer<typeof roleSchema>;
export const roles: Record<
  Role,
  { label: string; focus: string; keywords: string[] }
> = {
  backend: {
    label: "백엔드 개발자",
    focus: "API 설계 · 데이터 정합성 · 동시성 · 운영 안정성",
    keywords: ["API", "트랜잭션", "동시성", "데이터베이스", "테스트", "캐시"],
  },
  frontend: {
    label: "프론트엔드 개발자",
    focus: "사용자 경험 · 상태 관리 · 접근성 · 렌더링 성능",
    keywords: ["접근성", "상태", "렌더링", "컴포넌트", "반응형", "테스트"],
  },
  ai: {
    label: "AI 엔지니어",
    focus: "데이터 품질 · 평가 방법 · 모델 선택 · 추론 운영",
    keywords: ["데이터", "평가", "모델", "추론", "실험", "재현"],
  },
  game: {
    label: "게임 프로그래머",
    focus: "게임플레이 · 프레임 성능 · 메모리 · 시스템 설계",
    keywords: ["게임플레이", "프레임", "메모리", "렌더링", "물리", "네트워크"],
  },
};
export const fieldSchema = z.enum([
  "summary",
  "problem",
  "implementation",
  "contribution",
  "techReason",
  "troubleshooting",
  "outcome",
]);
export type Field = z.infer<typeof fieldSchema>;
export const fieldLabels: Record<Field, string> = {
  summary: "프로젝트 설명",
  problem: "해결한 문제",
  implementation: "구현 내용",
  contribution: "본인 기여",
  techReason: "기술 선택 이유",
  troubleshooting: "문제 해결 과정",
  outcome: "결과 및 성과",
};
export const fieldHints: Record<Field, string> = {
  summary: "어떤 사용자를 위해 무엇을 만든 프로젝트인가요?",
  problem: "누가 어떤 불편을 겪었나요? 해결해야 했던 제약도 적어주세요.",
  implementation: "직접 구현한 구조, API, 모듈과 검증 방법을 설명해주세요.",
  contribution: "팀 전체 작업과 구분해 직접 담당한 API·모듈·기능을 입력하세요.",
  techReason: "어떤 대안을 비교했고, 어떤 제약 때문에 이 기술을 선택했나요?",
  troubleshooting:
    "문제 증상 → 원인 확인 → 해결 과정 → 검증 순서로 적어주세요.",
  outcome:
    "관찰한 결과와 확인 방법을 적어주세요. 측정하지 않은 숫자는 넣지 않아도 됩니다.",
};
const text = z.string().max(12000);
export const evidenceSchema = z.object({
  id: z.string(),
  kind: z.enum(["readme", "repository", "user"]),
  label: z.string(),
  excerpt: text,
  field: fieldSchema.optional(),
  url: z.string().max(2000).optional(),
  capturedAt: z.string(),
  verified: z.boolean(),
});
export type Evidence = z.infer<typeof evidenceSchema>;
export const statusSchema = z.enum([
  "sufficient",
  "improve",
  "weak",
  "missing",
]);
export type Status = z.infer<typeof statusSchema>;
export const statusLabels: Record<Status, string> = {
  sufficient: "충분",
  improve: "보완 필요",
  weak: "부족",
  missing: "근거 없음",
};
export const criterionSchema = z.enum([
  "problem",
  "techReason",
  "implementation",
  "contribution",
  "troubleshooting",
  "outcome",
  "documentation",
  "role",
]);
export type Criterion = z.infer<typeof criterionSchema>;
export const criterionLabels: Record<Criterion, string> = {
  ...fieldLabels,
  problem: "문제 정의",
  techReason: "기술 선택",
  implementation: "구현 깊이",
  troubleshooting: "문제 해결",
  documentation: "문서화",
  role: "목표 직무 연관성",
};
export const findingSchema = z.object({
  criterion: criterionSchema,
  status: statusSchema,
  reason: z.string().max(1600),
  question: z.string().max(1000),
  evidenceIds: z.array(z.string()).max(20),
});
export type Finding = z.infer<typeof findingSchema>;
export const extractionSchema = z.object({
  facts: z
    .array(
      z.object({ evidenceId: z.string(), quote: z.string().min(1).max(2000) }),
    )
    .max(24),
});
export const gapOutputSchema = z.object({
  findings: z.array(findingSchema).length(8),
});
export const rewriteOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        field: fieldSchema,
        after: z.string().min(1).max(6000),
        reason: z.string().max(1200),
        evidenceIds: z.array(z.string()).min(1).max(20),
      }),
    )
    .max(5),
});
export const analysisSchema = z.object({
  id: z.string(),
  revision: z.number().int(),
  role: roleSchema,
  createdAt: z.string(),
  engine: z.enum(["rules", "ai", "hybrid"]),
  notice: z.string(),
  stages: z.array(
    z.object({ name: z.string(), status: z.enum(["complete", "fallback"]) }),
  ),
  findings: z.array(findingSchema),
  facts: extractionSchema.shape.facts,
});
export type Analysis = z.infer<typeof analysisSchema>;
export const suggestionSchema = z.object({
  id: z.string(),
  field: fieldSchema,
  before: text,
  after: text,
  reason: z.string(),
  evidenceIds: z.array(z.string()),
  status: z.enum(["pending", "applied", "rejected", "stale"]),
  revision: z.number().int(),
  edited: z.boolean().default(false),
});
export type Suggestion = z.infer<typeof suggestionSchema>;
export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(150),
  source: z.enum(["github", "readme", "manual", "example"]),
  githubUrl: z.string().max(2000).default(""),
  deployUrl: z.string().max(2000).default(""),
  period: z.string().max(100).default(""),
  stack: z.array(z.string().max(100)).max(30).default([]),
  readme: z.string().max(24000).default(""),
  fields: z.object({
    summary: text.default(""),
    problem: text.default(""),
    implementation: text.default(""),
    contribution: text.default(""),
    techReason: text.default(""),
    troubleshooting: text.default(""),
    outcome: text.default(""),
  }),
  evidence: z.array(evidenceSchema).max(60).default([]),
  analysis: analysisSchema.nullable().default(null),
  suggestions: z.array(suggestionSchema).max(50).default([]),
  revision: z.number().int().min(0).default(0),
  updatedAt: z.string(),
  included: z.boolean().default(true),
  portfolioDescription: text.default(""),
});
export type Project = z.infer<typeof projectSchema>;
export const workspaceSchema = z.object({
  version: z.literal(2),
  id: z.string().uuid(),
  title: z.string().max(150),
  role: roleSchema,
  profile: z.object({
    name: z.string().max(100),
    bio: z.string().max(2000),
    email: z.string().max(250),
    github: z.string().max(2000),
    stack: z.string().max(1500),
  }),
  projects: z.array(projectSchema).max(40),
  updatedAt: z.string(),
});
export type Workspace = z.infer<typeof workspaceSchema>;
export const importSchema = z.object({
  source: z.enum(["github", "readme", "manual"]),
  name: z.string().max(150).default(""),
  content: z.string().max(24000).default(""),
  githubUrl: z.string().max(2000).default(""),
});
export type ImportInput = z.infer<typeof importSchema>;
export const now = () => new Date().toISOString();
export function emptyWorkspace(): Workspace {
  return {
    version: 2,
    id: crypto.randomUUID(),
    title: "나의 개발자 포트폴리오",
    role: "backend",
    profile: { name: "", bio: "", email: "", github: "", stack: "" },
    projects: [],
    updatedAt: now(),
  };
}
export function makeProject(
  name: string,
  source: Project["source"] = "manual",
): Project {
  return projectSchema.parse({
    id: crypto.randomUUID(),
    name,
    source,
    fields: {},
    updatedAt: now(),
  });
}
export function safeUrl(value: string): string {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
export function editProject(
  project: Project,
  patch: Partial<Project>,
): Project {
  return {
    ...project,
    ...patch,
    revision: project.revision + 1,
    updatedAt: now(),
    suggestions: project.suggestions.map((s) =>
      s.status === "pending" ? { ...s, status: "stale" } : s,
    ),
  };
}
export function decideSuggestion(
  project: Project,
  id: string,
  action: "applied" | "rejected",
  edited?: string,
): Project {
  const suggestion = project.suggestions.find((s) => s.id === id);
  if (!suggestion || suggestion.status !== "pending")
    throw new Error("검토할 수 없는 제안입니다. 다시 분석해주세요.");
  if (
    project.revision !== suggestion.revision ||
    project.fields[suggestion.field] !== suggestion.before
  )
    throw new Error("분석 이후 원문이 변경되었습니다. 다시 분석해주세요.");
  if (action === "rejected")
    return {
      ...project,
      suggestions: project.suggestions.map((s) =>
        s.id === id ? { ...s, status: "rejected" } : s,
      ),
      updatedAt: now(),
    };
  const after = edited?.trim() || suggestion.after;
  const next = editProject(project, {
    fields: { ...project.fields, [suggestion.field]: after },
  });
  return {
    ...next,
    suggestions: next.suggestions.map((s) =>
      s.id === id
        ? { ...s, after, edited: edited !== undefined, status: "applied" }
        : s,
    ),
  };
}
