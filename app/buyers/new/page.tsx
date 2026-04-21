'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Mail, MapPin, Phone, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Shell } from '../../../components/Shell';
import { useAppData } from '../../../components/AppDataProvider';
import type { NewBuyerInput } from '../../../components/AppDataProvider';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  branchId: string;
  type: 'Trade' | 'Retail' | 'Dealer';
};

export default function NewBuyerPage() {
  const router = useRouter();
  const { branches, addBuyer, activeBranch } = useAppData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', email: '', phone: '', branchId: activeBranch, type: 'Retail' },
  });

  const onSubmit = (values: FormValues) => {
    const payload: NewBuyerInput = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      branchId: values.branchId,
      type: values.type,
    };
    addBuyer(payload);
    router.push('/buyers');
  };

  return (
    <Shell>
      <div className="page-header">
        <div>
          <p className="section-label">Buyers</p>
          <h1 className="page-title mt-1">New Buyer</h1>
          <p className="page-subtitle">Capture buyer details and assign to a branch.</p>
        </div>
        <Link href="/buyers" className="btn-secondary gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="max-w-xl">
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                Full name / Business name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('name', { required: true })}
                  placeholder="e.g. Sizwe Nkosi Auto"
                  className={`input pl-10 ${errors.name ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-500">Name is required</p>}
            </div>

            {/* Email + Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    placeholder="buyer@example.com"
                    className={`input pl-10 ${errors.email ? 'border-rose-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500">Valid email required</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                  Phone <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    {...register('phone', { required: true })}
                    placeholder="e.g. +27 82 555 0100"
                    className={`input pl-10 ${errors.phone ? 'border-rose-500' : ''}`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-rose-500">Phone is required</p>}
              </div>
            </div>

            {/* Branch + Type */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                  Branch <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <select
                    {...register('branchId', { required: true })}
                    className={`select pl-10 ${errors.branchId ? 'border-rose-500' : ''}`}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                {errors.branchId && <p className="mt-1 text-xs text-rose-500">Branch is required</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                  Buyer type <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('type', { required: true })}
                  className={`select ${errors.type ? 'border-rose-500' : ''}`}
                >
                  <option value="Retail">Retail</option>
                  <option value="Trade">Trade</option>
                  <option value="Dealer">Dealer</option>
                </select>
                {errors.type && <p className="mt-1 text-xs text-rose-500">Type is required</p>}
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary w-full py-3">
                <UserPlus className="h-4 w-4" />
                Save buyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
