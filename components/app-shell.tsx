'use client';
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wrench,
  SquaresFour,
  Users,
  Car,
  Package,
  Truck,
  ChartBar,
  Gear,
  List,
  X,
  MapPin,
} from '@phosphor-icons/react';
import { AppProvider, useApp } from '@/components/app-provider';

/* ── Nav items ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',  Icon: SquaresFour },
  { href: '/jobs',       label: 'Jobs',        Icon: Wrench       },
  { href: '/customers',  label: 'Customers',   Icon: Users        },
  { href: '/vehicles',   label: 'Vehicles',    Icon: Car          },
  { href: '/inventory',  label: 'Inventory',   Icon: Package      },
  { href: '/suppliers',  label: 'Suppliers',   Icon: Truck        },
  { href: '/reports',    label: 'Reports',     Icon: ChartBar     },
  { href: '/settings',   label: 'Settings',    Icon: Gear         },
] as const;

/* ── Styles ─────────────────────────────────────────────────────────────── */
const SIDEBAR_BG = '#ffffff';

const activeNavStyle: React.CSSProperties = {
  background: 'rgba(249,115,22,0.12)',
  color: '#0f172a',
  boxShadow: 'inset 3px 0 0 #f97316',
  paddingLeft: '13px',
};

const inactiveNavStyle: React.CSSProperties = {
  color: '#64748b',
  paddingLeft: '16px',
};

const activeBranchStyle: React.CSSProperties = {
  background: 'rgba(249,115,22,0.12)',
  color: '#f97316',
};

const inactiveBranchStyle: React.CSSProperties = {
  color: '#64748b',
};

/* ── Inner shell (uses context) ─────────────────────────────────────────── */
function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { branches, activeBranch, setActiveBranch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeBranchName = branches.find(b => b.id === activeBranch)?.name ?? 'Unknown';

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  /* ── Sidebar content (shared between desktop and mobile drawer) ── */
  const SidebarContent = () => (
    <div
      style={{
        background: SIDEBAR_BG,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Wrench size={18} weight="bold" color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#e2e8f0',
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}
            >
              Amma Spares
            </div>
            <div
              style={{
                fontSize: '10px',
                color: '#4b5563',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: '2px',
              }}
            >
              Job Tracker
            </div>
          </div>
        </div>
      </div>

      {/* Branch selector */}
      <div style={{ padding: '16px 12px 12px' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#374151',
            marginBottom: '8px',
            paddingLeft: '8px',
          }}
        >
          Branch
        </div>
        <select
          value={activeBranch}
          onChange={(e) => setActiveBranch(e.target.value)}
          className="select input"
          style={{ width: '100%', fontSize: '0.875rem' }}
        >
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          margin: '4px 12px',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      />

      {/* Navigation */}
      <nav style={{ padding: '8px 12px', flex: 1 }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#374151',
            marginBottom: '8px',
            paddingLeft: '4px',
          }}
        >
          Navigation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  fontWeight: active ? 600 : 400,
                  transition: 'background 120ms ease, color 120ms ease',
                  ...(active ? activeNavStyle : inactiveNavStyle),
                }}
                onMouseEnter={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'rgba(255,255,255,0.04)';
                    el.style.color = '#94a3b8';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = 'transparent';
                    el.style.color = '#64748b';
                  }
                }}
              >
                <Icon size={17} weight={active ? 'fill' : 'regular'} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(15,23,42,0.08)',
          fontSize: '11px',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <MapPin size={12} weight="fill" style={{ color: '#f97316', flexShrink: 0 }} />
        <span style={{ color: '#4b5563' }}>{activeBranchName}</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          display: 'none',
        }}
        className="md-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(2px)',
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: 'relative',
              width: '260px',
              zIndex: 51,
              flexShrink: 0,
            }}
          >
            <SidebarContent />
          </div>
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 52,
              background: 'rgba(15,23,42,0.06)',
              border: '1px solid rgba(15,23,42,0.12)',
              borderRadius: '8px',
              color: '#0f172a',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Mobile top bar ── */}
      <header
        className="mobile-topbar"
        style={{
          display: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          height: '56px',
          background: SIDEBAR_BG,
          borderBottom: '1px solid rgba(15,23,42,0.08)',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <List size={22} />
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Wrench size={14} weight="bold" color="#fff" />
          </div>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.01em',
            }}
          >
            Amma Spares
          </span>
        </div>

        {/* Branch select */}
        <select
          value={activeBranch}
          onChange={e => setActiveBranch(e.target.value)}
          className="select input"
          style={{
            width: 'auto',
            fontSize: '12px',
            padding: '4px 28px 4px 8px',
            maxWidth: '140px',
          }}
        >
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </header>

      {/* ── Main content area ── */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: '32px 32px',
        }}
        className="main-content"
      >
        {children}
      </main>

      {/* Responsive styles injected via a style tag */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar { display: block !important; }
          .mobile-topbar { display: none !important; }
          .main-content { margin-left: 260px; }
        }
        @media (max-width: 767px) {
          .md-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .main-content { margin-left: 0; padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Public export wraps with AppProvider ───────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <ShellInner>{children}</ShellInner>
    </AppProvider>
  );
}
