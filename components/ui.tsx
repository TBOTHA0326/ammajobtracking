'use client';
import { ReactNode } from 'react';
import { getStatusColor, getStatusLabel, getPriorityColor } from '@/lib/format';

/* ── StatusBadge ─────────────────────────────────────────────────────────── */
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}

/* ── PriorityBadge ───────────────────────────────────────────────────────── */
export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`badge ${getPriorityColor(priority)}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

/* ── KpiCard ─────────────────────────────────────────────────────────────── */
export function KpiCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-5">
      <p className="section-label mb-3">{label}</p>
      <p
        className="stat-num text-3xl"
        style={{ color: accent ? 'var(--primary)' : 'var(--text-primary)' }}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── PageHeader ──────────────────────────────────────────────────────────── */
export function PageHeader({
  label,
  title,
  subtitle,
  actions,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {label && <p className="section-label">{label}</p>}
        <h1 className="page-title" style={{ marginTop: label ? '0.25rem' : 0 }}>
          {title}
        </h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      )}
    </div>
  );
}

/* ── EmptyState ──────────────────────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </p>
      {description && (
        <p
          className="text-xs"
          style={{ color: 'var(--text-muted)', maxWidth: '24rem' }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ── FieldLabel ──────────────────────────────────────────────────────────── */
export function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      className="mb-1.5 block text-sm font-medium"
      style={{ color: 'var(--text-secondary)' }}
    >
      {children}
      {required && (
        <span className="ml-0.5" style={{ color: '#f87171' }}>
          *
        </span>
      )}
    </label>
  );
}

/* ── SearchInput ─────────────────────────────────────────────────────────── */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative search-input-wrap">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: 'var(--text-muted)' }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
        style={{ width: '100%', maxWidth: '20rem', paddingLeft: '2.25rem', paddingRight: '1rem' }}
      />
    </div>
  );
}
