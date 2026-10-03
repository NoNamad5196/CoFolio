import {
  criterionSchema,
  fieldLabels,
  fieldHints,
  fieldSchema,
  now,
  roles,
} from "./domain.ts";
import type {
  Analysis,
  Evidence,
  Finding,
  Project,
  Role,
  Suggestion,
} from "./domain.ts";

export function collectEvidence(project: Project): Evidence[] {
  const imported = project.evidence.filter((e) => e.kind !== "user");
  const statements: Evidence[] = fieldSchema.options.flatMap((field) =>
    project.fields[field].trim()
      ? [
          {
            id: `${project.id}:user:${field}`,
            kind: "user" as const,
            label: `사용자 진술 · ${fieldLabels[field]}`,
            excerpt: project.fields[field],
            field,
            capturedAt: project.updatedAt,
            verified: false,
          },
        ]
      : [],
  );
  return [...imported, ...statements];
}

export function analyzeRules(project: Project, role: Role): Analysis {
  const evidence = collectEvidence(project);
  const findings: Finding[] = criterionSchema.options.map((criterion) => {
    if (criterion === "documentation") {
      const docs = evidence.filter((e) => e.kind === "readme");
      const content = docs.map((e) => e.excerpt).join("\n");
      const structured =
        /^##?\s/m.test(content) &&
        /설치|실행|install|getting started|usage/i.test(content);
      return {
        criterion,
        status: !docs.length
          ? "missing"
          : structured
            ? "sufficient"
            : "improve",
        reason: !docs.length
          ? "가져온 README가 없습니다. 문서 내용은 확인하지 못했습니다."
          : structured
            ? "가져온 README에서 제목 구조와 설치·실행 안내를 확인했습니다. 실제 실행 성공 여부는 별도 검증이 필요합니다."
            : "README는 있지만 실행 안내 또는 문서 구조를 보완하면 좋습니다.",
        question:
          "설치 방법, 실행 명령과 주요 구조가 있는 README를 추가해주세요.",
        evidenceIds: docs.map((e) => e.id),
      };
    }
    if (criterion === "role") {
      const relevant = evidence.filter((e) =>
        roles[role].keywords.some((k) =>
          e.excerpt.toLowerCase().includes(k.toLowerCase()),
        ),
      );
      return {
        criterion,
        status: relevant.length ? "improve" : "missing",
        reason: relevant.length
          ? `${roles[role].label}의 검토 주제와 관련된 표현이 확인됩니다. 언급만으로 숙련도나 채용 적합성을 판단하지 않습니다.`
          : "현재 근거에서 이 직무의 검토 주제와 연결되는 설명을 찾지 못했습니다.",
        question: `${roles[role].focus} 중 직접 해결한 경험을 구체적으로 설명해주세요.`,
        evidenceIds: relevant.map((e) => e.id),
      };
    }
    const own = evidence.filter(
      (e) => e.kind === "user" && e.field === criterion,
    );
    const value = project.fields[criterion].trim();
    const documented = evidence.filter(
      (e) => e.kind === "readme" && e.field === criterion,
    );
    if (
      !value &&
      (criterion === "problem" || criterion === "implementation") &&
      documented.length
    )
      return {
        criterion,
        status: "improve",
        reason: `README에 프로젝트 차원의 ${fieldLabels[criterion]}가 설명되어 있습니다. 개인이 담당한 범위는 아직 확인하지 못했습니다.`,
        question: fieldHints[criterion],
        evidenceIds: documented.map((e) => e.id),
      };
    const status = !value ? "missing" : value.length < 35 ? "weak" : "improve";
    return {
      criterion,
      status,
      reason: !value
        ? `${fieldLabels[criterion]}에 대한 사용자 진술이 없습니다. README의 팀 전체 설명에서 개인의 경험을 추정하지 않았습니다.`
        : status === "weak"
          ? "설명이 짧아 담당 범위·맥락·검증 방법을 확인하기 어렵습니다."
          : "사용자 진술이 있습니다. 구체적인 구현 자료나 검증 결과를 연결해 내용을 확인해주세요.",
      question: fieldHints[criterion],
      evidenceIds: own.map((e) => e.id),
    };
  });
  return {
    id: crypto.randomUUID(),
    revision: project.revision,
    role,
    createdAt: now(),
    engine: "rules",
    notice:
      "규칙 기반 점검입니다. 설명의 존재와 연결을 검토하며 실제 역량을 평가하지 않습니다.",
    stages: ["정보 추출", "근거 연결", "누락 정보 분석", "개선 제안"].map(
      (name) => ({ name, status: "complete" as const }),
    ),
    findings,
    facts: evidence
      .slice(0, 24)
      .map((e) => ({ evidenceId: e.id, quote: e.excerpt.slice(0, 1500) })),
  };
}

export function ruleSuggestions(project: Project): Suggestion[] {
  // Extractive rewriting: reorganize existing user statements, never invent results or ownership.
  const fields = [
    "problem",
    "implementation",
    "contribution",
    "techReason",
    "troubleshooting",
    "outcome",
  ] as const;
  const present = fields.filter((f) => project.fields[f].trim());
  if (!present.length) return [];
  const after = present
    .map((f) => `${fieldLabels[f]}: ${project.fields[f].trim()}`)
    .join("\n\n");
  // Keep source statements intact instead of silently truncating an oversized rewrite.
  if (after.length > 12000) return [];
  if (after === project.fields.summary) return [];
  return [
    {
      id: crypto.randomUUID(),
      field: "summary",
      before: project.fields.summary,
      after,
      reason:
        "입력한 사실을 문제 → 구현 → 본인 기여 → 기술 선택 → 결과 순서로 재구성했습니다. 새로운 수치나 담당 범위는 추가하지 않았습니다.",
      evidenceIds: present.map((f) => `${project.id}:user:${f}`),
      status: "pending",
      revision: project.revision,
      edited: false,
    },
  ];
}

export function isCurrent(project: Project, role: Role) {
  return (
    project.analysis?.revision === project.revision &&
    project.analysis?.role === role
  );
}
export function gapCount(project: Project) {
  return (
    project.analysis?.findings.filter((f) => f.status !== "sufficient")
      .length ?? 0
  );
}
