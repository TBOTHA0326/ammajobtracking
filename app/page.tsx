'use client';

import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Briefcase,
  CalendarCheck,
  Warning,
  Package,
} from '@phosphor-icons/react';

import { useApp } from '@/components/app-provider';
import { KpiCard, StatusBadge, PageHeader } from '@/components/ui';
import { formatDate, getStatusLabel } from '@/lib/format';
import type { JobStatus } from '@/lib/types';

// ── Recharts custom tooltip ────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card px-3 py-2 text-xs"
      style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <p className="font-semibold mb-0.5">{label}</p>
      <p style={{ color: 'var(--primary)' }}>{payload[0].value} jobs</p>
    </div>
  );
}

// ── Status ordering for the bar chart ─────────────────────────────────────────
const STATUS_ORDER: JobStatus[] = [
  'pending',
  'in-progress',
  'waiting-parts',
  'completed',
  'cancelled',
];

const STATUS_SHORT_LABELS: Record<JobStatus, string> = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'waiting-parts': 'Waiting Parts',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
};

export default function DashboardPage() {
  const { jobs, customers, technicians, parts } = useApp();

  // ── KPI computations ───────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeJobs = jobs.filter(
    (j) => j.status !== 'completed' && j.status !== 'cancelled'
  );

  const jobsDueToday = jobs.filter((j) => {
    if (j.status === 'completed' || j.status === 'cancelled') return false;
    const due = new Date(j.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });

  const overdueJobs = jobs.filter((j) => {
    if (j.status === 'completed' || j.status === 'cancelled') return false;
    const due = new Date(j.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  });

  const lowStockParts = parts.filter((p) => p.stock <= p.reorderLevel);

  // ── Bar chart data ─────────────────────────────────────────────────────────
  const statusCounts = STATUS_ORDER.map((status) => ({
    status: STATUS_SHORT_LABELS[status],
    count: jobs.filter((j) => j.status === status).length,
  }));

  // ── Priority breakdown ─────────────────────────────────────────────────────
  const highCount = jobs.filter((j) => j.priority === 'high').length;
  const mediumCount = jobs.filter((j) => j.priority === 'medium').length;
  const lowCount = jobs.filter((j) => j.priority === 'low').length;
  const totalJobs = jobs.length;

  const priorityRows = [
    { label: 'High', count: highCount, barColor: '#f97316' },
    { label: 'Medium', count: mediumCount, barColor: '#f59e0b' },
    { label: 'Low', count: lowCount, barColor: '#64748b' },
  ];

  // ── Recent jobs ────────────────────────────────────────────────────────────
  const recentJobs = jobs.slice(0, 6);

  // ── Technician workload ────────────────────────────────────────────────────
  const techWorkload = technicians.map((tech) => ({
    ...tech,
    activeJobCount: jobs.filter(
      (j) =>
        j.assignedTechnicianIds.includes(tech.id) &&
        j.status !== 'completed' &&
        j.status !== 'cancelled'
    ).length,
  }));

  return (
    <div className="animate-in">
      <PageHeader
        label="Overview"
        title="Dashboard"
        subtitle="Live snapshot of workshop activity"
      />

      {/* ── Row 1: KPI strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <KpiCard
          label="Active Jobs"
          value={activeJobs.length}
          sub="Non-completed, non-cancelled"
        />
        <KpiCard
          label="Jobs Due Today"
          value={jobsDueToday.length}
          sub={
            jobsDueToday.length === 1
              ? '1 job needs attention'
              : `${jobsDueToday.length} jobs need attention`
          }
        />
        <KpiCard
          label="Overdue Jobs"
          value={overdueJobs.length}
          accent={overdueJobs.length > 0}
          sub={overdueJobs.length > 0 ? 'Requires immediate action' : 'All on schedule'}
        />
        <KpiCard
          label="Low Stock Parts"
          value={lowStockParts.length}
          accent={lowStockParts.length > 0}
          sub={
            lowStockParts.length > 0
              ? `${lowStockParts.length} part${lowStockParts.length > 1 ? 's' : ''} at or below reorder level`
              : 'Stock levels healthy'
          }
        />
      </div>

      {/* ── Row 2: Chart + Priority ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

        {/* Jobs by Status bar chart */}
        <div className="card p-5 lg:col-span-2">
          <p className="section-label mb-3">Jobs by Status</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={statusCounts}
              margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="status"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="count" fill="#f97316" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority breakdown */}
        <div className="card p-5">
          <p className="section-label mb-3">Priority Breakdown</p>
          <div className="flex flex-col gap-4 mt-2">
            {priorityRows.map(({ label, count, barColor }) => {
              const pct = totalJobs > 0 ? (count / totalJobs) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {label}
                    </span>
                    <span
                      className="stat-num text-base"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    className="h-2 w-full rounded-full overflow-hidden"
                    style={{ background: 'var(--surface-elevated)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: barColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals footer */}
          <div
            className="mt-5 pt-4 flex items-center justify-between text-xs"
            style={{
              borderTop: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <span>Total jobs</span>
            <span className="stat-num text-sm" style={{ color: 'var(--text-primary)' }}>
              {totalJobs}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Jobs + Technician Workload ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

        {/* Recent Jobs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Recent Jobs</p>
            <Link
              href="/jobs"
              className="text-xs"
              style={{ color: 'var(--primary)' }}
            >
              View all
            </Link>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => {
                  const customer = customers.find((c) => c.id === job.customerId);
                  return (
                    <tr
                      key={job.id}
                      className="cursor-pointer"
                      style={{ transition: 'background 0.15s' }}
                    >
                      <td>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="block w-full"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          <span
                            className="font-medium text-sm line-clamp-1"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {job.title}
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span
                          className="text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {customer?.name ?? '—'}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={job.status} />
                      </td>
                      <td>
                        <span
                          className="mono text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {formatDate(job.dueDate)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technician Workload */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Technician Workload</p>
            <Link
              href="/jobs"
              className="text-xs"
              style={{ color: 'var(--primary)' }}
            >
              View jobs
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {techWorkload.map((tech) => (
              <div
                key={tech.id}
                className="flex items-center justify-between rounded-lg px-3 py-3"
                style={{ background: 'var(--surface-elevated)' }}
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {tech.name}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {tech.role}
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {tech.activeJobCount > 0 ? (
                    <span
                      className="badge"
                      style={{
                        background: '#f97316',
                        color: '#000',
                        fontWeight: 700,
                        minWidth: '1.75rem',
                        textAlign: 'center',
                      }}
                    >
                      {tech.activeJobCount}
                    </span>
                  ) : (
                    <span
                      className="badge"
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text-muted)',
                        minWidth: '1.75rem',
                        textAlign: 'center',
                      }}
                    >
                      0
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
