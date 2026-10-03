import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { useWorkspace } from "./workspaceState";
import {
  criterionLabels,
  fieldHints,
  fieldLabels,
  roles,
  safeUrl,
} from "./domain";
import type { Field, Project } from "./domain";
import { collectEvidence, isCurrent } from "./analysis";
import { Badge, Button, Empty, Field as InputField, Tag } from "./ui";

export default function ProjectPage() {
  const { id } = useParams();
  const { workspace } = useWorkspace();
  const project = workspace.projects.find((p) => p.id === id);
  return project ? (
    <ProjectEditor key={project.id} project={project} />
  ) : (
    <div className="page">
      <Empty
        title="프로젝트를 찾을 수 없습니다"
        action={
          <Link className="btn primary" to="/import">
            프로젝트 가져오기
          </Link>
        }
      >
        내 작업 공간의 프로젝트를 선택해주세요.
      </Empty>
    </div>
  );
}
function ProjectEditor({ project: p }: { project: Project }) {
  const { workspace, updateProject, analyze, busy } = useWorkspace();
  const [tab, setTab] = useState("overview");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const evidence = collectEvidence(p);
  const current = isCurrent(p, workspace.role);
  const processing = busy === p.id;
  const tabs = [
    { id: "overview", label: "프로젝트 개요" },
    { id: "contribution", label: "역할 및 기여" },
    { id: "outcome", label: "결과 및 성과" },
    { id: "evidence", label: `근거 자료 ${evidence.length}` },
  ];
  const fields: Field[] =
    tab === "overview"
      ? ["summary", "problem", "implementation"]
      : tab === "contribution"
        ? ["contribution", "techReason", "troubleshooting"]
        : ["outcome"];
  return (
    <div className="workspace-layout">
      <section className="editor">
        <header className="editor-header">
          <div className="spread">
            <div>
              <div className="tags">
                <span className="eyebrow">프로젝트 분석</span>
                {p.source === "example" && (
                  <span className="sample">예시 프로젝트</span>
                )}
              </div>
              <h1>{p.name}</h1>
              <p className="muted small">
                {p.period || "프로젝트 기간 미입력"}
                {p.githubUrl && (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={safeUrl(p.githubUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  </>
                )}
              </p>
            </div>
            <Button
              kind="primary"
              disabled={!!busy}
              onClick={() => void analyze(p.id)}
            >
              {processing ? (
                <>
                  <span className="spinner" />
                  분석 중
                </>
              ) : (
                <>
                  <Icon name="chart" size={15} />
                  {p.analysis ? "다시 분석" : "프로젝트 분석"}
                </>
              )}
            </Button>
          </div>
          <div className="tags stack-tags">
            {p.stack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            {!p.stack.length && (
              <small className="muted">사용 기술을 추가해주세요</small>
            )}
          </div>
          <nav className="tabs" aria-label="프로젝트 편집 탭">
            {tabs.map((t) => (
              <button
                key={t.id}
                aria-current={tab === t.id ? "page" : undefined}
                onClick={() => setTab(t.id)}
                className={tab === t.id ? "active" : ""}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>
        <div className="editor-content">
          {tab === "evidence" ? (
            <>
              <div className="spread">
                <div>
                  <h2>분석에 사용한 근거</h2>
                  <p className="muted small">
                    출처와 확인 범위를 함께 확인하세요.
                  </p>
                </div>
                <select
                  aria-label="근거 필터"
                  value={evidenceFilter}
                  onChange={(e) => setEvidenceFilter(e.target.value)}
                >
                  <option value="all">전체 출처</option>
                  <option value="repository">저장소 정보</option>
                  <option value="readme">README</option>
                  <option value="user">사용자 진술</option>
                </select>
              </div>
              {evidence
                .filter(
                  (e) => evidenceFilter === "all" || e.kind === evidenceFilter,
                )
                .map((e) => (
                  <article
                    className="evidence-card panel padded"
                    key={e.id}
                    id={e.id}
                  >
                    <div className="spread">
                      <h3>
                        <Icon
                          name={e.kind === "user" ? "users" : "file"}
                          size={16}
                        />
                        {e.label}
                      </h3>
                      <span className="source-label">
                        {e.verified ? "원본에서 수집" : "사용자가 제공"}
                      </span>
                    </div>
                    <pre>{e.excerpt}</pre>
                    <div className="spread muted small">
                      <span>
                        {new Date(e.capturedAt).toLocaleDateString("ko-KR")}{" "}
                        기록
                      </span>
                      {e.url && safeUrl(e.url) && (
                        <a
                          href={safeUrl(e.url)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          원본 보기 ↗
                        </a>
                      )}
                    </div>
                    <p className="evidence-limits">
                      {e.kind === "user"
                        ? "사용자가 직접 작성한 진술입니다. 외부 자료로 사실을 검증한 상태는 아닙니다."
                        : e.kind === "readme"
                          ? "문서에 적힌 내용을 확인했습니다. 코드 실행이나 개인의 구현 범위까지 검증하지는 않았습니다."
                          : "저장소의 공개 정보입니다. 개인 기여·숙련도·기술 선택 이유는 포함하지 않습니다."}
                    </p>
                  </article>
                ))}
              {!evidence.length && (
                <Empty title="아직 연결된 근거가 없어요">
                  프로젝트 설명을 작성하거나 README를 가져오면 근거가
                  연결됩니다.
                </Empty>
              )}
              <div className="info-box">
                <Icon name="file" size={18} />
                <p>
                  이 MVP에서는 README, 저장소 정보, 사용자 진술을 다룹니다. 소스
                  코드 실행, 테스트 성공 여부, 배포 페이지 상태는 자동 검증하지
                  않습니다.
                </p>
              </div>
            </>
          ) : (
            <fieldset disabled={processing}>
              {tab === "overview" && (
                <details className="metadata panel padded">
                  <summary>프로젝트 기본 정보 편집</summary>
                  <div className="form-grid">
                    <InputField label="프로젝트 이름">
                      <input
                        value={p.name}
                        maxLength={150}
                        onChange={(e) =>
                          updateProject(p.id, {
                            name: e.target.value || "이름 없는 프로젝트",
                          })
                        }
                      />
                    </InputField>
                    <InputField label="진행 기간">
                      <input
                        placeholder="2026.03 — 2026.06"
                        value={p.period}
                        maxLength={100}
                        onChange={(e) =>
                          updateProject(p.id, { period: e.target.value })
                        }
                      />
                    </InputField>
                  </div>
                  <InputField label="기술 스택" hint="쉼표로 구분해주세요.">
                    <input
                      defaultValue={p.stack.join(", ")}
                      maxLength={1000}
                      onBlur={(e) =>
                        updateProject(p.id, {
                          stack: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .slice(0, 30),
                        })
                      }
                    />
                  </InputField>
                  <InputField
                    label="배포 URL"
                    hint="URL만 보관합니다. 배포 성공 여부를 자동 검증하지 않습니다."
                  >
                    <input
                      type="url"
                      placeholder="https://..."
                      value={p.deployUrl}
                      onChange={(e) =>
                        updateProject(p.id, { deployUrl: e.target.value })
                      }
                    />
                  </InputField>
                </details>
              )}
              {tab === "overview" &&
                evidence.some((e) => e.kind === "readme" && e.field) && (
                  <section className="panel padded extracted-facts">
                    <h2>README에서 구조화한 프로젝트 정보</h2>
                    <p className="muted small">
                      문서의 명시된 항목을 그대로 발췌했습니다. 개인 기여를
                      뜻하지 않습니다.
                    </p>
                    {evidence
                      .filter((e) => e.kind === "readme" && e.field)
                      .map((e) => (
                        <details key={e.id}>
                          <summary>{e.label}</summary>
                          <pre>{e.excerpt}</pre>
                        </details>
                      ))}
                  </section>
                )}
              {fields.map((field) => (
                <section
                  className={`field-card ${!p.fields[field] ? "needs-input" : ""}`}
                  key={field}
                >
                  <div className="spread">
                    <h2>{fieldLabels[field]}</h2>
                    <span
                      className={`source-label ${!p.fields[field] ? "warning" : ""}`}
                    >
                      {p.fields[field] ? "사용자 진술" : "추가 정보 필요"}
                    </span>
                  </div>
                  <p className="field-question">{fieldHints[field]}</p>
                  <textarea
                    aria-label={fieldLabels[field]}
                    rows={field === "summary" ? 5 : 4}
                    maxLength={12000}
                    placeholder={fieldHints[field]}
                    value={p.fields[field]}
                    onChange={(e) =>
                      updateProject(p.id, {
                        fields: { ...p.fields, [field]: e.target.value },
                      })
                    }
                  />
                  <div className="field-foot">
                    <Icon name="shield" size={12} />
                    <span>
                      {p.fields[field]
                        ? "입력한 내용은 사용자 진술 근거로 연결됩니다."
                        : "확인하지 못한 사실은 AI가 채워 넣지 않습니다."}
                    </span>
                    <span>{p.fields[field].length.toLocaleString()}자</span>
                  </div>
                </section>
              ))}
              {tab === "outcome" && (
                <div className="info-box">
                  <Icon name="chart" size={20} />
                  <p>
                    성과는 수치가 없어도 괜찮아요.{" "}
                    <strong>무엇을 관찰했고 어떻게 확인했는지</strong>가
                    중요합니다. 팀의 성과라면 자신의 기여와 구분해 설명해주세요.
                  </p>
                </div>
              )}
              <div className="editor-bottom">
                <Icon name="check" size={14} />
                입력은 자동 저장됩니다. 보완 후 다시 분석해주세요.
              </div>
            </fieldset>
          )}
        </div>
      </section>
      <aside className="analysis-panel">
        <div className="analysis-head">
          <span className="eyebrow">근거 기반 검토</span>
          <h2>프로젝트 분석</h2>
          <p>{roles[workspace.role].label} 기준</p>
          <div className="analysis-summary">
            <strong>
              {current
                ? `${p.analysis!.findings.filter((f) => f.status === "sufficient").length} / 8`
                : p.analysis
                  ? "재분석 필요"
                  : "분석 전"}
            </strong>
            <span>
              {current ? "설명 근거 충분" : "현재 내용으로 검토해주세요"}
            </span>
          </div>
        </div>
        <div className="analysis-body">
          {p.analysis ? (
            <>
              <div className={`engine-note ${!current ? "warning-box" : ""}`}>
                {!current
                  ? "프로젝트 내용 또는 목표 직무가 변경됐습니다. 아래는 이전 분석입니다."
                  : p.analysis.engine === "ai"
                    ? "AI 분석 · 근거를 인용한 검토"
                    : p.analysis.engine === "hybrid"
                      ? "AI + 규칙 기반 점검"
                      : "규칙 기반 점검"}
                <small>
                  {new Date(p.analysis.createdAt).toLocaleString("ko-KR")}
                </small>
              </div>
              <div className="findings">
                {p.analysis.findings.map((f) => (
                  <details className="finding" key={f.criterion}>
                    <summary>
                      <span>{criterionLabels[f.criterion]}</span>
                      <Badge status={f.status} />
                    </summary>
                    <p>{f.reason}</p>
                    <p className="finding-question">{f.question}</p>
                    <div className="finding-evidence">
                      {f.evidenceIds.length ? (
                        f.evidenceIds.map((id) => {
                          const e = evidence.find((x) => x.id === id);
                          return (
                            <button
                              key={id}
                              onClick={() => {
                                setTab("evidence");
                                setEvidenceFilter("all");
                              }}
                            >
                              <Icon name="file" size={12} />
                              {e?.label || "이전 분석의 근거"}
                            </button>
                          );
                        })
                      ) : (
                        <span>연결된 근거 없음</span>
                      )}
                    </div>
                  </details>
                ))}
              </div>
              <p className="analysis-notice">{p.analysis.notice}</p>
              <div className="pipeline-list">
                {p.analysis.stages.map((stage) => (
                  <span key={stage.name}>
                    <Icon name="check" size={11} />
                    {stage.name}
                    <small>
                      {stage.status === "fallback" ? "규칙 기반" : "완료"}
                    </small>
                  </span>
                ))}
              </div>
              <Link to={`/projects/${p.id}/diff`} className="btn primary full">
                <Icon name="branch" size={15} />
                개선 제안 검토{" "}
                {p.suggestions.filter((s) => s.status === "pending").length}개
              </Link>
            </>
          ) : (
            <div className="analysis-empty">
              <Icon name="chart" size={30} />
              <h3>이 경험에서 무엇을 보여줄까요?</h3>
              <p>
                8개 항목에서 설명과 근거를 살펴보고, 빠진 정보부터 알려드립니다.
              </p>
              <Button
                kind="primary"
                className="full"
                disabled={!!busy}
                onClick={() => void analyze(p.id)}
              >
                분석 시작하기
              </Button>
              <small>입력한 내용을 자동으로 바꾸지 않습니다.</small>
            </div>
          )}
        </div>
        <button
          className="evidence-shortcut"
          onClick={() => setTab("evidence")}
        >
          <Icon name="file" size={14} />
          근거 자료 {evidence.length}개 확인하기 <Icon name="arrow" size={13} />
        </button>
      </aside>
    </div>
  );
}
