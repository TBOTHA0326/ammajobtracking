'use client';

import { useMemo, useState } from 'react';
import { Buildings } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { PageHeader, SearchInput, EmptyState } from '@/components/ui';

export default function SuppliersPage() {
  const { suppliers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return suppliers.filter((supplier) =>
      [supplier.name, supplier.contactName, supplier.phone, supplier.email, supplier.address]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [search, suppliers]);

  return (
    <div className="animate-in">
      <PageHeader
        label="Supplier network"
        title="Suppliers"
        subtitle={`${suppliers.length} supplier contacts`}
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search suppliers…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Buildings size={40} />}
          title="No suppliers found"
          description="Search for a supplier by name, contact, or location."
        />
      ) : (
        <div className="card table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contactName}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
