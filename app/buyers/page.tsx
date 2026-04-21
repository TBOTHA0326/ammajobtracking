'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Mail, Phone, Plus, Search, User } from 'lucide-react';
import { Shell } from '../../components/Shell';
import { useAppData } from '../../components/AppDataProvider';
import { getBranchName } from '../../lib/sample-data';

function typeBadge(type: 'Trade' | 'Retail' | 'Dealer') {
  if (type === 'Trade')
    return <span className="badge bg-blue-900/40 text-blue-300">{type}</span>;
  if (type === 'Dealer')
    return <span className="badge bg-amber-900/40 text-amber-300">{type}</span>;
  return <span className="badge bg-slate-700/40 text-slate-300">{type}</span>;
}

export default function BuyersPage() {
  const { buyers, jobs } = useAppData();
  const [query, setQuery] = useState('');

  const buyerRows = useMemo(
    () =>
      buyers
        .map((buyer) => {
          const purchaseCount = jobs.reduce(
            (acc, job) =>
              acc + job.harvestedParts.filter((p) => p.buyerId === buyer.id).length,
            0,
          );
          return { buyer, purchaseCount, branchName: getBranchName(buyer.branchId) };
        })
        .filter(({ buyer }) => {
          if (!query) return true;
          const q = query.toLowerCase();
          return (
            buyer.name.toLowerCase().includes(q) ||
            buyer.email.toLowerCase().includes(q)
          );
        }),
    [buyers, jobs, query],
  );

  return (
    <Shell>
      <div className="page-header">
        <div>
          <p className="section-label">Buyers</p>
          <h1 className="page-title mt-1">Parts Buyers</h1>
          <p className="page-subtitle">{buyers.length} registered buyers</p>
        </div>
        <Link href="/buyers/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Buyer
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="input pl-9"
        />
      </div>

      {buyerRows.length === 0 ? (
        <div className="card py-16 text-center">
          <User className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="mt-3 text-sm font-semibold text-slate-300">No buyers found</p>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your search or add a new buyer.</p>
          <Link href="/buyers/new" className="btn-primary mt-6 inline-flex">Add first buyer</Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {buyerRows.map(({ buyer, purchaseCount, branchName }) => (
            <div key={buyer.id} className="card p-5 card-hover flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 text-sm font-bold text-slate-200"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    {buyer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 leading-tight">{buyer.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{branchName}</p>
                  </div>
                </div>
                {typeBadge(buyer.type)}
              </div>

              {/* Contact details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-600" />
                  <span className="truncate">{buyer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-600" />
                  <span>{buyer.phone}</span>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-3 text-xs text-slate-500"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span>{purchaseCount} purchase{purchaseCount !== 1 ? 's' : ''}</span>
                <Link
                  href={`/jobs?buyer=${buyer.id}`}
                  className="font-semibold text-[#84cc16] hover:text-[#65a30d] transition"
                >
                  View purchases →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
