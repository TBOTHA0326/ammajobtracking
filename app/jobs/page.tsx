'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Wrench, CaretRight } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { PageHeader, SearchInput, StatusBadge, PriorityBadge, EmptyState } from '@/components/ui';
import { formatDate, getDaysOverdue } from '@/lib/format';
import type { JobStatus, JobPriority } from '@/lib/types';

const STATUS_OPTIONS: { value: '' | JobStatus; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'waiting-parts', label: 'Waiting for Parts' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS: { value: '' | JobPriority; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function JobsPage() {
  const { jobs, customers, vehicles } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | JobStatus>('');
  const [priorityFilter, setPriorityFilter] = useState<'' | JobPriority>('');

  const sorted = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const aOverdue = !['completed', 'cancelled'].includes(a.status) ? getDaysOverdue(a.dueDate) : 0;
      const bOverdue = !['completed', 'cancelled'].includes(b.status) ? getDaysOverdue(b.dueDate) : 0;
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sorted.filter((job) => {
      if (statusFilter && job.status !== statusFilter) return false;
      if (priorityFilter && job.priority !== priorityFilter) return false;
      if (q) {
        const customer = customers.find((c) => c.id === job.customerId);
        const vehicle = vehicles.find((v) => v.id === job.vehicleId);
        const haystack = [
          job.title,
          customer?.name ?? '',
          vehicle?.make ?? '',
          vehicle?.model ?? '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [sorted, search, statusFilter, priorityFilter, customers, vehicles]);

  return (
    <div className="animate-in">
      <PageHeader
        label="Workshop"
        title="Jobs"
        subtitle={`${jobs.length} total jobs`}
        actions={
          <Link href="/jobs/new" className="btn btn-primary">
            <Plus size={16} weight="bold" />
            New Job
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search jobs, customers, vehicles…"
        />
        <select
          className="input select"
          style={{ width: 'auto', minWidth: '10rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | JobStatus)}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          className="input select"
          style={{ width: 'auto', minWidth: '9rem' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as '' | JobPriority)}
        >
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results summary */}
      <p className="section-label mb-3">
        Showing {filtered.length} of {jobs.length} jobs
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Wrench size={40} />}
          title="No jobs found"
          description="Try adjusting your search or filters, or create a new job."
          action={
            <Link href="/jobs/new" className="btn btn-primary">
              <Plus size={15} weight="bold" />
              New Job
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job #</th>
                <th>Title</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job, index) => {
                const customer = customers.find((c) => c.id === job.customerId);
                const vehicle = vehicles.find((v) => v.id === job.vehicleId);
                const jobNumber = `J-${String(index + 1).padStart(4, '0')}`;
                const overdue =
                  !['completed', 'cancelled'].includes(job.status) &&
                  getDaysOverdue(job.dueDate) > 0;

                return (
                  <tr key={job.id}>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-muted)' }}>
                        {jobNumber}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium hover:underline"
                        style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {customer?.name ?? '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={job.priority} />
                    </td>
                    <td>
                      <span
                        style={{
                          color: overdue ? '#f87171' : 'var(--text-secondary)',
                          fontWeight: overdue ? 600 : 400,
                          fontSize: '0.8125rem',
                        }}
                      >
                        {formatDate(job.dueDate)}
                        {overdue && (
                          <span
                            className="ml-1"
                            style={{ color: '#f87171', fontSize: '0.6875rem' }}
                          >
                            ({getDaysOverdue(job.dueDate)}d overdue)
                          </span>
                        )}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="btn btn-ghost"
                        style={{ padding: '0.25rem 0.5rem' }}
                        aria-label={`View ${job.title}`}
                      >
                        <CaretRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
