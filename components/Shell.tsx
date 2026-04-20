'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Archive, BarChart2, Car, LayoutDashboard, MapPin, Scissors, Users, Wrench } from 'lucide-react';
import { useAppData } from './AppDataProvider';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Strip Jobs', icon: Car },
  { href: '/buyers', label: 'Buyers', icon: Users },
  { href: '/dismantlers', label: 'Dismantlers', icon: Wrench },
  { href: '/archive', label: 'Archive', icon: Archive },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { branches, activeBranch, setActiveBranch } = useAppData();
  const pathname = usePathname();

  const activeBranchName = branches.find((b) => b.id === activeBranch)?.name ?? activeBranch;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Mobile header ─────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Scissors className="h-3.5 w-3.5 text-slate-900" />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Amma Strip Tracker
          </span>
        </div>
        {/* Branch pill — mobile */}
        <div className="relative">
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            aria-label="Select branch"
            className="appearance-none rounded-lg py-1.5 pl-7 pr-7 text-xs font-semibold outline-none"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <MapPin className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
      </header>

      <div className="lg:flex lg:min-h-[calc(100dvh)]">
        {/* ── Sidebar ───────────────────────────────────── */}
        <aside
          className="hidden lg:flex lg:w-60 lg:flex-col"
          style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Logo */}
          <div
            className="flex h-14 items-center gap-3 px-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary flex-shrink-0">
              <Scissors className="h-3.5 w-3.5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">Amma Spares</p>
              <p className="text-2xs text-slate-500 mt-0.5">Strip Tracker</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6 px-3 py-4 overflow-y-auto">
            {/* Branch switcher */}
            <div>
              <p className="section-label px-2 mb-2">Branch</p>
              <div className="space-y-0.5">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBranch(b.id)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all text-left ${
                      activeBranch === b.id
                        ? 'font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    style={
                      activeBranch === b.id
                        ? { background: 'rgba(132,204,22,0.10)', color: '#84cc16' }
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      if (activeBranch !== b.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeBranch !== b.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = '';
                      }
                    }}
                  >
                    <MapPin
                      className="h-3.5 w-3.5 flex-shrink-0"
                      style={{ color: activeBranch === b.id ? '#84cc16' : '#475569' }}
                    />
                    <span className="truncate">{b.name}</span>
                    {activeBranch === b.id && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <nav>
              <p className="section-label px-2 mb-2">Navigation</p>
              <div className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all"
                      style={
                        isActive
                          ? {
                              background: 'rgba(255,255,255,0.08)',
                              color: '#ffffff',
                              boxShadow: 'inset 3px 0 0 #84cc16',
                              paddingLeft: '13px',
                            }
                          : { color: '#94a3b8' }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.background = 'rgba(255,255,255,0.05)';
                          el.style.color = '#e2e8f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.background = '';
                          el.style.color = '#94a3b8';
                        }
                      }}
                    >
                      <Icon
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: isActive ? '#84cc16' : undefined }}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Footer */}
          <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-300 truncate">{activeBranchName}</p>
                <p className="text-2xs text-slate-500">Active branch</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 py-5 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-7xl animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
