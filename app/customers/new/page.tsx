'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, PlusCircle } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { FieldLabel, PageHeader } from '@/components/ui';

type NewCustomerForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `cust-${Date.now()}`;
}

export default function NewCustomerPage() {
  const router = useRouter();
  const { addCustomer } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<NewCustomerForm>();

  const onSubmit = (formData: NewCustomerForm) => {
    addCustomer({
      id: createId(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
    });
    router.push('/customers');
  };

  return (
    <div className="animate-in">
      <PageHeader
        label="Customer management"
        title="New customer"
        subtitle="Add a new customer record for the workshop"
        actions={
          <Link href="/customers" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to customers
          </Link>
        }
      />

      <div className="card p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div>
            <FieldLabel required>Name</FieldLabel>
            <input {...register('name', { required: true })} className="input" placeholder="Customer name" />
            {errors.name && <p className="text-xs text-rose-300 mt-1">Name is required.</p>}
          </div>

          <div>
            <FieldLabel required>Phone</FieldLabel>
            <input {...register('phone', { required: true })} className="input" placeholder="Phone number" />
            {errors.phone && <p className="text-xs text-rose-300 mt-1">Phone is required.</p>}
          </div>

          <div>
            <FieldLabel required>Email</FieldLabel>
            <input {...register('email', { required: true })} className="input" placeholder="Email address" />
            {errors.email && <p className="text-xs text-rose-300 mt-1">Email is required.</p>}
          </div>

          <div>
            <FieldLabel required>Address</FieldLabel>
            <input {...register('address', { required: true })} className="input" placeholder="Customer address" />
            {errors.address && <p className="text-xs text-rose-300 mt-1">Address is required.</p>}
          </div>

          <div>
            <FieldLabel>Notes</FieldLabel>
            <textarea {...register('notes')} className="input" rows={4} placeholder="Optional account notes" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/customers" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              Add customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
