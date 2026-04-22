'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, PlusCircle } from '@phosphor-icons/react';
import { useApp } from '@/components/app-provider';
import { FieldLabel, PageHeader } from '@/components/ui';
import type { JobPriority, JobStatus } from '@/lib/types';

type NewJobForm = {
  title: string;
  description: string;
  customerId: string;
  vehicleId: string;
  status: JobStatus;
  priority: JobPriority;
  technicianId: string;
  estimatedCost: number;
  startDate: string;
  dueDate: string;
  notes: string;
};

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'waiting-parts', label: 'Waiting for Parts' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS: { value: JobPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `job-${Date.now()}`;
}

export default function NewJobPage() {
  const router = useRouter();
  const { customers, vehicles, technicians, addJob } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<NewJobForm>({
    defaultValues: {
      title: '',
      description: '',
      customerId: customers[0]?.id ?? '',
      vehicleId: vehicles[0]?.id ?? '',
      status: 'pending',
      priority: 'medium',
      technicianId: technicians[0]?.id ?? '',
      estimatedCost: 0,
      startDate: today,
      dueDate: tomorrow,
      notes: '',
    },
  });

  const selectedCustomerId = watch('customerId');
  const filteredVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.customerId === selectedCustomerId),
    [vehicles, selectedCustomerId]
  );

  const onSubmit = (formData: NewJobForm) => {
    const newJob = {
      id: createId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      customerId: formData.customerId,
      vehicleId: formData.vehicleId,
      status: formData.status,
      priority: formData.priority,
      assignedTechnicianIds: formData.technicianId ? [formData.technicianId] : [],
      estimatedCost: Number(formData.estimatedCost),
      finalCost: null,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      completedAt: null,
      parts: [],
      notes: formData.notes.trim(),
    };
    addJob(newJob);
    router.push('/jobs');
  };

  return (
    <div className="animate-in">
      <PageHeader
        label="Workshop"
        title="New Job"
        subtitle="Create a new service order for the workshop"
        actions={
          <Link href="/jobs" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back to jobs
          </Link>
        }
      />

      <div className="card p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div>
            <FieldLabel required>Job title</FieldLabel>
            <input
              {...register('title', { required: true })}
              className="input"
              placeholder="e.g. Rear diff service and clutch review"
            />
            {errors.title && <p className="text-xs text-rose-300 mt-1">Title is required.</p>}
          </div>

          <div>
            <FieldLabel required>Customer</FieldLabel>
            <select {...register('customerId', { required: true })} className="input">
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel required>Vehicle</FieldLabel>
            <select {...register('vehicleId', { required: true })} className="input">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} • {vehicle.registration}
                  </option>
                ))
              ) : (
                <option value="">No vehicle found for this customer</option>
              )}
            </select>
          </div>

          <div>
            <FieldLabel required>Description</FieldLabel>
            <textarea
              {...register('description', { required: true })}
              className="input"
              rows={4}
              placeholder="Describe the work required and any notes for the technician"
            />
            {errors.description && <p className="text-xs text-rose-300 mt-1">Description is required.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Status</FieldLabel>
              <select {...register('status')} className="input">
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel required>Priority</FieldLabel>
              <select {...register('priority')} className="input">
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Assigned technician</FieldLabel>
              <select {...register('technicianId')} className="input">
                <option value="">Unassigned</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Estimated cost (ZAR)</FieldLabel>
              <input
                {...register('estimatedCost', { valueAsNumber: true })}
                className="input"
                type="number"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Start date</FieldLabel>
              <input {...register('startDate')} type="date" className="input" />
            </div>
            <div>
              <FieldLabel>Due date</FieldLabel>
              <input {...register('dueDate')} type="date" className="input" />
            </div>
          </div>

          <div>
            <FieldLabel>Job notes</FieldLabel>
            <textarea
              {...register('notes')}
              className="input"
              rows={3}
              placeholder="Additional notes, part requirements, customer requests"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              Create job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
