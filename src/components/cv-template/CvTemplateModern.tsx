'use client';

import { forwardRef, useEffect } from 'react';
import { CvData } from '@/types/cv';

interface CvTemplateProps {
  data: CvData;
  className?: string; // Add className prop for scaling support
  fitOnePage?: boolean;
}

export const CvTemplateModern = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data, className = '', fitOnePage = false }, ref) => {
    useEffect(() => {
      if (!fitOnePage) return;
      const el = document.getElementById('cv-template-modern');
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
        id="cv-template-modern"
        className={`relative bg-white text-gray-900 max-w-3xl mx-auto p-12 pl-16 print:p-8 print:pl-8 print:max-w-none print:shadow-none ${className} ${fitOnePage ? 'fit-one-page' : ''}`}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-600 print:hidden" />
        
        <header className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-950 tracking-tight mb-3">
            {data.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 print:text-gray-500 mb-3">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 print:text-gray-500 mb-4">
              Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                    <span className="text-xs font-mono text-gray-400">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mb-3">{exp.company}</div>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-600 flex gap-3 leading-relaxed">
                          <span className="text-indigo-400 font-bold shrink-0">·</span>
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
          <section className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 print:text-gray-500 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{edu.institution}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 print:text-gray-500 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 print:hidden">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 rounded px-2.5 py-1 text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <p className="hidden print:block text-sm text-gray-700">
              {data.skills.join(', ')}
            </p>
          </section>
        )}

        {data.languages?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 print:text-gray-500 mb-3">
              Languages
            </h2>
            <p className="text-sm text-gray-600">
              {data.languages.join(', ')}
            </p>
          </section>
        )}
      </div>
    );
  }
);
CvTemplateModern.displayName = 'CvTemplateModern';
