'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Briefcase, MapPin, Pencil, Plus, Trash2, Wrench, X, Check } from 'lucide-react';
import { Shell } from '../../components/Shell';
import { useAppData } from '../../components/AppDataProvider';
import { getBranchName, statuses } from '../../lib/sample-data';

const terminalStatuses = new Set(statuses.filter((s) => s.isTerminal).map((s) => s.id));

export default function DismantlersPage() {
  const { dismantlers, jobs, branches, updateDismantler, deleteDismantler } = useAppData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBranchId, setEditBranchId] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const dismantlerRows = useMemo(
    () =>
      dismantlers.map((d) => {
        const activeJobs = jobs.filter(
          (job) =>
            job.dismantlerId === d.id &&
            !job.isArchived &&
            !terminalStatuses.has(job.status),
        ).length;
        return { dismantler: d, activeJobs };
      }),
    [dismantlers, jobs],
  );

  const startEdit = (id: string, name: string, branchId: string) => {
    setEditingId(id);
    setEditName(name);
    setEditBranchId(branchId);
    setConfirmDeleteId(null);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      updateDismantler(id, { name: editName.trim(), branchId: editBranchId });
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <Shell>
      <div className="page-header">
        <div>
          <p className="section-label">Dismantlers</p>
          <h1 className="page-title mt-1">Dismantler Directory</h1>
          <p className="page-subtitle">{dismantlers.length} dismantlers</p>
        </div>
        <Link href="/dismantlers/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Dismantler
        </Link>
      </div>

      {dismantlerRows.length === 0 ? (
        <div className="card py-16 text-center">
          <Wrench className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="mt-3 text-sm font-semibold text-slate-300">No dismantlers added yet</p>
          <Link href="/dismantlers/new" className="btn-primary mt-6 inline-flex">
            Add first dismantler
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Branch</th>
                <th>Active Jobs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dismantlerRows.map(({ dismantler, activeJobs }) => {
                const isEditing = editingId === dismantler.id;
                const isConfirmingDelete = confirmDeleteId === dismantler.id;

                if (isEditing) {
                  return (
                    <tr key={dismantler.id}>
                      <td>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input py-1.5 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(dismantler.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                      </td>
                      <td>
                        <select
                          value={editBranchId}
                          onChange={(e) => setEditBranchId(e.target.value)}
                          className="select py-1.5 text-sm"
                        >
                          {branches.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </td>
                      <td />
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(dismantler.id)}
                            className="btn-primary py-1.5 px-3 text-xs gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="btn-ghost py-1.5 px-3 text-xs gap-1.5"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={dismantler.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        >
                          <Wrench className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <span className="font-semibold text-slate-200">{dismantler.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-slate-600" />
                        {getBranchName(dismantler.branchId)}
                      </div>
                    </td>
                    <td>
                      {activeJobs > 0 ? (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                          style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}
                        >
                          <Briefcase className="h-3 w-3" />
                          {activeJobs}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td>
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">Remove {dismantler.name}?</span>
                          <button
                            onClick={() => {
                              deleteDismantler(dismantler.id);
                              setConfirmDeleteId(null);
                            }}
                            className="btn-danger py-1 px-2.5 text-xs"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn-ghost py-1 px-2.5 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            title="Edit dismantler"
                            onClick={() =>
                              startEdit(dismantler.id, dismantler.name, dismantler.branchId)
                            }
                            className="btn-ghost py-1.5 px-2.5 text-xs gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Delete dismantler"
                            onClick={() => setConfirmDeleteId(dismantler.id)}
                            className="btn-ghost py-1.5 px-2.5 text-xs gap-1.5 hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
