import type { ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card", className)}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card-header", className)}>{children}</div>;
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card-body", className)}>{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  variant = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "danger" | "neutral";
}) {
  const accent =
    variant === "success"
      ? "border-l-4 border-l-[#006233]"
      : variant === "danger"
        ? "border-l-4 border-l-[#d20a11]"
        : variant === "neutral"
          ? "border-l-4 border-l-[#003d88]"
          : "";

  const valueColor =
    variant === "success"
      ? "text-[#006233]"
      : variant === "danger"
        ? "text-[#d20a11]"
        : "text-[#212121]";

  return (
    <div className={clsx("stat-card", accent)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#64748b]">{label}</p>
          <p className={clsx("mt-2 text-3xl font-bold tracking-tight", valueColor)}>
            {value}
          </p>
          {sub ? <p className="mt-1 text-xs text-[#94a3b8]">{sub}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc] text-[#64748b]">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Badge({
  children,
  variant = "info",
}: {
  children: ReactNode;
  variant?: "success" | "danger" | "warning" | "info";
}) {
  return (
    <span
      className={clsx(
        "badge",
        variant === "success" && "badge-success",
        variant === "danger" && "badge-danger",
        variant === "warning" && "badge-warning",
        variant === "info" && "badge-info"
      )}
    >
      {children}
    </span>
  );
}
