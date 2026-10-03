import { fieldLabels, roles, safeUrl } from "./domain.ts";
import type { Workspace } from "./domain.ts";
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const escapeMd = (value: string) => value.replace(/[\\`*_{}[\]<>]/g, "\\$&");
export function portfolioMarkdown(workspace: Workspace) {
  const { profile } = workspace;
  const lines = [
    `# ${escapeMd(profile.name || "개발자 포트폴리오")}`,
    roles[workspace.role].label,
    "",
    escapeMd(profile.bio),
    "",
    "## 기술 스택",
    escapeMd(profile.stack),
    "",
    "## 프로젝트",
  ];
  workspace.projects
    .filter((p) => p.included)
    .forEach((p) => {
      lines.push(
        "",
        `### ${escapeMd(p.name)}${p.source === "example" ? " (예시 프로젝트)" : ""}`,
        escapeMd(p.period),
        escapeMd(p.stack.join(" · ")),
        "",
        escapeMd(p.portfolioDescription || p.fields.summary),
      );
      if (!p.portfolioDescription)
        for (const [field, label] of Object.entries(fieldLabels)) {
          if (field !== "summary" && p.fields[field as keyof typeof p.fields])
            lines.push(
              "",
              `**${label}**`,
              escapeMd(p.fields[field as keyof typeof p.fields]),
            );
        }
      if (safeUrl(p.githubUrl))
        lines.push(
          "",
          `[GitHub](${encodeURI(safeUrl(p.githubUrl)).replace(/[()]/g, (c) => (c === "(" ? "%28" : "%29"))})`,
        );
      if (safeUrl(p.deployUrl))
        lines.push(
          "",
          `[배포 페이지](${encodeURI(safeUrl(p.deployUrl)).replace(/[()]/g, (c) => (c === "(" ? "%28" : "%29"))})`,
        );
    });
  if (profile.email) lines.push("", `연락처: ${escapeMd(profile.email)}`);
  if (safeUrl(profile.github))
    lines.push(
      "",
      `[GitHub 프로필](${encodeURI(safeUrl(profile.github)).replace(/[()]/g, (c) => (c === "(" ? "%28" : "%29"))})`,
    );
  return lines.join("\n");
}
export function portfolioHtml(workspace: Workspace) {
  const e = escapeHtml;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(workspace.profile.name || "포트폴리오")}</title><style>body{font:15px/1.8 system-ui,sans-serif;color:#172033;background:#f6f8fc;margin:0;padding:48px 24px}main{max-width:800px;margin:auto;background:white;padding:48px;border:1px solid #e1e7f0}h1{font-size:34px;margin-bottom:0}h2{margin-top:36px;color:#4338ca}h3{margin-bottom:4px}p{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#4338ca}article{border-top:1px solid #e1e7f0;padding:24px 0}.muted{color:#64748b}@media(max-width:600px){body{padding:12px}main{padding:24px}}@media print{body{padding:0;background:white}main{border:0;padding:0}article{break-inside:avoid}}</style></head><body><main><header><p class="muted">${e(roles[workspace.role].label)}</p><h1>${e(workspace.profile.name || "개발자 포트폴리오")}</h1><p>${e(workspace.profile.bio)}</p><p>${e(workspace.profile.email)}</p>${safeUrl(workspace.profile.github) ? `<a href="${e(safeUrl(workspace.profile.github))}" rel="noreferrer">GitHub 프로필</a>` : ""}</header><h2>기술 스택</h2><p>${e(workspace.profile.stack)}</p><h2>프로젝트</h2>${workspace.projects
    .filter((p) => p.included)
    .map(
      (p) =>
        `<article><h3>${e(p.name)}${p.source === "example" ? " (예시 프로젝트)" : ""}</h3><p class="muted">${e(p.period)} · ${e(p.stack.join(" · "))}</p><p>${e(p.portfolioDescription || p.fields.summary)}</p>${
          p.portfolioDescription
            ? ""
            : Object.entries(fieldLabels)
                .filter(
                  ([f]) =>
                    f !== "summary" && p.fields[f as keyof typeof p.fields],
                )
                .map(
                  ([f, label]) =>
                    `<h4>${label}</h4><p>${e(p.fields[f as keyof typeof p.fields])}</p>`,
                )
                .join("")
        }${safeUrl(p.githubUrl) ? `<a href="${e(safeUrl(p.githubUrl))}" rel="noreferrer">GitHub</a>` : ""} ${safeUrl(p.deployUrl) ? `<a href="${e(safeUrl(p.deployUrl))}" rel="noreferrer">배포 페이지</a>` : ""}</article>`,
    )
    .join("")}</main></body></html>`;
}
export function downloadPortfolio(workspace: Workspace, format: "md" | "html") {
  const blob = new Blob(
    [format === "md" ? portfolioMarkdown(workspace) : portfolioHtml(workspace)],
    {
      type:
        format === "md"
          ? "text/markdown;charset=utf-8"
          : "text/html;charset=utf-8",
    },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CoFolio-${(workspace.profile.name || "portfolio").replace(/[^\p{L}\p{N}_-]/gu, "_")}.${format}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
