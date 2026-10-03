import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { z } from "zod";
import { api } from "./api";
import {
  analysisSchema,
  decideSuggestion,
  editProject,
  emptyWorkspace,
  evidenceSchema,
  now,
  projectSchema,
  suggestionSchema,
  workspaceSchema,
} from "./domain";
import type { ImportInput, Project, Workspace } from "./domain";
import { exampleProjects } from "./examples";
import { WorkspaceContext as Context } from "./workspaceState";
import type { User, SaveStatus } from "./workspaceState";
const guestKey = "cofolio.workspace.v2.guest";
const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});
function guest() {
  const raw = localStorage.getItem(guestKey);
  if (!raw) return emptyWorkspace();
  return workspaceSchema.parse(JSON.parse(raw));
}
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace>(emptyWorkspace);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const revision = useRef(0);
  const epoch = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const protectedGuest = useRef(false);
  const latest = useRef(workspace);
  useLayoutEffect(() => {
    latest.current = workspace;
  }, [workspace]);
  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      try {
        const result = await api(
          "/auth/session",
          z.object({ user: userSchema.nullable() }),
        );
        if (cancelled) return;
        if (result.user) {
          const data = await api(
            "/workspace",
            z.object({ workspace: workspaceSchema, revision: z.number() }),
          );
          if (cancelled) return;
          revision.current = data.revision;
          setWorkspace(data.workspace);
          setUser(result.user);
        } else {
          try {
            setWorkspace(guest());
          } catch {
            protectedGuest.current = true;
            setError(
              "체험 저장 데이터를 읽을 수 없습니다. 기존 데이터는 덮어쓰지 않았습니다. 설정에서 백업을 내려받아 확인해주세요.",
            );
          }
        }
        setSaveStatus("saved");
        setReady(true);
      } catch {
        if (!cancelled) {
          setError(
            "저장 서버에 연결할 수 없습니다. 서버를 실행한 뒤 새로고침해주세요.",
          );
          setSaveStatus("error");
        }
      }
    }
    void initialize();
    return () => {
      cancelled = true;
    };
  }, []);
  function persist(
    snapshot: Workspace,
    currentUser: User | null,
  ): Promise<void> {
    const ownEpoch = epoch.current;
    setSaveStatus("saving");
    const task = queue.current
      .catch(() => {})
      .then(async () => {
        if (epoch.current !== ownEpoch) return;
        if (currentUser) {
          const data = await api(
            "/workspace",
            z.object({ revision: z.number() }),
            { workspace: snapshot, revision: revision.current },
            "PUT",
          );
          if (epoch.current === ownEpoch) revision.current = data.revision;
        } else {
          if (protectedGuest.current)
            throw new Error(
              "손상된 체험 데이터의 덮어쓰기를 차단했습니다. 설정에서 백업을 내려받거나 계정 작업 공간을 이용해주세요.",
            );
          localStorage.setItem(guestKey, JSON.stringify(snapshot));
        }
        if (
          epoch.current === ownEpoch &&
          latest.current.updatedAt === snapshot.updatedAt
        )
          setSaveStatus("saved");
      })
      .catch((e) => {
        if (epoch.current === ownEpoch) {
          setSaveStatus("error");
          setError(e instanceof Error ? e.message : "저장하지 못했습니다.");
        }
        throw e;
      });
    queue.current = task.catch(() => {});
    return task;
  }
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      void persist(workspace, user).catch(() => {});
    }, 650);
    return () => clearTimeout(timer);
    // persist queues writes with a current server revision; recreating it must not restart debounce.
  }, [workspace, user, ready]);
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (saveStatus === "saving" || saveStatus === "error") {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [saveStatus]);
  function update(fn: (w: Workspace) => Workspace) {
    setWorkspace((w) => ({ ...fn(w), updatedAt: now() }));
    setSaveStatus("saving");
  }
  function updateProject(id: string, patch: Partial<Project>, content = true) {
    update((w) => ({
      ...w,
      projects: w.projects.map((p) =>
        p.id === id
          ? content
            ? editProject(p, patch)
            : { ...p, ...patch, updatedAt: now() }
          : p,
      ),
    }));
  }
  async function importProject(data: ImportInput) {
    setBusy("import");
    setError("");
    try {
      const result = await api(
        "/import",
        z.object({ project: projectSchema, notice: z.string() }),
        data,
      );
      update((w) => ({ ...w, projects: [...w.projects, result.project] }));
      setNotice(result.notice);
      return result.project.id;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "프로젝트를 가져오지 못했습니다.";
      setError(message);
      throw e;
    } finally {
      setBusy(null);
    }
  }
  async function analyze(id: string) {
    const snapshot = latest.current;
    const project = snapshot.projects.find((p) => p.id === id);
    if (!project) return;
    setBusy(id);
    setError("");
    setNotice(
      "제공한 자료에서 사실을 추출하고 근거·누락 정보·개선 제안을 순서대로 검토하고 있습니다.",
    );
    try {
      const result = await api(
        "/analyze",
        z.object({
          evidence: z.array(evidenceSchema),
          analysis: analysisSchema,
          suggestions: z.array(suggestionSchema),
        }),
        { project, role: snapshot.role },
      );
      update((w) => ({
        ...w,
        projects: w.projects.map((p) =>
          p.id === id && p.revision === project.revision
            ? {
                ...p,
                ...result,
                suggestions: [
                  ...p.suggestions
                    .filter(
                      (s) => s.status === "applied" || s.status === "rejected",
                    )
                    .slice(-20),
                  ...result.suggestions,
                ],
                updatedAt: now(),
              }
            : p,
        ),
      }));
      setNotice(result.analysis.notice);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "분석에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setBusy(null);
    }
  }
  function decide(
    projectId: string,
    id: string,
    action: "applied" | "rejected",
    edited?: string,
  ) {
    try {
      const project = latest.current.projects.find((p) => p.id === projectId);
      if (!project) return;
      if (project.analysis?.role !== latest.current.role)
        throw new Error("목표 직무가 변경되었습니다. 다시 분석해주세요.");
      const next = decideSuggestion(project, id, action, edited);
      update((w) => ({
        ...w,
        projects: w.projects.map((p) => (p.id === projectId ? next : p)),
      }));
      setNotice(
        action === "applied"
          ? "제안을 적용했습니다. 변경한 내용으로 다시 분석해주세요."
          : "제안을 거절했습니다. 원문은 그대로 유지됩니다.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "제안을 처리하지 못했습니다.");
    }
  }
  async function authenticate(
    mode: "login" | "register",
    email: string,
    password: string,
    name: string,
  ) {
    await queue.current;
    const result = await api(
      `/auth/${mode}`,
      z.object({
        user: userSchema.nullable(),
        confirmationRequired: z.boolean().optional(),
      }),
      {
        email,
        password,
        name: name || "개발자",
      },
    );
    if (result.confirmationRequired) return false;
    if (!result.user)
      throw new Error("로그인 정보를 확인하지 못했습니다. 다시 시도해주세요.");
    const data = await api(
      "/workspace",
      z.object({ workspace: workspaceSchema, revision: z.number() }),
    );
    epoch.current++;
    revision.current = data.revision;
    setUser(result.user);
    setWorkspace(data.workspace);
    setError("");
    setNotice(
      "계정의 작업 공간을 불러왔습니다. 체험 프로젝트는 이 브라우저에 별도로 보관됩니다.",
    );
    return true;
  }
  async function logout() {
    await persist(latest.current, user);
    await api("/auth/logout", z.object({ ok: z.boolean() }), {});
    epoch.current++;
    revision.current = 0;
    setUser(null);
    try {
      setWorkspace(guest());
    } catch {
      setWorkspace(emptyWorkspace());
      protectedGuest.current = true;
    }
    setNotice("로그아웃했습니다. 계정 데이터는 서버에 저장되어 있습니다.");
  }
  return (
    <Context.Provider
      value={{
        workspace,
        user,
        ready,
        saveStatus,
        error,
        notice,
        busy,
        update,
        updateProject,
        importProject,
        analyze,
        decide,
        authenticate,
        logout,
        addExamples: () => {
          update((w) => ({
            ...w,
            projects: [...w.projects, ...exampleProjects()],
          }));
          setNotice(
            "예시 프로젝트입니다. 실제 본인 경험으로 표시되지 않도록 예시 배지가 붙습니다.",
          );
        },
        save: () => persist(latest.current, user),
        dismissError: () => setError(""),
      }}
    >
      {children}
    </Context.Provider>
  );
}
