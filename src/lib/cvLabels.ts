export type CvLocale = 'en' | 'fr' | 'es' | 'de';

export interface CvLabels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  present: string;
}

export const CV_LABELS: Record<CvLocale, CvLabels> = {
  en: {
    summary: 'Professional Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    present: 'Present',
  },
  fr: {
    summary: 'Profil Professionnel',
    experience: 'Expérience Professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    present: 'Présent',
  },
  es: {
    summary: 'Perfil Profesional',
    experience: 'Experiencia Profesional',
    education: 'Formación',
    skills: 'Habilidades',
    languages: 'Idiomas',
    present: 'Actualidad',
  },
  de: {
    summary: 'Berufliches Profil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    skills: 'Kenntnisse',
    languages: 'Sprachen',
    present: 'Heute',
  },
};

export function getLabels(locale?: string): CvLabels {
  const normalized = (locale ?? 'en').toLowerCase().slice(0, 2);
  return CV_LABELS[normalized as CvLocale] ?? CV_LABELS['en'];
}
