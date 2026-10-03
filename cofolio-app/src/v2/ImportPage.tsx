import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/common/Icon";
import { useWorkspace } from "./workspaceState";
import type { ImportInput } from "./domain";
import { Button, Field } from "./ui";

export default function ImportPage() {
  const { importProject, busy } = useWorkspace();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [source, setSource] = useState<ImportInput["source"]>("github");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const id = await importProject({ source, name, content, githubUrl: url });
      navigate(`/projects/${id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "가져오기를 다시 시도해주세요.",
      );
    }
  }
  return (
    <div className="import-page">
      <div className="stepper">
        {["소스 선택", "정보 입력", "Workspace에서 검토"].map((label, i) => (
          <div key={label} className={i <= step ? "active" : ""}>
            <span>{i < step ? "✓" : i + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <section className="import-card">
        <div className="import-card-body">
          <span className="eyebrow">프로젝트 가져오기</span>
          <h1>
            {step === 0
              ? "어디서부터 시작할까요?"
              : source === "github"
                ? "GitHub 저장소를 연결하세요"
                : source === "readme"
                  ? "README를 붙여넣어주세요"
                  : "프로젝트 경험을 알려주세요"}
          </h1>
          <p className="muted">
            {step === 0
              ? "프로젝트에 담긴 사실을 모으는 첫 단계입니다."
              : "확인된 자료는 근거로 보관하고, 개인 경험은 따로 보완합니다."}
          </p>
          {step === 0 ? (
            <>
              <div className="source-options">
                {(
                  [
                    {
                      id: "github",
                      title: "GitHub 공개 저장소",
                      icon: "github",
                      description:
                        "저장소 정보, 사용 언어와 README를 가져옵니다.",
                    },
                    {
                      id: "readme",
                      title: "README 붙여넣기",
                      icon: "file",
                      description:
                        "마크다운 문서를 그대로 붙여넣어 시작하세요.",
                    },
                    {
                      id: "manual",
                      title: "직접 입력",
                      icon: "code",
                      description:
                        "공개 저장소 없이도 프로젝트를 정리할 수 있어요.",
                    },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    className={`source-option ${source === item.id ? "active" : ""}`}
                    onClick={() => setSource(item.id)}
                  >
                    <div className="source-icon">
                      <Icon name={item.icon} size={22} />
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                    <span className="radio-dot" />
                  </button>
                ))}
              </div>
              <Button
                kind="primary"
                className="full"
                onClick={() => setStep(1)}
              >
                계속하기 <Icon name="arrow" size={15} />
              </Button>
            </>
          ) : (
            <form onSubmit={submit}>
              <fieldset disabled={!!busy}>
                {source === "github" ? (
                  <Field
                    label="GitHub Repository URL"
                    hint="공개 저장소의 기본 주소를 입력해주세요. 비공개 저장소는 지원하지 않습니다."
                  >
                    <input
                      type="url"
                      autoFocus
                      required
                      placeholder="https://github.com/owner/repository"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </Field>
                ) : (
                  <>
                    <Field label="프로젝트 이름">
                      <input
                        required
                        maxLength={150}
                        autoFocus
                        placeholder="예: 쇼핑몰 주문 관리 시스템"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Field>
                    <Field
                      label={
                        source === "readme" ? "README 내용" : "프로젝트 설명"
                      }
                      hint={
                        source === "readme"
                          ? "최대 24,000자 · 원문은 실행하지 않고 텍스트로 보관합니다."
                          : "문제, 구현한 내용, 본인 역할을 간단히 적어주세요."
                      }
                    >
                      <textarea
                        className={
                          source === "readme" ? "mono readme-input" : ""
                        }
                        required
                        maxLength={24000}
                        rows={9}
                        placeholder={
                          source === "readme"
                            ? "# 프로젝트 이름\n\n## 소개\n\n## 설치 및 실행"
                            : "어떤 문제를 해결하기 위해 만든 프로젝트인가요?"
                        }
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </Field>
                  </>
                )}
                <div className="info-box">
                  <Icon name="shield" size={18} />
                  <p>
                    저장소만으로는{" "}
                    <strong>본인 기여, 기술 선택 이유, 성과</strong>를 알 수
                    없어요. 가져온 뒤 직접 보완할 수 있습니다.
                  </p>
                </div>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="actions spread">
                  <Button onClick={() => setStep(0)}>이전</Button>
                  <Button type="submit" kind="primary">
                    {busy ? (
                      <>
                        <span className="spinner" />
                        자료를 가져오는 중…
                      </>
                    ) : (
                      <>
                        프로젝트 가져오기 <Icon name="arrow" size={15} />
                      </>
                    )}
                  </Button>
                </div>
              </fieldset>
            </form>
          )}
        </div>
        <footer className="import-footer">
          <Icon name="shield" size={13} />
          비회원 체험은 이 브라우저에 저장됩니다. 계정 작업은 서버에 저장됩니다.
        </footer>
      </section>
    </div>
  );
}
