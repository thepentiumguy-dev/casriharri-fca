import { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  url: string;
  icon: LucideIcon;
  color: string; // Tailwind class for icon color
}

export interface ContactInfo {
  phone: string;
  email: string;
  organization: string;
}

export type Theme = 'light' | 'dark';
