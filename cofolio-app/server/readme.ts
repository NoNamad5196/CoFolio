import { fieldLabels } from "../src/v2/domain.ts";
import type { Evidence, Field } from "../src/v2/domain.ts";
/** Extract only explicitly titled project-level sections; never infer personal experience. */
export function readmeSections(source: Evidence): Evidence[] {
  if (source.kind !== "readme") return [];
  const sections = [
    ...source.excerpt.matchAll(
      /^#{1,3}\s+(.+)\r?\n([\s\S]*?)(?=^#{1,3}\s|$(?![\s\S]))/gm,
    ),
  ];
  const seen = new Set<Field>();
  return sections.flatMap((match) => {
    const title = match[1]
      .trim()
      .toLowerCase()
      .replace(/^\d+[.)]\s*/, "");
    const field: Field | undefined =
      /^(소개|개요|프로젝트 소개|overview|about)$/.test(title)
        ? "summary"
        : /^(문제|문제 정의|배경|해결한 문제|problem|motivation)$/.test(title)
          ? "problem"
          : /^(구현|구현 내용|주요 기능|기능|features|implementation|architecture)$/.test(
                title,
              )
            ? "implementation"
            : undefined;
    const excerpt = match[2].trim().slice(0, 3000);
    if (!field || !excerpt || seen.has(field)) return [];
    seen.add(field);
    return [
      {
        ...source,
        id: `${source.id}:section:${field}`,
        field,
        label: `README 발췌 · ${fieldLabels[field]}`,
        excerpt,
      },
    ];
  });
}
