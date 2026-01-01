
export interface Farm {
  id: string;
  name: string;
  location: string;
  areaSize: number;
  season: string;
  cropType?: string;
  soilType?: string;
  irrigationType?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

export interface Worker {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  farmId: string;
  joiningDate: string;
  salary?: number;
  role?: string;
  address?: string;
  isActive: boolean;
}

export enum TransactionType {
  LOAN = 'LOAN',
  PAYMENT = 'PAYMENT',
  SALARY = 'SALARY',
  ADVANCE = 'ADVANCE'
}

export interface WorkerTransaction {
  id: string;
  workerId: string;
  type: TransactionType;
  amount: number;
  date: string;
  remarks: string;
  createdBy?: string;
}

export enum ExpenseCategory {
  FERTILIZER = 'FERTILIZER',
  TRACTOR = 'TRACTOR',
  SEEDS = 'SEEDS',
  PESTICIDES = 'PESTICIDES',
  LABOR = 'LABOR',
  EQUIPMENT = 'EQUIPMENT',
  UTILITIES = 'UTILITIES',
  OTHER = 'OTHER'
}

export interface FertilizerExpense {
  id: string;
  farmId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  date: string;
  supplier?: string;
  createdBy?: string;
}

export interface TractorExpense {
  id: string;
  farmId: string;
  tractorName: string;
  hoursUsed: number;
  cost: number;
  date: string;
  purpose?: string;
  createdBy?: string;
}

export interface OtherExpense {
  id: string;
  farmId: string;
  category: ExpenseCategory;
  name: string;
  amount: number;
  date: string;
  notes: string;
  createdBy?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER'
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  ownerId: string;
  settings?: OrganizationSettings;
}

export interface OrganizationSettings {
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details?: string;
}

export interface DashboardStats {
  totalFarms: number;
  totalWorkers: number;
  totalExpenses: number;
  monthlyExpenses: number;
  activeWorkers: number;
  pendingPayments: number;
}
