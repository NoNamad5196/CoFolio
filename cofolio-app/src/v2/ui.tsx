import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "../components/common/Icon";
import { statusLabels } from "./domain";
import type { Status } from "./domain";
export function Button({
  children,
  kind = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: "primary" | "secondary" | "quiet" | "danger";
}) {
  return (
    <button type="button" className={`btn ${kind} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Badge({ status }: { status: Status }) {
  return (
    <span className={`badge ${status}`}>
      <span className="status-dot" />
      {statusLabels[status]}
    </span>
  );
}
export function Tag({ children }: { children: ReactNode }) {
  return <span className="tech-tag">{children}</span>;
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name="folder" size={24} />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="actions">{actions}</div>
    </div>
  );
}
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
