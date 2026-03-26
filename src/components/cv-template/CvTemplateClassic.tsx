'use client';

import { forwardRef, useEffect } from 'react';
import { CvData } from '@/types/cv';

interface CvTemplateProps {
  data: CvData;
  className?: string; // Add className prop for scaling support
  fitOnePage?: boolean;
}

export const CvTemplateClassic = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data, className = '', fitOnePage = false }, ref) => {
    useEffect(() => {
      if (!fitOnePage) return;
      const el = document.getElementById('cv-template-classic');
      if (!el) return;
      // Wait for full paint before measuring
      requestAnimationFrame(() => {
        const height = el.scrollHeight;
        if (!height || height === 0) return; // guard against 0
        const scale = Math.min(1, 842 / height);
        if (scale > 0 && scale <= 1) {
          el.style.setProperty('--cv-scale', String(scale));
        }
      });
    }, [fitOnePage]);

    return (
      <div
        ref={ref}
        id="cv-template-classic"
        className={`bg-white text-gray-900 max-w-3xl mx-auto p-12 print:p-8 print:max-w-none print:shadow-none ${className} ${fitOnePage ? 'fit-one-page' : ''}`}
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-[0.15em] mb-4 text-[#1a1a2e] print:text-black">
            {data.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e] print:text-black border-b border-gray-300 pb-2 mb-4">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e] print:text-black border-b border-gray-300 pb-2 mb-4">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-base">{exp.role}</h3>
                    <span className="text-sm italic text-gray-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">{exp.company}</div>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-1.5">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-800 flex gap-3">
                          <span className="text-gray-400 shrink-0">—</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e] print:text-black border-b border-gray-300 pb-2 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.institution}</h3>
                    <div className="text-sm text-gray-700">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </div>
                  </div>
                  <span className="text-sm italic text-gray-500">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e] print:text-black border-b border-gray-300 pb-2 mb-4">
              Skills
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              {data.skills.join('  —  ')}
            </p>
          </section>
        )}

        {data.languages?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e] print:text-black border-b border-gray-300 pb-2 mb-4">
              Languages
            </h2>
            <p className="text-sm text-gray-800">
              {data.languages.join('  —  ')}
            </p>
          </section>
        )}
      </div>
    );
  }
);
CvTemplateClassic.displayName = 'CvTemplateClassic';
