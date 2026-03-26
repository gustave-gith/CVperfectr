export interface CvFormatting {
  fontSize: number;       // base font size in px, range 9–14, default 11
  lineHeight: number;     // range 1.2–2.0, step 0.1, default 1.5
  sectionSpacing: number; // gap between sections in px, range 8–32, default 16
  marginH: number;        // horizontal page margin in px, range 16–64, default 32
  marginV: number;        // vertical page margin in px, range 16–64, default 32
  fontFamily: 'serif' | 'sans' | 'mono';  // default depends on template
}

export const DEFAULT_FORMATTING: CvFormatting = {
  fontSize: 11,
  lineHeight: 1.5,
  sectionSpacing: 16,
  marginH: 32,
  marginV: 32,
  fontFamily: 'serif',
};

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
  targetPosition?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  locale?: string;
}

export interface OptimizeResponse {
  success: boolean;
  data?: CvData;
  error?: string;
}

export type TemplateId = 'default' | 'classic' | 'executive';

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
    id: 'executive' as TemplateId,
    name: 'Executive',
    tagline: 'Structured authority',
    bestFor: 'C-suite · Director · Enterprise',
    accent: '#1f2937',
  },
] as const;
