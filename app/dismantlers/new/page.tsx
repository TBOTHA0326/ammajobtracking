'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, MapPin, UserPlus, Wrench } from 'lucide-react';
import Link from 'next/link';
import { Shell } from '../../../components/Shell';
import { useAppData } from '../../../components/AppDataProvider';
import type { NewDismantlerInput } from '../../../components/AppDataProvider';

type FormValues = {
  name: string;
  branchId: string;
};

export default function NewDismantlerPage() {
  const router = useRouter();
  const { branches, addDismantler, activeBranch } = useAppData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', branchId: activeBranch },
  });

  const onSubmit = (values: FormValues) => {
    const payload: NewDismantlerInput = {
      name: values.name,
      branchId: values.branchId,
    };
    addDismantler(payload);
    router.push('/dismantlers');
  };

  return (
    <Shell>
      <div className="page-header">
        <div>
          <p className="section-label">Dismantlers</p>
          <h1 className="page-title mt-1">New Dismantler</h1>
          <p className="page-subtitle">Register a dismantler and assign them to a branch.</p>
        </div>
        <Link href="/dismantlers" className="btn-secondary gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="max-w-md">
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">
                Dismantler name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Wrench className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('name', { required: true })}
                  placeholder="e.g. Luke Mbatha"
                  className={`input pl-10 ${errors.name ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-rose-500">Name is required</p>}
            </div>

            {/* Branch */}
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

            <div className="pt-2">
              <button type="submit" className="btn-primary w-full py-3">
                <UserPlus className="h-4 w-4" />
                Save dismantler
              </button>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
