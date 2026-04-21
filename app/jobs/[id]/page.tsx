'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Archive, ArrowLeft, Calendar, Car, CheckCircle2, ChevronRight,
  Clock, FileText, Package, Tag, Wrench,
} from 'lucide-react';
import { Shell } from '../../../components/Shell';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAppData } from '../../../components/AppDataProvider';
import {
  getBranchName,
  getBuyerById,
  getDismantlerName,
  getStatusColor,
  getStatusLabel,
  statuses,
} from '../../../lib/sample-data';

type Tab = 'overview' | 'parts' | 'history';

const TERMINAL_STATUSES = ['completed', 'cancelled', 'written-off-scrap'];

const conditionColors: Record<string, string> = {
  'accident-damaged': 'bg-amber-900/40 text-amber-300',
  'written-off':      'bg-rose-900/40 text-rose-300',
  '2nd-hand':         'bg-slate-700/40 text-slate-300',
  'flood-damaged':    'bg-sky-900/40 text-sky-300',
};

const conditionLabels: Record<string, string> = {
  'accident-damaged': 'Accident Damaged',
  'written-off':      'Written Off',
  '2nd-hand':         '2nd Hand',
  'flood-damaged':    'Flood Damaged',
};

const partConditionColors: Record<string, string> = {
  'Good':            'bg-emerald-900/40 text-emerald-300',
  'Fair':            'bg-amber-900/40 text-amber-300',
  'Refurb Required': 'bg-indigo-900/40 text-indigo-300',
  'Scrap':           'bg-rose-900/40 text-rose-300',
};

const partStatusColors: Record<string, string> = {
  'In Stock':  'bg-slate-700/40 text-slate-300',
  'Reserved':  'bg-amber-900/40 text-amber-300',
  'Sold':      'bg-emerald-900/40 text-emerald-300',
  'Scrapped':  'bg-rose-900/40 text-rose-300',
};

function FinancialSummary({
  acquisitionCost,
  totalListValue,
}: {
  acquisitionCost: number;
  totalListValue: number;
}) {
  const grossMargin = totalListValue - acquisitionCost;
  const marginPct = totalListValue > 0 ? Math.round((grossMargin / totalListValue) * 100) : 0;

  return (
    <div className="card p-5 h-fit">
      <p className="section-label mb-4">Financial Summary</p>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Acquisition Cost</span>
          <span className="font-semibold text-slate-100 stat-num">
            R{acquisitionCost.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Total List Value</span>
          <span className="font-semibold text-slate-100 stat-num">
            R{totalListValue.toLocaleString()}
          </span>
        </div>
        <div className="h-px" style={{ background: 'var(--border)' }} />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200">Gross Margin</span>
          <span
            className={`text-base font-semibold stat-num ${grossMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
          >
            R{grossMargin.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Margin %</span>
          <span
            className={`font-semibold ${marginPct >= 30 ? 'text-emerald-400' : marginPct >= 15 ? 'text-amber-400' : 'text-rose-400'}`}
          >
            {marginPct}%
          </span>
        </div>
      </div>
      <div
        className="mt-4 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        <div
          className={`h-full rounded-full transition-all ${marginPct >= 30 ? 'bg-emerald-500' : marginPct >= 15 ? 'bg-amber-400' : 'bg-rose-500'}`}
          style={{ width: `${Math.min(Math.max(marginPct, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { jobs, archiveJob, updateJob } = useAppData();

  const jobId = params?.id as string;
  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobs, jobId]);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  if (!job) {
    return (
      <Shell>
        <div className="card p-10 text-center max-w-md mx-auto mt-10">
          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
          <h1 className="mt-4 text-lg font-semibold text-slate-100">Job not found</h1>
          <p className="mt-2 text-sm text-slate-400">
            This job could not be loaded. It may have been moved or does not exist.
          </p>
          <Link href="/jobs" className="btn-primary mt-6 inline-flex">
            Back to jobs
          </Link>
        </div>
      </Shell>
    );
  }

  // Overdue calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completionDate = new Date(job.estimatedCompletionDate);
  completionDate.setHours(0, 0, 0, 0);
  const daysDiff = Math.round((completionDate.getTime() - today.getTime()) / 86_400_000);
  const isTerminal = TERMINAL_STATUSES.includes(job.status);
  const isOverdue = daysDiff < 0 && !isTerminal;

  // Financials
  const totalListValue = job.harvestedParts.reduce(
    (sum, p) => sum + p.listPrice * p.quantity,
    0,
  );

  function handleStatusChange(newStatus: string) {
    const now = new Date().toISOString();
    const updatedHistory = job!.history.map((h, i) =>
      i === job!.history.length - 1 && !h.exitedAt ? { ...h, exitedAt: now } : h,
    );
    updateJob(job!.id, {
      status: newStatus,
      history: [
        ...updatedHistory,
        { id: `${job!.id}-h${Date.now()}`, status: newStatus, enteredAt: now },
      ],
    });
    setShowStatusPanel(false);
  }

  function handleArchive() {
    archiveJob(job!.id, true);
    router.push('/archive');
  }

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'parts', label: `Harvested Parts (${job.harvestedParts.length})`, icon: Package },
    { id: 'history', label: 'Status History', icon: Clock },
  ];

  return (
    <Shell>
      {/* ── Header ─────────────────────────────────────── */}
      <div className="page-header">
        <div className="flex items-start gap-3">
          <Link
            href="/jobs"
            className="btn-secondary mt-0.5 px-2.5 py-2"
            title="Back to jobs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="mono font-semibold text-sm" style={{ color: 'var(--primary)' }}>
                {job.number}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <StatusBadge label={getStatusLabel(job.status)} variant={getStatusColor(job.status)} />
              {isOverdue && (
                <span className="badge bg-rose-900/50 text-rose-300">
                  {Math.abs(daysDiff)}d overdue
                </span>
              )}
            </div>
            <h1 className="page-title mt-1">
              {job.donorVehicle.make} {job.donorVehicle.model}{' '}
              {job.donorVehicle.year}
            </h1>
            <p className="page-subtitle">
              {job.category} · {getBranchName(job.branchId)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowStatusPanel((v) => !v)}
            className="btn-secondary text-xs gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Change Status
          </button>
          {!showArchiveConfirm ? (
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="btn-ghost text-xs gap-1.5"
            >
              <Archive className="h-3.5 w-3.5" />
              Archive
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Archive this job?</span>
              <button onClick={handleArchive} className="btn-danger text-xs px-3 py-1.5">
                Confirm
              </button>
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="btn-ghost text-xs px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Status Change Panel ─────────────────────────── */}
      {showStatusPanel && (
        <div className="card mb-4 p-4 animate-in">
          <p className="section-label mb-3">Move to status</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStatusChange(s.id)}
                disabled={s.id === job.status}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                  s.id === job.status
                    ? 'cursor-default'
                    : 'hover:opacity-80'
                }`}
                style={
                  s.id === job.status
                    ? { background: 'var(--primary)', color: '#0f172a' }
                    : { background: 'rgba(255,255,255,0.07)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Meta strip ──────────────────────────────────── */}
      <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            icon: Calendar,
            label: 'Acquired',
            value: job.acquiredDate,
            danger: false,
          },
          {
            icon: Clock,
            label: 'Est. Completion',
            value: job.estimatedCompletionDate,
            danger: isOverdue,
          },
          {
            icon: Wrench,
            label: 'Dismantler',
            value: getDismantlerName(job.dismantlerId) || 'Unassigned',
            danger: false,
          },
          {
            icon: Tag,
            label: 'Category',
            value: job.category,
            danger: false,
          },
        ].map(({ icon: Icon, label, value, danger }) => (
          <div key={label} className="card p-3.5 flex items-start gap-3">
            <Icon
              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${danger ? 'text-rose-400' : 'text-slate-500'}`}
            />
            <div className="min-w-0">
              <p className="section-label">{label}</p>
              <p
                className={`mt-0.5 text-sm font-semibold truncate ${
                  danger ? 'text-rose-400' : 'text-slate-100'
                }`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────── */}
      <div
        className="mb-4 flex gap-1"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
                activeTab === tab.id
                  ? 'border-[#84cc16] text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Overview Tab ────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 xl:grid-cols-2">
          {/* Donor Vehicle */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-4 w-4 text-slate-500" />
              <p className="section-label">Donor Vehicle</p>
            </div>
            <p className="text-base font-semibold text-slate-100">
              {job.donorVehicle.make} {job.donorVehicle.model} {job.donorVehicle.year}
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className="mono text-sm font-semibold"
                  style={{ color: 'var(--primary)' }}
                >
                  {job.donorVehicle.rego}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    conditionColors[job.donorVehicle.condition] ??
                    'bg-slate-700/40 text-slate-300'
                  }`}
                >
                  {conditionLabels[job.donorVehicle.condition] ?? job.donorVehicle.condition}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {job.donorVehicle.variant} · {job.donorVehicle.engine}
              </p>
              <p className="text-sm text-slate-400">
                {job.donorVehicle.odometer.toLocaleString()} km
              </p>
              {job.donorVehicle.vin && (
                <p className="mono text-xs text-slate-500">VIN: {job.donorVehicle.vin}</p>
              )}
              <div
                className="pt-3 mt-3 space-y-1.5"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Acquisition Source</span>
                  <span className="text-slate-200 font-medium text-right max-w-[180px] truncate">
                    {job.donorVehicle.acquisitionSource}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Acquisition Cost</span>
                  <span className="text-slate-100 font-semibold stat-num">
                    R{job.donorVehicle.acquisitionCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financials */}
          <FinancialSummary
            acquisitionCost={job.donorVehicle.acquisitionCost}
            totalListValue={totalListValue}
          />

          {/* Description / Notes */}
          <div className="card p-5 xl:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-slate-500" />
              <p className="section-label">Description / Notes</p>
            </div>
            {job.description ? (
              <p className="text-sm text-slate-300 leading-relaxed">{job.description}</p>
            ) : (
              <p className="text-sm text-slate-600 italic">No notes recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Harvested Parts Tab ─────────────────────────── */}
      {activeTab === 'parts' && (
        <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
          <div className="card overflow-hidden">
            <div
              className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-elevated)' }}
            >
              <p className="text-sm font-semibold text-slate-200">Harvested Parts</p>
              <span className="text-xs text-slate-500">{job.harvestedParts.length} parts</span>
            </div>

            {job.harvestedParts.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="h-8 w-8 text-slate-700 mx-auto" />
                <p className="mt-3 text-sm font-semibold text-slate-500">No parts catalogued yet.</p>
                <p className="mt-1 text-xs text-slate-600">
                  Parts will appear here once stripping begins.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Part No</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Condition</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th className="text-right">List Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.harvestedParts.map((part) => {
                      const buyer = part.buyerId ? getBuyerById(part.buyerId) : undefined;
                      return (
                        <tr key={part.id}>
                          <td>
                            <span className="mono text-slate-300">{part.partNumber}</span>
                          </td>
                          <td className="text-slate-200">{part.description}</td>
                          <td className="text-slate-400">{part.quantity}</td>
                          <td>
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                partConditionColors[part.condition] ??
                                'bg-slate-700/40 text-slate-300'
                              }`}
                            >
                              {part.condition}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                partStatusColors[part.status] ??
                                'bg-slate-700/40 text-slate-300'
                              }`}
                            >
                              {part.status}
                            </span>
                          </td>
                          <td className="text-slate-400 text-sm">
                            {buyer ? buyer.name : <span className="text-slate-600">—</span>}
                          </td>
                          <td className="text-right font-semibold text-slate-100 stat-num">
                            {part.listPrice > 0
                              ? `R${(part.listPrice * part.quantity).toLocaleString()}`
                              : <span className="text-slate-600">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <FinancialSummary
            acquisitionCost={job.donorVehicle.acquisitionCost}
            totalListValue={totalListValue}
          />
        </div>
      )}

      {/* ── Status History Tab ──────────────────────────── */}
      {activeTab === 'history' && (
        <div className="card overflow-hidden">
          <div
            className="px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-elevated)' }}
          >
            <p className="text-sm font-semibold text-slate-200">Status History</p>
          </div>
          <div>
            {job.history.map((entry, idx) => {
              const isLast = idx === job.history.length - 1;
              const duration = entry.exitedAt
                ? Math.round(
                    (new Date(entry.exitedAt).getTime() -
                      new Date(entry.enteredAt).getTime()) /
                      60_000,
                  )
                : null;

              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 px-5 py-4"
                  style={
                    idx < job.history.length - 1
                      ? { borderBottom: '1px solid var(--border)' }
                      : undefined
                  }
                >
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        isLast
                          ? 'ring-2'
                          : 'bg-slate-600'
                      }`}
                      style={
                        isLast
                          ? { background: 'var(--primary)', boxShadow: '0 0 0 4px rgba(132,204,22,0.15)' }
                          : undefined
                      }
                    />
                    {!isLast && (
                      <div
                        className="w-px flex-1 my-1"
                        style={{ minHeight: '20px', background: 'var(--border)' }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge
                        label={getStatusLabel(entry.status)}
                        variant={getStatusColor(entry.status)}
                      />
                      {isLast && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: 'var(--primary)' }}
                        >
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(entry.enteredAt).toLocaleString('en-ZA', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {duration !== null && (
                        <span className="ml-1 text-slate-600">
                          · {duration < 60 ? `${duration}m` : `${Math.round(duration / 60)}h`} in stage
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Shell>
  );
}
