import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { useWorkspace } from "./workspaceState";
import { fieldLabels } from "./domain";
import type { Suggestion } from "./domain";
import { collectEvidence, isCurrent } from "./analysis";
import { Button, Empty, PageHeading } from "./ui";
const labels = {
  pending: "검토 대기",
  applied: "적용됨",
  rejected: "거절됨",
  stale: "재분석 필요",
};
export default function DiffPage() {
  const { id } = useParams();
  const { workspace, analyze, busy } = useWorkspace();
  const project = workspace.projects.find((p) => p.id === id);
  const [selected, setSelected] = useState("");
  if (!project)
    return (
      <div className="page">
        <Empty
          title="프로젝트를 선택해주세요"
          action={
            <Link to="/" className="btn primary">
              대시보드
            </Link>
          }
        >
          내 프로젝트에서 개선 제안을 확인할 수 있습니다.
        </Empty>
      </div>
    );
  const suggestion =
    project.suggestions.find((s) => s.id === selected) ||
    project.suggestions.find((s) => s.status === "pending") ||
    project.suggestions.at(-1);
  return (
    <div className="diff-layout">
      <aside className="diff-list">
        <div className="padded">
          <span className="eyebrow">검토 후 적용</span>
          <h2>개선 제안</h2>
          <p className="muted small">{project.name}</p>
          <div className="diff-counts">
            <span>
              대기{" "}
              {project.suggestions.filter((s) => s.status === "pending").length}
            </span>
            <span>
              적용{" "}
              {project.suggestions.filter((s) => s.status === "applied").length}
            </span>
            <span>
              거절{" "}
              {
                project.suggestions.filter((s) => s.status === "rejected")
                  .length
              }
            </span>
          </div>
        </div>
        <div className="diff-items">
          {project.suggestions.map((s) => (
            <button
              key={s.id}
              className={suggestion?.id === s.id ? "active" : ""}
              onClick={() => setSelected(s.id)}
            >
              <div className="spread">
                <strong>{fieldLabels[s.field]}</strong>
                <span className={`decision ${s.status}`}>
                  {labels[s.status]}
                </span>
              </div>
              <p>{s.reason}</p>
            </button>
          ))}
        </div>
        <Link className="back-link" to={`/projects/${project.id}`}>
          ← 프로젝트로 돌아가기
        </Link>
      </aside>
      <main className="diff-main">
        {suggestion ? (
          <SuggestionReview
            key={suggestion.id}
            suggestion={suggestion}
            projectId={project.id}
            current={isCurrent(project, workspace.role)}
          />
        ) : (
          <Empty
            title="제안을 만들기 위한 경험이 더 필요해요"
            action={
              <div className="actions">
                <Link to={`/projects/${project.id}`} className="btn primary">
                  프로젝트 정보 보완
                </Link>
                <Button
                  disabled={!!busy}
                  onClick={() => void analyze(project.id)}
                >
                  다시 분석
                </Button>
              </div>
            }
          >
            본인 기여나 구현 내용을 입력한 뒤 분석하면
            <br />
            입력한 사실을 바탕으로 설명을 재구성합니다.
          </Empty>
        )}
      </main>
    </div>
  );
}
function SuggestionReview({
  suggestion: s,
  projectId,
  current,
}: {
  suggestion: Suggestion;
  projectId: string;
  current: boolean;
}) {
  const { workspace, decide } = useWorkspace();
  const project = workspace.projects.find((p) => p.id === projectId)!;
  const [editing, setEditing] = useState(false);
  const [after, setAfter] = useState(s.after);
  const evidence = collectEvidence(project).filter((e) =>
    s.evidenceIds.includes(e.id),
  );
  const actionable = current && s.status === "pending";
  return (
    <>
      <PageHeading
        eyebrow="변경 내용 비교"
        title={fieldLabels[s.field]}
        description="원문, 제안, 사용한 근거를 확인하고 적용 여부를 결정하세요."
        actions={
          <span className={`decision ${s.status}`}>{labels[s.status]}</span>
        }
      />
      {!current && (s.status === "pending" || s.status === "stale") && (
        <div className="info-box warning-box">
          이 제안의 분석 이후 내용이나 직무가 변경되었습니다. 다시 분석한 뒤
          적용해주세요.
        </div>
      )}
      <div className="diff-panels">
        <section className="diff-before">
          <header>
            <span>−</span> 원본 <small>작성한 내용</small>
          </header>
          <pre>{s.before || "아직 작성한 내용이 없습니다."}</pre>
        </section>
        <section className="diff-after">
          <header>
            <span>+</span> 제안{" "}
            <small>{s.status === "applied" ? "적용된 내용" : editing && actionable ? "직접 수정 중" : "검토 후 적용"}</small>
          </header>
          {editing && actionable ? (
            <textarea
              aria-label="제안 직접 수정"
              rows={12}
              maxLength={12000}
              value={after}
              onChange={(e) => setAfter(e.target.value)}
            />
          ) : (
            <pre>{after}</pre>
          )}
        </section>
      </div>
      <section className="panel padded reason-card">
        <h2>
          <Icon name="branch" size={17} />
          변경 이유
        </h2>
        <p>{s.reason}</p>
      </section>
      <section className="panel padded">
        <div className="spread">
          <h2>사용한 근거</h2>
          <span className="count">{evidence.length}개</span>
        </div>
        <div className="diff-sources">
          {evidence.map((e) => (
            <details key={e.id}>
              <summary>
                <Icon name="file" size={13} />
                {e.label}
              </summary>
              <pre>{e.excerpt}</pre>
            </details>
          ))}
        </div>
      </section>
      <div className="review-notice">
        <Icon name="shield" size={16} />
        <p>
          제안이 실제 경험과 일치하는지 확인해주세요. 확인하지 않은 수치나
          기여가 있다면 직접 수정할 수 있습니다.
        </p>
      </div>
      <div className="diff-actions">
        <Button onClick={() => setEditing(!editing)} disabled={!actionable}>
          {editing ? "수정 내용 확인" : "직접 수정"}
        </Button>
        <div className="actions">
          <Button
            onClick={() => decide(projectId, s.id, "rejected")}
            disabled={!actionable}
          >
            거절
          </Button>
          <Button
            kind="primary"
            onClick={() =>
              decide(
                projectId,
                s.id,
                "applied",
                after !== s.after ? after : undefined,
              )
            }
            disabled={!actionable || !after.trim()}
          >
            <Icon name="check" size={15} />
            {after !== s.after ? "수정한 내용 적용" : "제안 적용"}
          </Button>
        </div>
      </div>
    </>
  );
}
