export type Branch = {
  id: string;
  name: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

export type Vehicle = {
  id: string;
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

export type Technician = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  skills: string[];
  isActive: boolean;
};

export type Part = {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  type: 'New' | 'Used' | 'Genuine' | 'Economy';
  stock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  notes: string;
  reorderLevel: number;
};

export type Supplier = {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

export type JobStatus = 'pending' | 'in-progress' | 'waiting-parts' | 'completed' | 'cancelled';
export type JobPriority = 'low' | 'medium' | 'high';

export type JobPart = {
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
};

export type Job = {
  id: string;
  customerId: string;
  vehicleId: string;
  title: string;
  description: string;
  status: JobStatus;
  priority: JobPriority;
  assignedTechnicianIds: string[];
  estimatedCost: number;
  finalCost: number | null;
  startDate: string;
  dueDate: string;
  completedAt: string | null;
  parts: JobPart[];
  notes: string;
};
