import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { useWorkspace } from "./workspaceState";
import { roles } from "./domain";
import type { Role } from "./domain";
import { gapCount, isCurrent } from "./analysis";
import { Badge, Button, Empty, Tag } from "./ui";

export default function Dashboard() {
  const { workspace: w, update, addExamples, busy } = useWorkspace();
  const navigate = useNavigate();
  const analyzed = w.projects.filter((p) => isCurrent(p, w.role));
  const gaps = analyzed.reduce((sum, p) => sum + gapCount(p), 0);
  const pending = w.projects.reduce(
    (sum, p) =>
      sum + p.suggestions.filter((s) => s.status === "pending").length,
    0,
  );
  return (
    <div className="page dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">나의 개발 경험, 다음 커리어로</p>
          <h1>
            {w.profile.name
              ? `${w.profile.name}님의 포트폴리오`
              : "경험을 정리하고, 가능성을 보여주세요."}
          </h1>
          <p>
            프로젝트의 근거를 살펴보고, 나만의 기여가 드러나는 포트폴리오를
            만드세요.
          </p>
        </div>
        <div className="actions">
          <Button onClick={() => navigate("/import")}>
            <Icon name="plus" size={15} />
            프로젝트 추가
          </Button>
          <Button className="hero-button" onClick={() => navigate("/builder")}>
            포트폴리오 편집 <Icon name="arrow" size={14} />
          </Button>
        </div>
      </section>
      <div className="stats-grid">
        {[
          ["전체 프로젝트", w.projects.length, "직접 가져온 프로젝트", "blue"],
          ["분석 완료", analyzed.length, "현재 직무 · 최신 내용 기준", "green"],
          ["보완할 항목", gaps, "근거와 설명 확인이 필요해요", "amber"],
          ["검토할 제안", pending, "적용하기 전 직접 확인하세요", "neutral"],
        ].map(([label, value, sub, color]) => (
          <div className={`stat-card ${color}`} key={label}>
            <span>{label}</span>
            <strong>
              {value}
              <small>개</small>
            </strong>
            <small>{sub}</small>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="panel">
            <header className="panel-heading">
              <h2>프로젝트 분석 현황</h2>
              <span className="count">{w.projects.length}개</span>
            </header>
            {!w.projects.length ? (
              <Empty
                title="첫 프로젝트를 가져와보세요"
                action={
                  <div className="actions">
                    <Button kind="primary" onClick={() => navigate("/import")}>
                      프로젝트 가져오기
                    </Button>
                    <Button onClick={addExamples} disabled={!!busy}>
                      예시로 둘러보기
                    </Button>
                  </div>
                }
              >
                GitHub 저장소, README, 직접 입력으로 시작할 수 있어요.
                <br />
                개인 기여를 추정하지 않고, 확인된 근거부터 정리합니다.
              </Empty>
            ) : (
              <div className="project-table">
                {w.projects.map((p) => (
                  <Link
                    to={`/projects/${p.id}`}
                    className="project-row"
                    key={p.id}
                  >
                    <div className="project-symbol">
                      <Icon name="folder" size={19} />
                    </div>
                    <div className="project-row-main">
                      <strong>{p.name}</strong>
                      <div className="tags">
                        {p.stack.slice(0, 3).map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                        {p.source === "example" && (
                          <span className="sample">예시</span>
                        )}
                        {!p.stack.length && (
                          <small>기술 스택을 추가해주세요</small>
                        )}
                      </div>
                    </div>
                    <div className="row-analysis">
                      <span>
                        {p.analysis
                          ? isCurrent(p, w.role)
                            ? `${gapCount(p)}개 항목 보완`
                            : "재분석 필요"
                          : "분석 전"}
                      </span>
                      <small>근거 {p.evidence.length}개</small>
                    </div>
                    <Icon name="arrow" size={15} />
                  </Link>
                ))}
              </div>
            )}
          </section>
          <section className="panel">
            <header className="panel-heading">
              <h2>포트폴리오</h2>
              <Link to="/builder" className="text-link">
                편집하기 →
              </Link>
            </header>
            <div className="portfolio-card">
              <div className="portfolio-mini">
                <div />
                <div />
                <div />
                <div />
              </div>
              <div>
                <span className="eyebrow">작성 중</span>
                <h3>{w.title}</h3>
                <p>
                  {roles[w.role].label} · 프로젝트{" "}
                  {w.projects.filter((p) => p.included).length}개
                </p>
                <Link className="text-link" to="/preview">
                  미리보기 <Icon name="arrow" size={12} />
                </Link>
              </div>
            </div>
          </section>
          <div className="workflow-note">
            <span className="workflow-step">
              01 <strong>프로젝트 가져오기</strong>
            </span>
            <span>→</span>
            <span className="workflow-step">
              02 <strong>근거 확인 · 보완</strong>
            </span>
            <span>→</span>
            <span className="workflow-step">
              03 <strong>포트폴리오 완성</strong>
            </span>
          </div>
        </div>
        <aside className="dashboard-side">
          <section className="panel padded">
            <h2>목표 직무</h2>
            <p className="muted small">
              같은 경험도 직무에 따라 다르게 살펴봅니다.
            </p>
            <div className="role-options">
              {(Object.keys(roles) as Role[]).map((role) => (
                <button
                  key={role}
                  className={`role-option ${w.role === role ? "active" : ""}`}
                  onClick={() => update((s) => ({ ...s, role }))}
                >
                  {roles[role].label}
                  {w.role === role && <span>현재</span>}
                </button>
              ))}
            </div>
            <Button
              kind="primary"
              className="full"
              onClick={() => navigate("/roles")}
            >
              직무별 검토 기준 보기 <Icon name="arrow" size={14} />
            </Button>
          </section>
          <section className="panel padded">
            <h2>다음으로 보완할 내용</h2>
            {analyzed.length ? (
              analyzed
                .flatMap((p) =>
                  p
                    .analysis!.findings.filter((f) => f.status !== "sufficient")
                    .slice(0, 1)
                    .map((f) => (
                      <Link
                        className="gap-link"
                        key={p.id}
                        to={`/projects/${p.id}`}
                      >
                        <small>{p.name}</small>
                        <strong>{f.question}</strong>
                        <Badge status={f.status} />
                      </Link>
                    )),
                )
                .slice(0, 3)
            ) : (
              <div className="guide">
                <Icon name="shield" size={23} />
                <h3>설득력은 근거에서 시작돼요</h3>
                <p>
                  분석을 실행하면 빠진 정보와 필요한 근거를 여기서 확인할 수
                  있어요.
                </p>
                <p>점수 대신 구체적으로 보완할 내용을 알려드립니다.</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
