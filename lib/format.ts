export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatRelativeDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 0) return `In ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}

export function formatPhoneNumber(phone: string): string {
  return phone;
}

export function getDaysOverdue(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - due.getTime()) / 86_400_000);
  return Math.max(0, diff);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'pending': 'bg-slate-700/40 text-slate-300',
    'in-progress': 'bg-blue-900/40 text-blue-300',
    'waiting-parts': 'bg-amber-900/40 text-amber-300',
    'completed': 'bg-emerald-900/40 text-emerald-300',
    'cancelled': 'bg-rose-900/40 text-rose-300',
  };
  return map[status] ?? 'bg-slate-700/40 text-slate-300';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'waiting-parts': 'Waiting for Parts',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
  };
  return map[status] ?? status;
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    'low': 'bg-slate-700/40 text-slate-400',
    'medium': 'bg-amber-900/40 text-amber-300',
    'high': 'bg-rose-900/40 text-rose-300',
  };
  return map[priority] ?? 'bg-slate-700/40 text-slate-400';
}
