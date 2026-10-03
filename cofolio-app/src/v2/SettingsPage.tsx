import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useWorkspace } from "./workspaceState";
import { Button, Field, PageHeading } from "./ui";
export default function SettingsPage() {
  const { user, workspace, authenticate, logout, save, saveStatus } =
    useWorkspace();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [search] = useSearchParams();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setConfirmation("");
    try {
      const signedIn = await authenticate(mode, email, password, name);
      setPassword("");
      if (signedIn) navigate("/");
      else
        setConfirmation(
          "가입 확인 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해주세요. 메일은 잠시 후 도착할 수 있습니다.",
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }
  function backup() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            current: workspace,
            guestRaw: localStorage.getItem("cofolio.workspace.v2.guest"),
            legacyBuilderRaw: localStorage.getItem("cofolio.builder.v1"),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cofolio-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="page settings-page">
      <PageHeading
        title="계정 및 저장"
        description="작업을 안전하게 보관하고, 나만의 포트폴리오를 이어가세요."
      />
      {confirmation && (
        <p className="info-box" role="status">
          {confirmation}
        </p>
      )}
      {search.get("auth") === "error" && (
        <p className="info-box warning-box" role="alert">
          확인 링크가 만료되었거나 다른 브라우저에서 열렸습니다. 가입한
          브라우저에서 메일을 다시 열거나 로그인해주세요.
        </p>
      )}
      <div className="settings-grid">
        <section className="panel padded">
          <h2>{user ? "내 계정" : "계정으로 작업 이어가기"}</h2>
          {user ? (
            <>
              <div className="account-info">
                <div className="avatar">{user.name.slice(0, 1)}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
              </div>
              <p className="muted">
                프로젝트와 분석 결과는 이 서버의 계정 저장소에 보관됩니다.
              </p>
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  setError("");
                  try {
                    await logout();
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "로그아웃하지 못했습니다.",
                    );
                  } finally {
                    setPending(false);
                  }
                }}
              >
                저장 후 로그아웃
              </Button>
            </>
          ) : (
            <>
              <p className="muted">
                계정으로 로그인하면 서버에 작업을 저장합니다. 체험 공간은 이
                브라우저에 별도로 남아있습니다.
              </p>
              <div className="segmented">
                <button
                  className={mode === "login" ? "active" : ""}
                  onClick={() => setMode("login")}
                >
                  로그인
                </button>
                <button
                  className={mode === "register" ? "active" : ""}
                  onClick={() => setMode("register")}
                >
                  회원가입
                </button>
              </div>
              <form onSubmit={submit}>
                <fieldset disabled={pending}>
                  {mode === "register" && (
                    <Field label="이름">
                      <input
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Field>
                  )}
                  <Field label="이메일">
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={250}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field label="비밀번호" hint="10자 이상 입력해주세요.">
                    <input
                      type="password"
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      required
                      minLength={10}
                      maxLength={128}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                  <Button className="full" type="submit" kind="primary">
                    {pending
                      ? "처리 중…"
                      : mode === "login"
                        ? "로그인"
                        : "계정 만들기"}
                  </Button>
                </fieldset>
              </form>
            </>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </section>
        <div>
          <section className="panel padded">
            <h2>저장 상태</h2>
            <dl className="settings-details">
              <div>
                <dt>저장 위치</dt>
                <dd>
                  {user
                    ? "계정 저장소 · 현재 서버"
                    : "비회원 체험 · 이 브라우저"}
                </dd>
              </div>
              <div>
                <dt>상태</dt>
                <dd>
                  {saveStatus === "saved"
                    ? "저장됨"
                    : saveStatus === "saving"
                      ? "저장 중"
                      : "저장 확인 필요"}
                </dd>
              </div>
              <div>
                <dt>프로젝트</dt>
                <dd>{workspace.projects.length}개</dd>
              </div>
            </dl>
            <div className="actions">
              <Button onClick={() => void save().catch(() => {})}>
                지금 저장
              </Button>
              <Button onClick={backup}>데이터 백업</Button>
            </div>
            <p className="muted small">
              비회원 데이터는 브라우저 데이터를 지우면 삭제됩니다. 필요한 내용은
              백업이나 내보내기로 보관해주세요.
            </p>
          </section>
          <section className="panel padded">
            <h2>포트폴리오 내보내기</h2>
            <p className="muted">
              Markdown과 독립 실행 가능한 HTML을 지원합니다. 공개 링크를
              자동으로 만들지 않습니다.
            </p>
            <Link to="/preview" className="btn secondary">
              미리보기 및 내보내기 →
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
