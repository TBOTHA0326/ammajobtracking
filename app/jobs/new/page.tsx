'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Car, ClipboardList } from 'lucide-react';
import { Shell } from '../../../components/Shell';
import { useAppData } from '../../../components/AppDataProvider';
import type { StripJob } from '../../../lib/sample-data';

type FormValues = {
  // Donor vehicle
  rego: string;
  make: string;
  model: string;
  year: number;
  variant: string;
  engine: string;
  odometer: number;
  vin: string;
  condition: StripJob['donorVehicle']['condition'];
  acquisitionSource: string;
  acquisitionCost: number;
  // Job details
  category: StripJob['category'];
  dismantlerId: string;
  acquiredDate: string;
  estimatedCompletionDate: string;
  description: string;
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-300">
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-rose-400">{message}</p>;
}

const today = new Date().toISOString().split('T')[0];

export default function NewStripJobPage() {
  const router = useRouter();
  const { dismantlers, activeBranch, addJob } = useAppData();

  const branchDismantlers = dismantlers.filter((d) => d.branchId === activeBranch);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      rego: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      variant: '',
      engine: '',
      odometer: 0,
      vin: '',
      condition: 'accident-damaged',
      acquisitionSource: '',
      acquisitionCost: 0,
      category: 'Full Strip',
      dismantlerId: '',
      acquiredDate: today,
      estimatedCompletionDate: today,
      description: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    addJob({
      donorVehicle: {
        rego: values.rego.toUpperCase(),
        make: values.make,
        model: values.model,
        year: Number(values.year),
        variant: values.variant,
        engine: values.engine,
        odometer: Number(values.odometer),
        vin: values.vin || undefined,
        condition: values.condition,
        acquisitionSource: values.acquisitionSource,
        acquisitionCost: Number(values.acquisitionCost),
      },
      dismantlerId: values.dismantlerId,
      status: 'assessment',
      category: values.category,
      acquiredDate: values.acquiredDate,
      estimatedCompletionDate: values.estimatedCompletionDate,
      description: values.description,
      branchId: activeBranch,
    });
    router.push('/jobs');
  };

  return (
    <Shell>
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="section-label">Strip Jobs</p>
          <h1 className="page-title mt-1">New Strip Job</h1>
          <p className="page-subtitle">
            Capture the donor vehicle and job details to create a new strip job.
          </p>
        </div>
        <Link href="/jobs" className="btn-secondary gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-5 lg:grid-cols-2">

          {/* ── LEFT: Donor Vehicle ── */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1 pb-3 border-b border-white/[0.08]">
              <Car className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-semibold text-slate-200">Donor Vehicle</p>
            </div>

            {/* Registration */}
            <div>
              <FieldLabel required>Registration</FieldLabel>
              <input
                {...register('rego', { required: 'Registration is required' })}
                placeholder="e.g. GP 512 RZ"
                className={`input uppercase ${errors.rego ? 'border-rose-500 focus:border-rose-500' : ''}`}
              />
              <FieldError message={errors.rego?.message} />
            </div>

            {/* Make + Model */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Make</FieldLabel>
                <input
                  {...register('make', { required: 'Make is required' })}
                  placeholder="e.g. Toyota"
                  className={`input ${errors.make ? 'border-rose-500' : ''}`}
                />
                <FieldError message={errors.make?.message} />
              </div>
              <div>
                <FieldLabel required>Model</FieldLabel>
                <input
                  {...register('model', { required: 'Model is required' })}
                  placeholder="e.g. Hilux"
                  className={`input ${errors.model ? 'border-rose-500' : ''}`}
                />
                <FieldError message={errors.model?.message} />
              </div>
            </div>

            {/* Year */}
            <div>
              <FieldLabel required>Year</FieldLabel>
              <input
                type="number"
                {...register('year', {
                  required: 'Year is required',
                  min: { value: 1990, message: 'Year must be 1990 or later' },
                  max: { value: 2030, message: 'Year must be 2030 or earlier' },
                })}
                min={1990}
                max={2030}
                className={`input ${errors.year ? 'border-rose-500' : ''}`}
              />
              <FieldError message={errors.year?.message} />
            </div>

            {/* Variant + Engine */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Variant</FieldLabel>
                <input
                  {...register('variant')}
                  placeholder="e.g. 2.8 GD-6 Raider 4x4"
                  className="input"
                />
              </div>
              <div>
                <FieldLabel>Engine</FieldLabel>
                <input
                  {...register('engine')}
                  placeholder="e.g. 2.8 GD-6"
                  className="input"
                />
              </div>
            </div>

            {/* Odometer + VIN */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Odometer (km)</FieldLabel>
                <input
                  type="number"
                  {...register('odometer', { min: 0 })}
                  min={0}
                  className="input"
                />
              </div>
              <div>
                <FieldLabel>VIN</FieldLabel>
                <input
                  {...register('vin')}
                  placeholder="Optional"
                  className="input"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <FieldLabel required>Condition</FieldLabel>
              <select
                {...register('condition', { required: 'Condition is required' })}
                className="select"
              >
                <option value="accident-damaged">Accident Damaged</option>
                <option value="written-off">Written Off</option>
                <option value="2nd-hand">2nd Hand</option>
                <option value="flood-damaged">Flood Damaged</option>
              </select>
              <FieldError message={errors.condition?.message} />
            </div>

            {/* Acquisition Source */}
            <div>
              <FieldLabel required>Acquisition Source</FieldLabel>
              <input
                {...register('acquisitionSource', {
                  required: 'Acquisition source is required',
                })}
                placeholder="e.g. Insurance auction — MIB, Private seller"
                className={`input ${errors.acquisitionSource ? 'border-rose-500' : ''}`}
              />
              <FieldError message={errors.acquisitionSource?.message} />
            </div>

            {/* Acquisition Cost */}
            <div>
              <FieldLabel required>Acquisition Cost (R)</FieldLabel>
              <input
                type="number"
                {...register('acquisitionCost', {
                  required: 'Acquisition cost is required',
                  min: { value: 0, message: 'Cost cannot be negative' },
                })}
                min={0}
                placeholder="e.g. 28000"
                className={`input ${errors.acquisitionCost ? 'border-rose-500' : ''}`}
              />
              <FieldError message={errors.acquisitionCost?.message} />
            </div>
          </div>

          {/* ── RIGHT: Job Details ── */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1 pb-3 border-b border-white/[0.08]">
              <ClipboardList className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-semibold text-slate-200">Job Details</p>
            </div>

            {/* Category */}
            <div>
              <FieldLabel required>Category</FieldLabel>
              <select
                {...register('category', { required: 'Category is required' })}
                className="select"
              >
                <option value="Full Strip">Full Strip</option>
                <option value="Partial Strip">Partial Strip</option>
                <option value="Parts Only">Parts Only</option>
                <option value="Write-off Assessment">Write-off Assessment</option>
              </select>
              <FieldError message={errors.category?.message} />
            </div>

            {/* Dismantler */}
            <div>
              <FieldLabel>Dismantler</FieldLabel>
              <select {...register('dismantlerId')} className="select">
                <option value="">— Unassigned —</option>
                {branchDismantlers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Acquired Date */}
            <div>
              <FieldLabel required>Acquired Date</FieldLabel>
              <input
                type="date"
                {...register('acquiredDate', { required: 'Acquired date is required' })}
                className={`input ${errors.acquiredDate ? 'border-rose-500' : ''}`}
              />
              <FieldError message={errors.acquiredDate?.message} />
            </div>

            {/* Estimated Completion */}
            <div>
              <FieldLabel required>Estimated Completion Date</FieldLabel>
              <input
                type="date"
                {...register('estimatedCompletionDate', {
                  required: 'Estimated completion date is required',
                })}
                className={`input ${errors.estimatedCompletionDate ? 'border-rose-500' : ''}`}
              />
              <FieldError message={errors.estimatedCompletionDate?.message} />
            </div>

            {/* Description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Describe the vehicle condition, known issues, parts of interest…"
                className="input resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3"
              >
                Create Strip Job
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Job will be created at <strong className="text-slate-400">Assessment</strong> status
                for the active branch.
              </p>
            </div>
          </div>

        </div>
      </form>
    </Shell>
  );
}
