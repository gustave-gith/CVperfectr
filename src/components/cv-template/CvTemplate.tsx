'use client';

import { forwardRef } from 'react';
import { CvData } from '@/types/cv';

interface CvTemplateProps {
  data: CvData;
}

export const CvTemplate = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        id="cv-template"
        className="bg-white text-gray-900 max-w-3xl mx-auto p-10 font-sans
                   print:p-8 print:max-w-none print:shadow-none"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {data.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>📞 {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
            {data.linkedin && (
              <span>🔗 {data.linkedin}</span>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 
                           mb-2 border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 
                           mb-3 border-b border-gray-200 pb-1">
              Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{exp.role}</h3>
                      <p className="text-sm text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-gray-400 mt-0.5 shrink-0">▸</span>
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

        {/* Education */}
        {data.education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 
                           mb-3 border-b border-gray-200 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.institution}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 
                           mb-2 border-b border-gray-200 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs 
                             rounded-full border border-gray-200 font-medium
                             print:border print:border-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 
                           mb-2 border-b border-gray-200 pb-1">
              Languages
            </h2>
            <p className="text-sm text-gray-700">{data.languages.join(' · ')}</p>
          </section>
        )}
      </div>
    );
  }
);

CvTemplate.displayName = 'CvTemplate';
