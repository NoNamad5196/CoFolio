import { importSchema, makeProject, now, safeUrl } from "../src/v2/domain.ts";
import type { ImportInput, Project } from "../src/v2/domain.ts";
import { readmeSections } from "./readme.ts";

export function parseGithubUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("https://github.com/소유자/저장소 형식으로 입력해주세요.");
  }
  const parts = url.pathname.replace(/\/$/, "").split("/").filter(Boolean);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    url.username ||
    url.password ||
    url.port ||
    parts.length !== 2 ||
    parts.some((p) => !/^[\w.-]+$/.test(p) || p === "." || p === "..")
  )
    throw new Error(
      "공개 GitHub 저장소의 기본 URL을 입력해주세요. 파일·브랜치 URL은 지원하지 않습니다.",
    );
  return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
}
export async function boundedJson(
  response: Response,
  limit = 1_500_000,
): Promise<unknown> {
  if (!response.body) throw new Error("응답 내용이 없습니다.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) {
        await reader.cancel();
        throw new Error(
          "가져올 자료가 너무 큽니다. 필요한 README 부분만 붙여넣어주세요.",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function github(path: string, optional = false) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "CoFolio-Workspace-V2",
    },
    signal: AbortSignal.timeout(12000),
    redirect: "error",
  });
  if (optional && response.status === 404) return null;
  if (!response.ok)
    throw new Error(
      response.status === 404
        ? "공개 저장소를 찾을 수 없습니다. 주소와 공개 여부를 확인해주세요."
        : response.status === 403 || response.status === 429
          ? "GitHub 요청 한도에 도달했습니다. 잠시 후 다시 시도하거나 README를 붙여넣어주세요."
          : "GitHub에서 자료를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.",
    );
  return boundedJson(response);
}
function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
export async function importProject(
  input: ImportInput,
): Promise<{ project: Project; notice: string }> {
  const data = importSchema.parse(input);
  if (data.source !== "github") {
    if (!data.name.trim() || !data.content.trim())
      throw new Error("프로젝트 이름과 내용을 입력해주세요.");
    const project = makeProject(data.name.trim(), data.source);
    if (data.source === "readme") {
      project.readme = data.content;
      project.evidence = [
        {
          id: `${project.id}:readme`,
          kind: "readme",
          label: "README · 직접 제공",
          excerpt: data.content.slice(0, 12000),
          capturedAt: now(),
          verified: false,
        },
      ];
      project.evidence.push(...readmeSections(project.evidence[0]));
    } else project.fields.summary = data.content;
    return {
      project,
      notice:
        data.source === "readme"
          ? "README를 보관했습니다. 개인 기여와 기술 선택 이유는 직접 보완해주세요."
          : "프로젝트를 만들었습니다. 구체적인 경험을 보완하고 분석해보세요.",
    };
  }
  const { owner, repo } = parseGithubUrl(data.githubUrl);
  const base = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const metadata = record(await github(base));
  if (metadata.private !== false || typeof metadata.name !== "string")
    throw new Error("공개 저장소 정보인지 확인할 수 없습니다.");
  const [readmeResult, languageResult] = await Promise.allSettled([
    github(`${base}/readme`, true),
    github(`${base}/languages`, true),
  ]);
  const readme = record(
    readmeResult.status === "fulfilled" ? readmeResult.value : null,
  );
  const languages = record(
    languageResult.status === "fulfilled" ? languageResult.value : null,
  );
  const project = makeProject(data.name.trim() || metadata.name, "github");
  project.githubUrl = `https://github.com/${owner}/${repo}`;
  project.deployUrl =
    typeof metadata.homepage === "string" ? safeUrl(metadata.homepage) : "";
  project.stack = Object.keys(languages).slice(0, 20);
  project.readme =
    typeof readme.content === "string" && readme.encoding === "base64"
      ? Buffer.from(readme.content, "base64").toString("utf8").slice(0, 24000)
      : "";
  project.evidence = [
    {
      id: `${project.id}:repository`,
      kind: "repository",
      label: "GitHub · 저장소 정보",
      excerpt: `저장소: ${metadata.full_name}\n설명: ${typeof metadata.description === "string" ? metadata.description : "없음"}\n언어: ${project.stack.join(", ") || "확인하지 못함"}\n기본 브랜치: ${metadata.default_branch}`,
      url: project.githubUrl,
      capturedAt: now(),
      verified: true,
    },
  ];
  if (project.readme)
    project.evidence.push({
      id: `${project.id}:readme`,
      kind: "readme",
      label: "README · GitHub",
      excerpt: project.readme.slice(0, 12000),
      url:
        typeof readme.html_url === "string"
          ? safeUrl(readme.html_url)
          : project.githubUrl,
      capturedAt: now(),
      verified: true,
    });
  const document = project.evidence.find((e) => e.kind === "readme");
  if (document) project.evidence.push(...readmeSections(document));
  return {
    project,
    notice: `${project.readme ? "저장소 정보와 README를 가져왔습니다." : "저장소 정보는 가져왔지만 README는 확인하지 못했습니다."} 저장소에 등록된 언어와 배포 URL은 개인 기여나 배포 성공의 증거가 아닙니다.`,
  };
}
