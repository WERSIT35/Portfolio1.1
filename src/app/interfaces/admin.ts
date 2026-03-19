export type AdminRole = 'super_admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}
