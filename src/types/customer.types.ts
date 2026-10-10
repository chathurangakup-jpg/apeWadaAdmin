export type CustomerStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";
export type CancellationStatus = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  address: string;
  city: string;
  preferredLanguage: "en" | "si";
  status: CustomerStatus;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  cancellationStatus: CancellationStatus;
  rating: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
  city?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: CustomerFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}
