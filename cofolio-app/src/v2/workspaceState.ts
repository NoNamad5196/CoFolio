import { createContext, useContext } from "react";
import type { ImportInput, Project, Workspace } from "./domain";

export interface User {
  id: string;
  email: string;
  name: string;
}
export type SaveStatus = "loading" | "saving" | "saved" | "error";
interface Value {
  workspace: Workspace;
  user: User | null;
  ready: boolean;
  saveStatus: SaveStatus;
  error: string;
  notice: string;
  busy: string | null;
  update: (fn: (w: Workspace) => Workspace) => void;
  updateProject: (
    id: string,
    patch: Partial<Project>,
    content?: boolean,
  ) => void;
  importProject: (data: ImportInput) => Promise<string>;
  analyze: (id: string) => Promise<void>;
  decide: (
    projectId: string,
    suggestionId: string,
    action: "applied" | "rejected",
    edited?: string,
  ) => void;
  authenticate: (
    mode: "login" | "register",
    email: string,
    password: string,
    name: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  addExamples: () => void;
  save: () => Promise<void>;
  dismissError: () => void;
}
export const WorkspaceContext = createContext<Value | null>(null);
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("WorkspaceProvider is required");
  return value;
}
