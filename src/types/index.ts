export type UserRole = 'customer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  image?: string;
  phone?: string;
  createdAt?: string;
}

export type ServiceStatus = 'active' | 'inactive';

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  status: ServiceStatus;
  createdAt?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

export interface Appointment {
  _id: string;
  serviceId: Service;
  customerId: User;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  appointmentId: Appointment;
  customerId: User;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: 'paid' | 'failed';
  createdAt: string;
}

export interface AdminStats {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  successfulPayments: number;
  totalRevenue: number;
}

export interface CustomerStats {
  totalAppointments: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}
