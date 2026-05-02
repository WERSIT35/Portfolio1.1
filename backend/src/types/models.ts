export type AdminRole = "super_admin" | "editor" | "viewer";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface PublicAdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface ContentDocument {
  hero: Record<string, unknown>;
  ctas: Record<string, unknown>;
  skills: unknown[];
  education: unknown[];
  experience: unknown[];
  certificates: unknown[];
  projects: unknown[];
  contact: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface DbShape {
  users: AdminUser[];
  content: ContentDocument;
}

export interface JwtPayload {
  sub: string;
  role: AdminRole;
  email: string;
}
