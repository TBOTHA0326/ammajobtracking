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
import { useApp } from '@/components/app-provider';
import { KpiCard, PageHeader } from '@/components/ui';
import { formatCurrency } from '@/lib/format';

const STATUS_COLOR = {
  pending: '#fbbf24',
  'in-progress': '#38bdf8',
  'waiting-parts': '#f97316',
  completed: '#22c55e',
  cancelled: '#f87171',
};

export default function ReportsPage() {
  const { jobs, technicians, parts } = useApp();

  const statusCounts = [
    { status: 'Pending', value: jobs.filter((job) => job.status === 'pending').length },
    { status: 'In progress', value: jobs.filter((job) => job.status === 'in-progress').length },
    { status: 'Waiting parts', value: jobs.filter((job) => job.status === 'waiting-parts').length },
    { status: 'Completed', value: jobs.filter((job) => job.status === 'completed').length },
    { status: 'Cancelled', value: jobs.filter((job) => job.status === 'cancelled').length },
  ];

  const revenue = jobs.reduce((sum, job) => sum + (job.finalCost ?? job.estimatedCost), 0);
  const activeTechs = technicians.filter((tech) => tech.isActive).length;
  const totalParts = parts.length;

  const busiestTech = technicians
    .map((tech) => ({
      tech,
      activeJobs: jobs.filter((job) => job.assignedTechnicianIds.includes(tech.id)).length,
    }))
    .sort((a, b) => b.activeJobs - a.activeJobs)[0];

  return (
    <div className="animate-in">
      <PageHeader
        label="Insights"
        title="Reports"
        subtitle="Operational metrics for the workshop"
        actions={
          <Link href="/" className="btn btn-secondary">
            Back to dashboard
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <KpiCard label="Revenue estimate" value={formatCurrency(revenue)} sub="Projected across all active jobs" />
        <KpiCard label="Active technicians" value={activeTechs} sub="Technicians currently on shift" />
        <KpiCard label="Parts items" value={totalParts} sub="Inventory SKUs available" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] mt-4">
        <div className="card p-5">
          <p className="section-label mb-3">Jobs by status</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusCounts} margin={{ top: 8, right: 14, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="status" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip wrapperStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 space-y-4">
          <div>
            <p className="section-label">Top technician</p>
            <p className="mt-2 text-lg font-semibold">{busiestTech?.tech.name ?? 'No active assignments'}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {busiestTech ? `${busiestTech.activeJobs} jobs assigned` : 'No assignment data available'}
            </p>
          </div>
          <div>
            <p className="section-label">Most used parts</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {parts.slice(0, 3).map((part) => part.name).join(', ') || 'No part usage data.'}
            </p>
          </div>
          <div>
            <p className="section-label">Health check</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Job flow and inventory data are up to date for the current simulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
