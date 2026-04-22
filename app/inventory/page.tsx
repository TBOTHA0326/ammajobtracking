'use client';

import { useMemo, useState } from 'react';
import { Package } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { PageHeader, SearchInput, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/format';

export default function InventoryPage() {
  const { parts } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return parts.filter((part) =>
      [part.name, part.partNumber, part.category, part.supplier]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [parts, search]);

  return (
    <div className="animate-in">
      <PageHeader
        label="Inventory control"
        title="Parts inventory"
        subtitle={`${parts.length} inventory items`}
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search parts, suppliers or categories…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={40} />}
          title="No inventory matches"
          description="Refine your search or add new inventory from the supplier portal."
        />
      ) : (
        <div className="card table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th>Cost</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((part) => (
                <tr key={part.id}>
                  <td>
                    <div className="font-medium">{part.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{part.partNumber}</div>
                  </td>
                  <td>{part.stock}</td>
                  <td style={{ color: part.stock <= part.reorderLevel ? '#f97316' : 'var(--text-secondary)' }}>
                    {part.stock <= part.reorderLevel ? 'Reorder' : 'Okay'}
                  </td>
                  <td>{formatCurrency(part.sellingPrice)}</td>
                  <td>{part.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
