export type UserRole = "CUSTOMER" | "WORKER";

export interface AdminDirectoryUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: {
    city?: string | null;
    district?: string | null;
    approvalStatus?: string;
    availabilityStatus?: string;
  } | null;
}

export interface AdminUsersResponse {
  users: AdminDirectoryUser[];
}
