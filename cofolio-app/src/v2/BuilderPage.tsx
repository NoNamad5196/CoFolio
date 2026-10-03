import { Link } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { useWorkspace } from "./workspaceState";
import { fieldLabels, roles, safeUrl } from "./domain";
import type { Workspace } from "./domain";
import { downloadPortfolio } from "./export";
import { Button, Empty, Field, PageHeading, Tag } from "./ui";

export function PortfolioPreview({
  workspace: w,
  compact = false,
}: {
  workspace: Workspace;
  compact?: boolean;
}) {
  return (
    <article className={`portfolio-paper ${compact ? "compact" : ""}`}>
      <header>
        <div className="portfolio-kicker">{roles[w.role].label}</div>
        <h1>{w.profile.name || "이름을 입력해주세요"}</h1>
        <p>{w.profile.bio || "어떤 개발자인지 간결한 소개를 작성해주세요."}</p>
        <div className="portfolio-contacts">
          {w.profile.email && <span>{w.profile.email}</span>}
          {safeUrl(w.profile.github) && (
            <a
              href={safeUrl(w.profile.github)}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </header>
      <section>
        <h2>기술 스택</h2>
        <div className="tags">
          {w.profile.stack ? (
            w.profile.stack
              .split(",")
              .filter(Boolean)
              .map((s, i) => <Tag key={i}>{s.trim()}</Tag>)
          ) : (
            <p className="muted">보여주고 싶은 기술을 추가해주세요.</p>
          )}
        </div>
      </section>
      <section>
        <h2>프로젝트</h2>
        {!w.projects.some((p) => p.included) && (
          <p className="muted">
            왼쪽에서 포트폴리오에 담을 프로젝트를 선택해주세요.
          </p>
        )}
        {w.projects
          .filter((p) => p.included)
          .map((p, i) => (
            <article className="portfolio-project" key={p.id}>
              <div className="portfolio-project-title">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.name}</h3>
                {p.source === "example" && <span className="sample">예시</span>}
              </div>
              <p className="muted small">{p.period}</p>
              <div className="tags">
                {p.stack.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <p>
                {p.portfolioDescription ||
                  p.fields.summary ||
                  "프로젝트 설명을 작성해주세요."}
              </p>
              {!p.portfolioDescription &&
                Object.entries(fieldLabels)
                  .filter(
                    ([f]) =>
                      f !== "summary" && p.fields[f as keyof typeof p.fields],
                  )
                  .map(([f, label]) => (
                    <div key={f} className="portfolio-detail">
                      <strong>{label}</strong>
                      <p>{p.fields[f as keyof typeof p.fields]}</p>
                    </div>
                  ))}
              <div className="portfolio-contacts">
                {safeUrl(p.githubUrl) && (
                  <a
                    href={safeUrl(p.githubUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
                {safeUrl(p.deployUrl) && (
                  <a
                    href={safeUrl(p.deployUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    배포 페이지 ↗
                  </a>
                )}
              </div>
            </article>
          ))}
      </section>
    </article>
  );
}
export default function BuilderPage() {
  const {
    workspace: w,
    update,
    updateProject,
    save,
    saveStatus,
  } = useWorkspace();
  function move(index: number, delta: number) {
    update((s) => {
      const projects = [...s.projects];
      [projects[index], projects[index + delta]] = [
        projects[index + delta],
        projects[index],
      ];
      return { ...s, projects };
    });
  }
  return (
    <div className="builder-layout">
      <section className="builder-controls">
        <div className="builder-heading">
          <span className="eyebrow">포트폴리오 빌더</span>
          <h1>경험을 하나의 이야기로</h1>
          <p className="muted small">표시할 내용과 순서를 정리하세요.</p>
        </div>
        <div className="builder-form">
          <Field label="포트폴리오 제목">
            <input
              maxLength={150}
              value={w.title}
              onChange={(e) => update((s) => ({ ...s, title: e.target.value }))}
            />
          </Field>
          <div className="section-label">01 기본 정보</div>
          <Field label="이름">
            <input
              placeholder="이름을 입력해주세요"
              maxLength={100}
              value={w.profile.name}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, name: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="한 줄 소개">
            <textarea
              rows={3}
              maxLength={2000}
              placeholder="어떤 문제에 관심을 가진 개발자인가요?"
              value={w.profile.bio}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, bio: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="연락 이메일">
            <input
              type="email"
              maxLength={250}
              placeholder="name@example.com"
              value={w.profile.email}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, email: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="GitHub 프로필 URL">
            <input
              type="url"
              maxLength={2000}
              placeholder="https://github.com/username"
              value={w.profile.github}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, github: e.target.value },
                }))
              }
            />
          </Field>
          <div className="section-label">02 기술 스택</div>
          <Field
            label="보여줄 기술"
            hint="쉼표로 구분해주세요. 직접 사용한 기술만 입력하세요."
          >
            <textarea
              rows={2}
              maxLength={1500}
              placeholder="TypeScript, React, PostgreSQL"
              value={w.profile.stack}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, stack: e.target.value },
                }))
              }
            />
          </Field>
          <div className="section-label">03 프로젝트 · 표시 순서</div>
          {!w.projects.length ? (
            <Link to="/import" className="btn secondary full">
              프로젝트 가져오기
            </Link>
          ) : (
            w.projects.map((p, i) => (
              <div className="builder-project" key={p.id}>
                <div className="spread">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={p.included}
                      onChange={(e) =>
                        updateProject(
                          p.id,
                          { included: e.target.checked },
                          false,
                        )
                      }
                    />
                    {p.name}
                  </label>
                  <div className="order-buttons">
                    <Button
                      aria-label={`${p.name} 위로`}
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                    >
                      ↑
                    </Button>
                    <Button
                      aria-label={`${p.name} 아래로`}
                      disabled={i === w.projects.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
                <details>
                  <summary>포트폴리오용 설명 편집</summary>
                  <textarea
                    aria-label={`${p.name} 포트폴리오 설명`}
                    rows={4}
                    maxLength={12000}
                    value={p.portfolioDescription}
                    placeholder={
                      p.fields.summary ||
                      "비워두면 프로젝트에 작성한 설명을 사용합니다."
                    }
                    onChange={(e) =>
                      updateProject(
                        p.id,
                        { portfolioDescription: e.target.value },
                        false,
                      )
                    }
                  />
                  <small>분석 원문과 별도로 저장됩니다.</small>
                </details>
              </div>
            ))
          )}
        </div>
        <div className="builder-save">
          <Button
            kind="primary"
            className="full"
            onClick={() => void save().catch(() => {})}
          >
            <Icon name="check" size={15} />
            {saveStatus === "saving" ? "저장 중…" : "변경사항 저장"}
          </Button>
        </div>
      </section>
      <section className="builder-preview">
        <header className="preview-toolbar">
          <span>
            <Icon name="eye" size={15} />
            실시간 미리보기
          </span>
          <Link to="/preview" className="btn secondary">
            전체 미리보기 ↗
          </Link>
        </header>
        <div className="preview-canvas">
          <PortfolioPreview workspace={w} compact />
        </div>
      </section>
    </div>
  );
}
export function PreviewPage() {
  const { workspace } = useWorkspace();
  return (
    <div className="page preview-page">
      <PageHeading
        eyebrow="최종 검토"
        title="포트폴리오 미리보기"
        description="표시되는 내용을 확인하고 Markdown 또는 HTML 파일로 내보내세요."
        actions={
          <>
            <Link to="/builder" className="btn secondary">
              편집하기
            </Link>
            <Button onClick={() => downloadPortfolio(workspace, "md")}>
              <Icon name="download" size={15} />
              Markdown
            </Button>
            <Button
              kind="primary"
              onClick={() => downloadPortfolio(workspace, "html")}
            >
              <Icon name="download" size={15} />
              HTML
            </Button>
          </>
        }
      />
      {!workspace.projects.some((p) => p.included) ? (
        <Empty
          title="포트폴리오에 프로젝트를 담아주세요"
          action={
            <Link to="/builder" className="btn primary">
              빌더로 이동
            </Link>
          }
        >
          프로젝트를 가져온 뒤 표시할 프로젝트를 선택할 수 있어요.
        </Empty>
      ) : (
        <PortfolioPreview workspace={workspace} />
      )}
    </div>
  );
}
