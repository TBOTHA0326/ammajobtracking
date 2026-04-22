'use client';

import { useApp } from '@/components/app-provider';
import { PageHeader, FieldLabel } from '@/components/ui';

export default function SettingsPage() {
  const { branches, activeBranch, setActiveBranch } = useApp();

  return (
    <div className="animate-in">
      <PageHeader
        label="Configuration"
        title="Settings"
        subtitle="Manage branch selection and system defaults"
      />

      <div className="grid gap-4 max-w-3xl">
        <div className="card p-6">
          <p className="section-label">Active branch</p>
          <div className="mt-3">
            <FieldLabel>Branch</FieldLabel>
            <select
              value={activeBranch}
              onChange={(event) => setActiveBranch(event.target.value)}
              className="input"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            The active branch determines the workspace context shown in the sidebar and across reports.
          </p>
        </div>

        <div className="card p-6">
          <p className="section-label">System settings</p>
          <div className="mt-4 space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p>
              The current demo uses local state for data management. In a production build,
              this would connect to Supabase with role-based access and secure row-level policies.
            </p>
            <p>
              Theme options, user accounts, and notification preferences would be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
