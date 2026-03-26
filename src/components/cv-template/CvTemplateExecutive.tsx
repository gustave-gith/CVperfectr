'use client';

import { forwardRef, useEffect } from 'react';
import { CvData } from '@/types/cv';

interface CvTemplateProps {
  data: CvData;
  className?: string; // Add className prop for scaling support
  fitOnePage?: boolean;
}

export const CvTemplateExecutive = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data, className = '', fitOnePage = false }, ref) => {
    useEffect(() => {
      if (!fitOnePage) return;
      const el = document.getElementById('cv-template-executive');
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
        id="cv-template-executive"
        className={`bg-white text-gray-900 max-w-3xl mx-auto p-10 print:p-8 print:max-w-none print:shadow-none ${className} ${fitOnePage ? 'fit-one-page' : ''}`}
        style={{ fontFamily: '"Trebuchet MS", Calibri, sans-serif' }}
      >
        <header className="text-center mb-8 border-b-2 border-gray-800 pb-6 print:border-gray-400">
          <h1 className="text-5xl font-black uppercase text-gray-900 mb-3">
            {data.name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-700 font-medium">
            {data.email && <span>{data.email}</span>}
            {data.phone && <><span className="text-gray-400">·</span><span>{data.phone}</span></>}
            {data.location && <><span className="text-gray-400">·</span><span>{data.location}</span></>}
            {data.linkedin && <><span className="text-gray-400">·</span><span>{data.linkedin}</span></>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-6">
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs">
              Executive Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-800 px-1">{data.summary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-4 print:bg-gray-200 print:text-gray-900 print:text-xs">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="bg-gray-50 rounded p-4 print:bg-transparent print:p-0 print:mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px] uppercase tracking-wide">{exp.company}</h3>
                      <div className="text-sm font-semibold text-gray-700">{exp.role}</div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm print:border-none print:shadow-none print:px-0">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-1.5 mt-3">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-800 flex gap-2.5 items-start">
                          <span className="text-gray-400 text-[10px] mt-1 shrink-0">▶</span>
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
          <section className="mb-6">
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs">
              Education & Credentials
            </h2>
            <div className="space-y-3 px-1">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm uppercase">{edu.institution}</h3>
                    <div className="text-sm text-gray-700">
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 px-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rotate-45"></span>
                  <span className="text-sm font-medium text-gray-800">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.languages?.length > 0 && (
          <section className="mb-6">
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs">
              Languages
            </h2>
            <p className="text-sm text-gray-800 px-1 font-medium">
              {data.languages.join('  |  ')}
            </p>
          </section>
        )}
      </div>
    );
  }
);
CvTemplateExecutive.displayName = 'CvTemplateExecutive';
