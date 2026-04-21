'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import { Shell } from '../../components/Shell';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppData } from '../../components/AppDataProvider';
import { getBranchName, getStatusColor, getStatusLabel } from '../../lib/sample-data';

export default function ArchivePage() {
  const { jobs, archiveJob } = useAppData();
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  const archivedJobs = useMemo(
    () => jobs.filter((job) => job.isArchived === true),
    [jobs],
  );

  return (
    <Shell>
      <div className="page-header">
        <div>
          <p className="section-label">Archive</p>
          <h1 className="page-title mt-1">Archived Strip Jobs</h1>
          <p className="page-subtitle">
            Soft-archived jobs across all branches. Restore to return a job to the active board.
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {archivedJobs.length === 0 ? (
          <div className="py-16 text-center">
            <Archive className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="mt-3 text-sm font-semibold text-slate-300">No archived jobs</p>
            <p className="mt-1 text-xs text-slate-500">
              Archived strip jobs will appear here.
            </p>
            <Link href="/jobs" className="btn-secondary mt-6 inline-flex text-sm">
              Back to strip jobs
            </Link>
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job No</th>
                  <th>Donor Vehicle</th>
                  <th>Branch</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {archivedJobs.map((job) => {
                  const isConfirming = confirmRestoreId === job.id;
                  return (
                    <tr key={job.id}>
                      <td>
                        <span className="mono font-semibold text-slate-200">{job.number}</span>
                      </td>
                      <td>
                        <p className="font-medium text-slate-200">
                          {job.donorVehicle.rego}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {job.donorVehicle.year} {job.donorVehicle.make} {job.donorVehicle.model}
                        </p>
                      </td>
                      <td className="text-slate-400">{getBranchName(job.branchId)}</td>
                      <td className="text-slate-400 text-xs">{job.category}</td>
                      <td>
                        <StatusBadge
                          label={getStatusLabel(job.status)}
                          variant={getStatusColor(job.status)}
                        />
                      </td>
                      <td>
                        {isConfirming ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">Restore this job?</span>
                            <button
                              onClick={() => {
                                archiveJob(job.id, false);
                                setConfirmRestoreId(null);
                              }}
                              className="btn-primary py-1 px-2.5 text-xs gap-1.5"
                            >
                              <ArchiveRestore className="h-3.5 w-3.5" />
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmRestoreId(null)}
                              className="btn-ghost py-1 px-2.5 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmRestoreId(job.id)}
                            className="btn-ghost text-xs gap-1.5"
                          >
                            <ArchiveRestore className="h-3.5 w-3.5" />
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
              className="px-4 py-2.5 text-xs text-slate-500"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {archivedJobs.length} archived job{archivedJobs.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
