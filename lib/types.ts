export type UserRole = "buyer" | "collaborator" | "admin";

export interface UserReputation {
  score: number; // 0-100
  isTrusted: boolean;
  totalDemands: number;
  status: "new" | "active" | "suspended";
  lastIncident?: Date;
}

export interface User {
  id: string; // whatsapp or uuid
  name: string;
  whatsapp: string;
  role: UserRole;
  reputation: UserReputation;
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  official: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brandId?: string;
  categoryId: string;
  basePrice?: number;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  services: string[];
  logo?: string;
  city: string;
  region: string;
  whatsapp: string;
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  featured: boolean;
  verified: boolean;
  brands: string[]; // IDs of brands they represent
  staffIds: string[]; // IDs of users assigned as staff
  reputationScore: number;
}

export interface Demand {
  id: string;
  userId: string;
  request: string;
  details: string;
  whatsapp: string;
  name: string;
  status: "verifying" | "pending" | "negotiating" | "completed" | "cancelled" | "expired";
  vCode?: string | null;
  matchedCategories: string[];
  targetPartnerIds: string[];
  createdAt: Date;
  expiresAt: Date;
}
