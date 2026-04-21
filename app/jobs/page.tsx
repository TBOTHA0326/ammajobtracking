'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Car, ChevronRight, Plus, Search, X } from 'lucide-react';
import { Shell } from '../../components/Shell';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppData } from '../../components/AppDataProvider';
import { getDismantlerName, getStatusColor, getStatusLabel } from '../../lib/sample-data';

const TERMINAL_STATUSES = ['completed', 'cancelled', 'written-off-scrap'];

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  'accident-damaged': { label: 'Accident',  color: 'text-amber-400' },
  'written-off':      { label: 'Write-off', color: 'text-rose-400' },
  '2nd-hand':         { label: '2nd Hand',  color: 'text-slate-400' },
  'flood-damaged':    { label: 'Flood',     color: 'text-sky-400' },
};

function CompletionChip({ dateStr }: { dateStr: string }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eta = new Date(dateStr);
  eta.setHours(0, 0, 0, 0);
  const diff = Math.round((eta.getTime() - today.getTime()) / 86_400_000);

  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-rose-900/40 px-2 py-0.5 text-xs font-semibold text-rose-400">
        {Math.abs(diff)}d overdue
      </span>
    );
  }
  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-900/40 px-2 py-0.5 text-xs font-semibold text-amber-400">
        Today
      </span>
    );
  }
  return (
    <span className="mono text-xs text-emerald-400">
      {dateStr}
    </span>
  );
}

export default function JobsPage() {
  const { jobs, statuses, activeBranch } = useAppData();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const branchJobs = useMemo(
    () => jobs.filter((j) => j.branchId === activeBranch && !j.isArchived),
    [jobs, activeBranch],
  );

  const openJobs = useMemo(
    () => branchJobs.filter((j) => !TERMINAL_STATUSES.includes(j.status)),
    [branchJobs],
  );

  const filteredJobs = useMemo(() => {
    const search = query.toLowerCase();
    return branchJobs
      .filter((job) => {
        const dv = job.donorVehicle;
        const matchSearch =
          !search ||
          job.number.toLowerCase().includes(search) ||
          dv.rego.toLowerCase().includes(search) ||
          dv.make.toLowerCase().includes(search) ||
          dv.model.toLowerCase().includes(search);
        const matchStatus = statusFilter === 'all' || job.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        // Overdue first, then by estimated completion date ascending
        const today = new Date().toISOString().split('T')[0];
        const aOverdue = a.estimatedCompletionDate < today ? -1 : 1;
        const bOverdue = b.estimatedCompletionDate < today ? -1 : 1;
        if (aOverdue !== bOverdue) return aOverdue - bOverdue;
        return a.estimatedCompletionDate.localeCompare(b.estimatedCompletionDate);
      });
  }, [branchJobs, query, statusFilter]);

  const filterStatuses = statuses.filter((s) => s.showOnDashboard);

  return (
    <Shell>
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="section-label">Strip Jobs</p>
          <h1 className="page-title mt-1">Job Board</h1>
          <p className="page-subtitle">
            {openJobs.length} open &middot; {filteredJobs.length} showing
          </p>
        </div>
        <Link href="/jobs/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Strip Job
        </Link>
      </div>

      {/* Search + filter bar */}
      <div className="card mb-4 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search job no, rego, make / model…"
            className="input pl-9 py-2"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === 'all'
                ? 'bg-primary text-slate-900'
                : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.12]'
            }`}
          >
            All
          </button>
          {filterStatuses.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(statusFilter === s.id ? 'all' : s.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === s.id
                  ? 'bg-primary text-slate-900'
                  : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.12]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job No</th>
                <th>Donor Vehicle</th>
                <th>Condition</th>
                <th>Dismantler</th>
                <th>Completion</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Car className="h-8 w-8 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-400">No jobs found</p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your search or filter
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredJobs.map((job) => {
                const dv = job.donorVehicle;
                const cond = CONDITION_LABELS[dv.condition];
                return (
                  <tr key={job.id}>
                    {/* Job No */}
                    <td>
                      <span className="mono font-semibold text-primary">{job.number}</span>
                      <p className="mt-0.5 text-xs text-slate-500">{job.category}</p>
                    </td>

                    {/* Donor Vehicle */}
                    <td>
                      <span className="font-medium text-slate-200">
                        {dv.make} {dv.model} {dv.year}
                      </span>
                      <p className="mono mt-0.5 text-xs text-slate-500">{dv.rego}</p>
                    </td>

                    {/* Condition */}
                    <td>
                      {cond ? (
                        <span className={`text-xs font-semibold ${cond.color}`}>
                          {cond.label}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>

                    {/* Dismantler */}
                    <td className="text-sm text-slate-300">
                      {job.dismantlerId
                        ? getDismantlerName(job.dismantlerId)
                        : <span className="text-slate-600">—</span>}
                    </td>

                    {/* Completion */}
                    <td>
                      <CompletionChip dateStr={job.estimatedCompletionDate} />
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge
                        label={getStatusLabel(job.status)}
                        variant={getStatusColor(job.status)}
                      />
                    </td>

                    {/* View */}
                    <td>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="btn-ghost px-2.5 py-1.5 text-xs"
                        title={`View job ${job.number}`}
                      >
                        View <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredJobs.length > 0 && (
          <div className="border-t border-white/[0.06] px-4 py-2.5 text-xs text-slate-500">
            Showing {filteredJobs.length} of {branchJobs.length} jobs
          </div>
        )}
      </div>
    </Shell>
  );
}
