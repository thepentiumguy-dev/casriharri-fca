import { LucideIcon } from 'lucide-react';

export interface ProjectHighlight {
  icon: LucideIcon;
  title: string;
  tag: string;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  highlights: ProjectHighlight[]; // Specific 3 highlights for the card grid
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