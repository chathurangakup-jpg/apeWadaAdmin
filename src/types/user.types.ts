export type UserRole = "CUSTOMER" | "WORKER";

export interface UserCategory {
  id: string;
  icon?: string | null;
  slug: string;
  nameEn: string;
  nameSi?: string | null;
}

export interface UserEducation {
  id: string;
  institution?: string | null;
  qualification?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface UserExperience {
  id: string;
  companyName?: string | null;
  jobTitle?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
}

export interface UserPortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  completedAt?: string | null;
}

export interface UserProfile {
  bio?: string | null;
  city?: string | null;
  venue?: string | null;
  address?: string | null;
  district?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  education?: UserEducation[];
  portfolio?: UserPortfolioItem[];
  categories?: UserCategory[];
  experiences?: UserExperience[];
  reviewCount?: number | null;
  averageRating?: number | null;
  approvalStatus?: string | null;
  experienceYears?: number | null;
  educationSummary?: string | null;
  availabilityStatus?: string | null;
}

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
  profile: UserProfile | null;
}

export interface AdminUsersResponse {
  users: AdminDirectoryUser[];
}
