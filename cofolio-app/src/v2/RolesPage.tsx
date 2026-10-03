import { Link } from "react-router-dom";
import { useWorkspace } from "./workspaceState";
import { criterionLabels, roles } from "./domain";
import type { Role } from "./domain";
import { analyzeRules, isCurrent } from "./analysis";
import { Badge, Button, Empty, PageHeading } from "./ui";
export default function RolesPage() {
  const { workspace: w, update, analyze, busy } = useWorkspace();
  return (
    <div className="role-layout">
      <aside className="role-list">
        <span className="section-label">목표 직무 선택</span>
        {(Object.keys(roles) as Role[]).map((id) => (
          <button
            key={id}
            className={`role-detail-option ${w.role === id ? "active" : ""}`}
            onClick={() => update((s) => ({ ...s, role: id }))}
          >
            <strong>{roles[id].label}</strong>
            <small>{roles[id].focus}</small>
            {w.role === id && <span>현재 검토 기준</span>}
          </button>
        ))}
      </aside>
      <div className="page role-content">
        <PageHeading
          eyebrow="직무별 경험 검토"
          title={roles[w.role].label}
          description={roles[w.role].focus}
        />
        <div className="role-intro">
          <h2>기술 목록보다, 판단과 해결 과정을 보여주세요.</h2>
          <p>
            아래 주제는 경험을 정리하는 기준입니다. 채용 가능성이나 실력을
            수치로 예측하지 않습니다. 직무를 바꾸면 같은 프로젝트를 새로운
            기준으로 검토할 수 있어요.
          </p>
          <div className="role-keywords">
            {roles[w.role].keywords.map((k) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        </div>
        <h2 className="section-heading">프로젝트별 연결 근거</h2>
        {!w.projects.length ? (
          <Empty
            title="검토할 프로젝트가 없어요"
            action={
              <Link to="/import" className="btn primary">
                프로젝트 가져오기
              </Link>
            }
          >
            프로젝트를 추가하면 직무와 관련된 경험을 정리할 수 있습니다.
          </Empty>
        ) : (
          w.projects.map((p) => {
            const analysis = isCurrent(p, w.role)
              ? p.analysis!
              : analyzeRules(p, w.role);
            const role = analysis.findings.find((f) => f.criterion === "role")!;
            return (
              <section className="panel padded role-project" key={p.id}>
                <div className="spread">
                  <Link to={`/projects/${p.id}`}>
                    <h2>{p.name} ↗</h2>
                  </Link>
                  <Badge status={role.status} />
                </div>
                <p className="muted">{role.reason}</p>
                <p className="role-question">{role.question}</p>
                <div className="criteria-chips">
                  {analysis.findings
                    .filter((f) => f.criterion !== "role")
                    .map((f) => (
                      <span key={f.criterion}>
                        {criterionLabels[f.criterion]}
                        <i className={`status-dot ${f.status}`} />
                      </span>
                    ))}
                </div>
                <div className="spread">
                  <small className="muted">
                    {isCurrent(p, w.role)
                      ? "저장된 최신 분석"
                      : "규칙 기반으로 현재 직무의 검토 기준을 표시합니다."}{" "}
                    · 연결 근거 {role.evidenceIds.length}개
                  </small>
                  <Button disabled={!!busy} onClick={() => void analyze(p.id)}>
                    {busy === p.id ? "분석 중…" : "이 직무로 분석"}
                  </Button>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
