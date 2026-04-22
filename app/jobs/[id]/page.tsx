'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Wrench, Users, Car, CalendarCheck } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { PageHeader, StatusBadge, PriorityBadge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/format';

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { jobs, customers, vehicles, technicians } = useApp();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <div className="animate-in">
        <PageHeader title="Job not found" subtitle="This job could not be located." />
        <Link href="/jobs" className="btn btn-secondary">
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === job.customerId);
  const vehicle = vehicles.find((v) => v.id === job.vehicleId);
  const assignedTechs = technicians.filter((tech) => job.assignedTechnicianIds.includes(tech.id));

  return (
    <div className="animate-in">
      <PageHeader
        label="Workshop"
        title={job.title}
        subtitle={`Job ${job.id} · ${customer?.name ?? 'Unknown customer'}`}
        actions={
          <Link href="/jobs" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to jobs
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-label">Status</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={job.status} />
                  <PriorityBadge priority={job.priority} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="section-label">Estimate</p>
                <p className="stat-num">{formatCurrency(job.estimatedCost)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="section-label">Start</p>
                <p>{formatDate(job.startDate)}</p>
              </div>
              <div>
                <p className="section-label">Due</p>
                <p>{formatDate(job.dueDate)}</p>
              </div>
              <div>
                <p className="section-label">Completed</p>
                <p>{job.completedAt ? formatDate(job.completedAt) : 'Not completed'}</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <p className="section-label">Job description</p>
            <p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
              {job.description}
            </p>
          </div>

          <div className="card p-5">
            <p className="section-label">Parts & notes</p>
            {job.parts.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                No parts assigned yet.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {job.parts.map((part) => (
                  <div key={part.partId} className="rounded-xl border border-[rgba(255,255,255,0.06)] p-3 bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{part.partName}</p>
                      <p className="text-sm text-slate-400">{part.quantity} × {formatCurrency(part.unitPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <p className="section-label">Notes</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {job.notes || 'No extra notes provided.'}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <Users size={18} />
              <div>
                <p className="section-label">Customer</p>
                <p className="font-medium">{customer?.name ?? 'Unknown'}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {customer?.phone} · {customer?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <Car size={18} />
              <div>
                <p className="section-label">Vehicle</p>
                <p className="font-medium">{vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle'}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {vehicle?.registration} · {vehicle?.vin}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <Wrench size={18} />
              <div>
                <p className="section-label">Assigned technicians</p>
                {assignedTechs.length > 0 ? (
                  assignedTechs.map((tech) => (
                    <p key={tech.id} className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {tech.name} — {tech.role}
                    </p>
                  ))
                ) : (
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No technicians assigned
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <CalendarCheck size={18} />
              <div>
                <p className="section-label">Job ID</p>
                <p className="font-medium">{job.id}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
