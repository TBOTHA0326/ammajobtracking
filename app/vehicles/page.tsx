'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Car } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { PageHeader, SearchInput, EmptyState } from '@/components/ui';

export default function VehiclesPage() {
  const { vehicles, customers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return vehicles.filter((vehicle) => {
      const customer = customers.find((c) => c.id === vehicle.customerId);
      return [
        vehicle.make,
        vehicle.model,
        vehicle.registration,
        vehicle.vin,
        customer?.name ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [search, vehicles, customers]);

  return (
    <div className="animate-in">
      <PageHeader
        label="Vehicle fleet"
        title="Vehicles"
        subtitle={`${vehicles.length} linked vehicles`}
        actions={
          <Link href="/vehicles/new" className="btn btn-primary">
            <Plus size={16} weight="bold" />
            Add vehicle
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search vehicles…" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Car size={40} />}
          title="No vehicles found"
          description="Adjust your search or add a new vehicle record."
          action={
            <Link href="/vehicles/new" className="btn btn-primary">
              Add vehicle
            </Link>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Owner</th>
                <th>Reg.</th>
                <th>VIN</th>
                <th>Mileage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle) => {
                const owner = customers.find((c) => c.id === vehicle.customerId);
                return (
                  <tr key={vehicle.id}>
                    <td>{vehicle.make} {vehicle.model} ({vehicle.year})</td>
                    <td>{owner?.name ?? 'Unknown'}</td>
                    <td>{vehicle.registration}</td>
                    <td>{vehicle.vin}</td>
                    <td>{vehicle.mileage.toLocaleString()} km</td>
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
