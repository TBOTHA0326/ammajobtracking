'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, ArrowRight, Car, CheckCircle2, Clock, Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { Shell } from '../components/Shell';
import { KpiCard } from '../components/KpiCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAppData } from '../components/AppDataProvider';
import {
  getBranchName,
  getDismantlerName,
  getStatusColor,
  getStatusLabel,
} from '../lib/sample-data';

const TERMINAL_STATUSES = ['completed', 'cancelled', 'written-off-scrap'];

const BAR_COLORS: Record<string, string> = {
  slate:   '#94a3b8',
  sky:     '#38bdf8',
  blue:    '#60a5fa',
  amber:   '#fbbf24',
  indigo:  '#818cf8',
  emerald: '#34d399',
  violet:  '#a78bfa',
  lime:    '#a3e635',
  rose:    '#fb7185',
};

function CompletionChip({ dateStr }: { dateStr: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eta = new Date(dateStr);
  eta.setHours(0, 0, 0, 0);
  const diff = Math.round((eta.getTime() - today.getTime()) / 86_400_000);

  if (diff < 0)
    return (
      <span className="mono text-xs font-semibold text-rose-400">
        {diff}d overdue
      </span>
    );
  if (diff === 0)
    return (
      <span className="mono text-xs font-semibold text-amber-400">Today</span>
    );
  return <span className="mono text-xs text-slate-500">+{diff}d</span>;
}

const CONDITION_STYLES: Record<string, { label: string; className: string }> = {
  'accident-damaged': { label: 'Accident',  className: 'text-amber-400' },
  'written-off':      { label: 'Write-off', className: 'text-rose-400' },
  '2nd-hand':         { label: '2nd Hand',  className: 'text-slate-400' },
  'flood-damaged':    { label: 'Flood',     className: 'text-sky-400' },
};

export default function DashboardPage() {
  const { jobs, statuses, activeBranch } = useAppData();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Active (non-archived, non-terminal) jobs for the active branch
  const branchJobs = jobs.filter(
    (j) => j.branchId === activeBranch && !j.isArchived,
  );
  const activeJobs = branchJobs.filter(
    (j) => !TERMINAL_STATUSES.includes(j.status),
  );

  // KPI: Overdue
  const overdueCount = activeJobs.filter(
    (j) => new Date(j.estimatedCompletionDate) < today,
  ).length;

  // KPI: Parts In Stock (sum of quantities across active branch jobs)
  const partsInStock = branchJobs.reduce(
    (sum, job) =>
      sum +
      job.harvestedParts.filter((p) => p.status === 'In Stock').reduce((s, p) => s + p.quantity, 0),
    0,
  );

  // KPI: Parts Reserved or Sold
  const partsReservedSold = branchJobs.reduce(
    (sum, job) =>
      sum +
      job.harvestedParts.filter(
        (p) => p.status === 'Reserved' || p.status === 'Sold',
      ).length,
    0,
  );

  // Chart: Jobs by stage (dashboard-visible statuses only)
  const statusData = statuses
    .filter((s) => s.showOnDashboard)
    .map((s) => ({
      name: s.label,
      count: branchJobs.filter((j) => j.status === s.id).length,
      color: s.color,
    }));

  // Priority jobs: active jobs sorted by estimated completion date ascending, top 5
  const priorityJobs = activeJobs
    .slice()
    .sort(
      (a, b) =>
        new Date(a.estimatedCompletionDate).getTime() -
        new Date(b.estimatedCompletionDate).getTime(),
    )
    .slice(0, 5);

  // Recent acquisitions: last 8 across ALL branches, sorted by acquiredDate desc
  const recentAcquisitions = jobs
    .slice()
    .sort(
      (a, b) =>
        new Date(b.acquiredDate).getTime() - new Date(a.acquiredDate).getTime(),
    )
    .slice(0, 8);

  return (
    <Shell>
      {/* ── Page header ────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <p className="section-label">Overview</p>
          <h1 className="page-title mt-1">Strip Operations Board</h1>
          <p className="page-subtitle">
            {getBranchName(activeBranch)} ·{' '}
            {new Date().toLocaleDateString('en-ZA', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Link href="/jobs/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Strip Job
        </Link>
      </div>

      {/* ── KPI row ────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active Strip Jobs"
          value={String(activeJobs.length)}
          icon={<Car className="h-4 w-4" />}
          accent="bg-slate-600"
          trend="neutral"
        />
        <KpiCard
          label="Overdue Completion"
          value={String(overdueCount)}
          delta={overdueCount > 0 ? 'Needs attention' : 'All on track'}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={overdueCount > 0 ? 'bg-rose-600' : 'bg-slate-600'}
          trend={overdueCount > 0 ? 'down' : 'neutral'}
        />
        <KpiCard
          label="Parts In Stock"
          value={String(partsInStock)}
          icon={<Package className="h-4 w-4" />}
          accent="bg-amber-600"
          trend="neutral"
        />
        <KpiCard
          label="Parts Reserved / Sold"
          value={String(partsReservedSold)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="bg-emerald-600"
          trend="neutral"
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">

        {/* Left: Jobs by Stage chart */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-label">Workflow</p>
              <h2 className="mt-0.5 text-base font-semibold text-slate-200">
                Jobs by Stage
              </h2>
            </div>
            <Link href="/jobs" className="btn-ghost text-xs gap-1.5">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={42}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => [value, 'Jobs']}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    background: '#1a1d26',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={BAR_COLORS[entry.color] ?? '#84cc16'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Priority Jobs list */}
        <div className="card">
          <div
            className="flex items-center justify-between gap-3 px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-200">
                Priority Jobs
              </span>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-primary hover:text-primary-dark transition"
            >
              View all
            </Link>
          </div>

          <div
            className="divide-y"
            style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}
          >
            {priorityJobs.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">
                No active jobs for this branch.
              </p>
            ) : (
              priorityJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '';
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="mono text-xs font-semibold text-primary">
                        {job.number}
                      </span>
                      <StatusBadge
                        label={getStatusLabel(job.status)}
                        variant={getStatusColor(job.status)}
                      />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {job.donorVehicle.make} {job.donorVehicle.model}{' '}
                      {job.donorVehicle.year} · {job.donorVehicle.rego}
                    </p>
                  </div>
                  <CompletionChip dateStr={job.estimatedCompletionDate} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Acquisitions table ───────────────────────── */}
      <div className="mt-5 card">
        <div
          className="flex items-center justify-between gap-3 px-5 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-sm font-semibold text-slate-200">
            Recent Acquisitions
          </span>
          <span className="text-xs text-slate-500">All branches</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job No</th>
                <th>Donor Vehicle</th>
                <th>Condition</th>
                <th>Dismantler</th>
                <th>Status</th>
                <th>Acquired</th>
              </tr>
            </thead>
            <tbody>
              {recentAcquisitions.map((job) => {
                const condStyle =
                  CONDITION_STYLES[job.donorVehicle.condition] ??
                  CONDITION_STYLES['2nd-hand'];
                return (
                  <tr key={job.id}>
                    <td>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="mono font-semibold text-primary hover:underline"
                      >
                        {job.number}
                      </Link>
                    </td>
                    <td>
                      <span className="text-slate-200">
                        {job.donorVehicle.year} {job.donorVehicle.make}{' '}
                        {job.donorVehicle.model}
                      </span>{' '}
                      <span className="text-slate-500 text-xs">
                        · {job.donorVehicle.rego}
                      </span>
                    </td>
                    <td>
                      <span className={`text-xs font-semibold ${condStyle.className}`}>
                        {condStyle.label}
                      </span>
                    </td>
                    <td className="text-slate-300">
                      {getDismantlerName(job.dismantlerId)}
                    </td>
                    <td>
                      <StatusBadge
                        label={getStatusLabel(job.status)}
                        variant={getStatusColor(job.status)}
                      />
                    </td>
                    <td className="text-xs text-slate-500">
                      {new Date(job.acquiredDate).toLocaleDateString('en-ZA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
