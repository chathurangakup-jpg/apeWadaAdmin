export type JobStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface JobCustomer {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface Job {
  id: string;
  title?: string;
  description?: string | null;
  status: JobStatus;
  category?: string | null;
  location?: string | null;
  address?: string | null;
  budget?: number | string | null;
  customer?: JobCustomer | null;
  customerId?: string;
  customerName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobState {
  jobs: Job[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}
