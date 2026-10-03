import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { emptyWorkspace, roles, workspaceSchema } from "../src/v2/domain.ts";
import type { Workspace } from "../src/v2/domain.ts";

const scrypt = promisify(scryptCallback);
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export class Store {
  db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,password_hash TEXT NOT NULL,created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS target_roles(id TEXT PRIMARY KEY,label TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS portfolios(id TEXT PRIMARY KEY,user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,role_id TEXT NOT NULL REFERENCES target_roles(id),document TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY,portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,position INTEGER NOT NULL,document TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS evidence(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,document TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS analyses(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,role_id TEXT NOT NULL REFERENCES target_roles(id),document TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS suggestions(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,document TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS projects_portfolio_idx ON projects(portfolio_id); CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);`);
    for (const [id, role] of Object.entries(roles))
      this.db
        .prepare("INSERT OR IGNORE INTO target_roles(id,label) VALUES(?,?)")
        .run(id, role.label);
  }
  async register(email: string, password: string, name: string) {
    if (this.db.prepare("SELECT id FROM users WHERE email=?").get(email))
      throw new HttpError(409, "이미 등록된 이메일입니다. 로그인해주세요.");
    const salt = randomBytes(16).toString("hex");
    const hash = ((await scrypt(password, salt, 64)) as Buffer).toString("hex");
    const user = { id: crypto.randomUUID(), email, name };
    try {
      this.db
        .prepare("INSERT INTO users VALUES(?,?,?,?,?)")
        .run(user.id, email, name, `${salt}:${hash}`, new Date().toISOString());
    } catch {
      throw new HttpError(409, "이미 등록된 이메일입니다. 로그인해주세요.");
    }
    return user;
  }
  async login(email: string, password: string) {
    const user = this.db
      .prepare("SELECT * FROM users WHERE email=?")
      .get(email) as
      | { id: string; email: string; name: string; password_hash: string }
      | undefined;
    const [salt, stored] = (
      user?.password_hash || "0000000000000000:" + "0".repeat(128)
    ).split(":");
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    if (!user || !timingSafeEqual(hash, Buffer.from(stored, "hex")))
      throw new HttpError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    return { id: user.id, email: user.email, name: user.name };
  }
  session(userId: string) {
    const token = randomBytes(32).toString("hex");
    this.db
      .prepare("DELETE FROM sessions WHERE expires_at < ?")
      .run(Date.now());
    this.db
      .prepare("INSERT INTO sessions VALUES(?,?,?)")
      .run(
        createHash("sha256").update(token).digest("hex"),
        userId,
        Date.now() + 7 * 86400000,
      );
    return token;
  }
  user(token: string) {
    return this.db
      .prepare(
        "SELECT u.id,u.email,u.name FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?",
      )
      .get(createHash("sha256").update(token).digest("hex"), Date.now()) as
      { id: string; email: string; name: string } | undefined;
  }
  logout(token: string) {
    this.db
      .prepare("DELETE FROM sessions WHERE token_hash=?")
      .run(createHash("sha256").update(token).digest("hex"));
  }
  load(userId: string) {
    const row = this.db
      .prepare("SELECT document,revision FROM portfolios WHERE user_id=?")
      .get(userId) as { document: string; revision: number } | undefined;
    return row
      ? {
          workspace: workspaceSchema.parse(JSON.parse(row.document)),
          revision: row.revision,
        }
      : { workspace: emptyWorkspace(), revision: 0 };
  }
  save(userId: string, workspace: Workspace, revision: number) {
    const data = workspaceSchema.parse(workspace);
    const row = this.db
      .prepare(
        "SELECT id,user_id,revision FROM portfolios WHERE id=? OR user_id=?",
      )
      .all(data.id, userId) as {
      id: string;
      user_id: string;
      revision: number;
    }[];
    if (row.some((r) => r.user_id !== userId))
      throw new HttpError(403, "이 포트폴리오에 접근할 수 없습니다.");
    if (row.length && (row[0].revision !== revision || row[0].id !== data.id))
      throw new HttpError(
        409,
        "다른 창에서 내용이 변경되었습니다. 현재 내용을 내보낸 뒤 새로고침해주세요.",
      );
    const next = revision + 1;
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare(
          "INSERT INTO portfolios VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET role_id=excluded.role_id,document=excluded.document,revision=excluded.revision",
        )
        .run(data.id, userId, data.role, JSON.stringify(data), next);
      this.db.prepare("DELETE FROM projects WHERE portfolio_id=?").run(data.id);
      data.projects.forEach((project, index) => {
        this.db
          .prepare("INSERT INTO projects VALUES(?,?,?,?)")
          .run(project.id, data.id, index, JSON.stringify(project));
        project.evidence.forEach((e) =>
          this.db
            .prepare("INSERT INTO evidence VALUES(?,?,?)")
            .run(e.id, project.id, JSON.stringify(e)),
        );
        if (project.analysis)
          this.db
            .prepare("INSERT INTO analyses VALUES(?,?,?,?)")
            .run(
              project.analysis.id,
              project.id,
              project.analysis.role,
              JSON.stringify(project.analysis),
            );
        project.suggestions.forEach((s) =>
          this.db
            .prepare("INSERT INTO suggestions VALUES(?,?,?)")
            .run(s.id, project.id, JSON.stringify(s)),
        );
      });
      this.db.exec("COMMIT");
      return next;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  close() {
    this.db.close();
  }
}
