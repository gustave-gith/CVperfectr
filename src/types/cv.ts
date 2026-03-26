export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface CvData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

export interface OptimizeResponse {
  success: boolean;
  data?: CvData;
  error?: string;
}

export type TemplateId = 'default' | 'classic' | 'modern' | 'executive';

export const TEMPLATE_OPTIONS = [
  {
    id: 'default' as TemplateId,
    name: 'Default',
    tagline: 'Clean and professional',
    bestFor: 'All industries',
    accent: '#374151',
  },
  {
    id: 'classic' as TemplateId,
    name: 'Classic',
    tagline: 'Timeless executive style',
    bestFor: 'Finance · Law · Consulting',
    accent: '#1a1a2e',
  },
  {
    id: 'modern' as TemplateId,
    name: 'Modern',
    tagline: 'Clean and minimal',
    bestFor: 'Tech · Product · Startups',
    accent: '#4F46E5',
  },
  {
    id: 'executive' as TemplateId,
    name: 'Executive',
    tagline: 'Structured authority',
    bestFor: 'C-suite · Director · Enterprise',
    accent: '#1f2937',
  },
] as const;
