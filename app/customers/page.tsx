'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Users } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { PageHeader, SearchInput, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/format';

export default function CustomersPage() {
  const { customers, jobs } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    );
  }, [customers, search]);

  return (
    <div className="animate-in">
      <PageHeader
        label="Customer management"
        title="Customers"
        subtitle={`${customers.length} customer records`}
        actions={
          <Link href="/customers/new" className="btn btn-primary">
            <Plus size={16} weight="bold" />
            New customer
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search customers…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="No customers matched"
          description="Try a different search term or add a new customer record."
          action={
            <Link href="/customers/new" className="btn btn-primary">
              Add customer
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Location</th>
                <th>Jobs</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const jobsForCustomer = jobs.filter((job) => job.customerId === customer.id);
                return (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.address}</td>
                    <td>{jobsForCustomer.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
