'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, PlusCircle } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { FieldLabel, PageHeader } from '@/components/ui';

type NewVehicleForm = {
  customerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  registration: string;
  mileage: number;
  color: string;
  notes: string;
};

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `veh-${Date.now()}`;
}

export default function NewVehiclePage() {
  const router = useRouter();
  const { customers, addVehicle } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<NewVehicleForm>({
    defaultValues: {
      customerId: customers[0]?.id ?? '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      registration: '',
      mileage: 0,
      color: '',
      notes: '',
    },
  });

  const onSubmit = (formData: NewVehicleForm) => {
    addVehicle({
      id: createId(),
      customerId: formData.customerId,
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: Number(formData.year),
      vin: formData.vin.trim(),
      registration: formData.registration.trim(),
      mileage: Number(formData.mileage),
      color: formData.color.trim(),
      notes: formData.notes.trim(),
    });
    router.push('/vehicles');
  };

  return (
    <div className="animate-in">
      <PageHeader
        label="Vehicle fleet"
        title="Add vehicle"
        subtitle="Register a new vehicle to the system"
        actions={
          <Link href="/vehicles" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to vehicles
          </Link>
        }
      />

      <div className="card p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div>
            <FieldLabel required>Owner</FieldLabel>
            <select {...register('customerId', { required: true })} className="input">
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && <p className="text-xs text-rose-300 mt-1">Owner is required.</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Make</FieldLabel>
              <input {...register('make', { required: true })} className="input" placeholder="Volkswagen" />
              {errors.make && <p className="text-xs text-rose-300 mt-1">Make is required.</p>}
            </div>
            <div>
              <FieldLabel required>Model</FieldLabel>
              <input {...register('model', { required: true })} className="input" placeholder="Amarok" />
              {errors.model && <p className="text-xs text-rose-300 mt-1">Model is required.</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <FieldLabel required>Year</FieldLabel>
              <input {...register('year', { valueAsNumber: true })} className="input" type="number" min={1990} />
            </div>
            <div>
              <FieldLabel required>VIN</FieldLabel>
              <input {...register('vin', { required: true })} className="input" placeholder="Vehicle identification number" />
            </div>
            <div>
              <FieldLabel required>Registration</FieldLabel>
              <input {...register('registration', { required: true })} className="input" placeholder="GP 00 AB CD" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Mileage</FieldLabel>
              <input {...register('mileage', { valueAsNumber: true })} className="input" type="number" min={0} />
            </div>
            <div>
              <FieldLabel>Color</FieldLabel>
              <input {...register('color')} className="input" placeholder="Color" />
            </div>
          </div>

          <div>
            <FieldLabel>Notes</FieldLabel>
            <textarea {...register('notes')} className="input" rows={4} placeholder="Optional vehicle notes" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/vehicles" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              Add vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
