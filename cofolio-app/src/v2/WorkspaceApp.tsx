import { Component, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Icon } from "../components/common/Icon";
import {
  GridIcon,
  ImportIcon,
  PortfolioIcon,
  JobIcon,
  SettingsIcon,
} from "./FigmaIcons";
import { WorkspaceProvider } from "./WorkspaceContext";
import { useWorkspace } from "./workspaceState";
import { roles } from "./domain";
import type { Role } from "./domain";
import Dashboard from "./Dashboard";
import ImportPage from "./ImportPage";
import ProjectPage from "./ProjectPage";
import DiffPage from "./DiffPage";
import BuilderPage, { PreviewPage } from "./BuilderPage";
import RolesPage from "./RolesPage";
import SettingsPage from "./SettingsPage";
import { Button, Empty } from "./ui";
import "./workspace.css";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="error-screen">
        <h1>화면을 불러오지 못했습니다</h1>
        <p>저장된 프로젝트는 유지됩니다. 새로고침 후 다시 확인해주세요.</p>
        <Button kind="primary" onClick={() => window.location.reload()}>
          새로고침
        </Button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function WorkspaceApp() {
  return (
    <ErrorBoundary>
      <WorkspaceProvider>
        <Shell />
      </WorkspaceProvider>
    </ErrorBoundary>
  );
}
function Shell() {
  const {
    workspace: w,
    user,
    ready,
    error,
    notice,
    busy,
    saveStatus,
    update,
    dismissError,
    save,
  } = useWorkspace();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    document.getElementById("main-content")?.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        document.querySelector<HTMLButtonElement>(".mobile-menu")?.focus();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);
  const nav = [
    { path: "/", label: "대시보드", icon: <GridIcon /> },
    { path: "/import", label: "프로젝트 가져오기", icon: <ImportIcon /> },
    { path: "/builder", label: "포트폴리오 빌더", icon: <PortfolioIcon /> },
    { path: "/roles", label: "직무별 분석", icon: <JobIcon /> },
  ];
  const title =
    nav.find((n) => n.path === location.pathname)?.label ||
    (location.pathname.includes("/diff")
      ? "개선 제안 검토"
      : location.pathname.startsWith("/projects")
        ? "프로젝트 분석"
        : location.pathname === "/preview"
          ? "포트폴리오 미리보기"
          : "계정 및 저장");
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      {mobileOpen && (
        <button
          aria-label="메뉴 닫기"
          className="sidebar-scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        id="workspace-sidebar"
        className={`sidebar ${mobileOpen ? "is-open" : ""}`}
      >
        <Link className="brand" to="/" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">
            <PortfolioIcon />
          </span>
          <strong>CoFolio</strong>
          <span className="version">V2</span>
        </Link>
        <nav className="main-nav" aria-label="주 메뉴">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              end={item.path === "/"}
              to={item.path}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-projects">
          <div className="sidebar-label">
            <span>내 프로젝트</span>
            <span>{w.projects.length}</span>
          </div>
          {w.projects.map((p) => (
            <NavLink
              key={p.id}
              to={`/projects/${p.id}`}
              className="sidebar-project"
              onClick={() => setMobileOpen(false)}
            >
              <div>
                <span
                  className={`status-dot ${p.analysis ? "improve" : "missing"}`}
                />
                <span>{p.name}</span>
                {p.source === "example" && <small>예시</small>}
              </div>
              <div className="sidebar-tags">
                {p.stack.slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </NavLink>
          ))}
          <Link
            className="add-project"
            to="/import"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="plus" size={13} />
            프로젝트 추가
          </Link>
          {!w.projects.length && (
            <p className="sidebar-empty">
              프로젝트를 가져와
              <br />
              나만의 경험을 정리해보세요.
            </p>
          )}
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/settings" onClick={() => setMobileOpen(false)}>
            <SettingsIcon />
            계정 및 저장
          </NavLink>
          <Link
            className="user-link"
            to="/settings"
            onClick={() => setMobileOpen(false)}
          >
            <span className="avatar">
              {(user?.name || w.profile.name || "나").slice(0, 1)}
            </span>
            <div>
              <strong>{user?.name || "개인 작업 공간"}</strong>
              <small>{user ? "계정에 저장" : "비회원 체험"}</small>
            </div>
            <Icon name="chevron-down" size={12} />
          </Link>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <Button
            className="mobile-menu"
            aria-label="메뉴 열기"
            aria-controls="workspace-sidebar"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Icon name="menu" size={18} />
          </Button>
          <div className="breadcrumb">
            <span>CoFolio</span>
            <span>/</span>
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className={`save-indicator ${saveStatus}`}
              onClick={() => void save().catch(() => {})}
              title="지금 저장"
            >
              <span
                className={saveStatus === "saving" ? "spinner" : "status-dot"}
              />
              <span>
                {saveStatus === "saved"
                  ? "저장됨"
                  : saveStatus === "saving"
                    ? "저장 중"
                    : saveStatus === "loading"
                      ? "불러오는 중"
                      : "저장 확인 필요"}
              </span>
            </button>
            <label className="role-select">
              <span>목표 직무</span>
              <select
                aria-label="목표 직무"
                value={w.role}
                disabled={!!busy}
                onChange={(e) =>
                  update((s) => ({ ...s, role: e.target.value as Role }))
                }
              >
                {(Object.keys(roles) as Role[]).map((r) => (
                  <option key={r} value={r}>
                    {roles[r].label}
                  </option>
                ))}
              </select>
            </label>
            <Link
              to="/settings"
              className="avatar top-avatar"
              aria-label="계정 설정"
            >
              {(user?.name || "나").slice(0, 1)}
            </Link>
          </div>
        </header>
        {error && (
          <div className="global-error" role="alert">
            <Icon name="shield" size={17} />
            <span>{error}</span>
            <Button onClick={dismissError} aria-label="오류 알림 닫기">
              ×
            </Button>
          </div>
        )}
        {notice && (
          <div
            className={`notice-bar ${busy ? "processing" : ""}`}
            role="status"
          >
            {busy ? (
              <span className="spinner" />
            ) : (
              <Icon name="check" size={14} />
            )}
            <span>{notice}</span>
          </div>
        )}
        <main id="main-content" className="main-content">
          {!ready ? (
            <div className="error-screen">
              {error ? (
                <>
                  <h1>작업 공간에 연결할 수 없습니다</h1>
                  <p>API 서버가 실행 중인지 확인해주세요.</p>
                  <Button onClick={() => window.location.reload()}>
                    다시 연결
                  </Button>
                </>
              ) : (
                <>
                  <span className="spinner" />
                  <p>작업 공간을 불러오고 있습니다…</p>
                </>
              )}
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/projects/:id/diff" element={<DiffPage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route
                path="/login"
                element={<Navigate to="/settings" replace />}
              />
              <Route
                path="/result"
                element={<Navigate to="/preview" replace />}
              />
              <Route path="/generating" element={<Navigate to="/" replace />} />
              <Route
                path="*"
                element={
                  <div className="page">
                    <Empty
                      title="페이지를 찾을 수 없습니다"
                      action={
                        <Link to="/" className="btn primary">
                          대시보드로
                        </Link>
                      }
                    >
                      내 작업 공간에서 프로젝트를 선택해주세요.
                    </Empty>
                  </div>
                }
              />
            </Routes>
          )}
        </main>
        <footer className="statusbar">
          <span>
            <span className="status-dot" />
            {user ? "계정 작업 공간" : "비회원 체험 · 이 브라우저에 저장"}
          </span>
          <span>프로젝트의 사실과 근거를 연결합니다</span>
          <span>CoFolio Workspace V2</span>
        </footer>
      </div>
    </div>
  );
}
