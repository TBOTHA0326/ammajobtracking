'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { branches, customers, vehicles, technicians, parts, suppliers, jobs as initialJobs } from '@/lib/mock-data';
import type { Job, Customer, Vehicle, Part, Technician, Supplier } from '@/lib/types';

type AppContextValue = {
  branches: typeof branches;
  activeBranch: string;
  setActiveBranch: (id: string) => void;
  customers: Customer[];
  vehicles: Vehicle[];
  technicians: Technician[];
  parts: Part[];
  suppliers: typeof suppliers;
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addCustomer: (c: Customer) => void;
  addVehicle: (v: Vehicle) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeBranch, setActiveBranch] = useState(branches[0].id);
  const [jobList, setJobList] = useState<Job[]>(initialJobs);
  const [customerList, setCustomerList] = useState<Customer[]>(customers);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(vehicles);

  const addJob = (job: Job) => setJobList(prev => [job, ...prev]);
  const updateJob = (id: string, patch: Partial<Job>) =>
    setJobList(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j));
  const deleteJob = (id: string) => setJobList(prev => prev.filter(j => j.id !== id));
  const addCustomer = (c: Customer) => setCustomerList(prev => [c, ...prev]);
  const addVehicle = (v: Vehicle) => setVehicleList(prev => [v, ...prev]);

  return (
    <AppContext.Provider value={{
      branches, activeBranch, setActiveBranch,
      customers: customerList, vehicles: vehicleList,
      technicians, parts, suppliers,
      jobs: jobList, addJob, updateJob, deleteJob,
      addCustomer, addVehicle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
