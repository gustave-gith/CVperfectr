'use client';

import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import { CvData, Experience, Education } from '@/types/cv';
import { getLabels } from '@/lib/cvLabels';

interface CvTemplateProps {
  data: CvData;
  isEditing?: boolean;
  onUpdate?: (data: CvData) => void;
  className?: string;
  fitOnePage?: boolean;
}

function EditableText({
  value,
  onChange,
  isEditing,
  className = '',
  tag: Tag = 'span',
}: {
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  className?: string;
  tag?: any;
}) {
  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={(e: any) => onChange(e.currentTarget.textContent || '')}
      className={`${className} ${
        isEditing
          ? 'outline-dashed outline-2 outline-blue-300 rounded cursor-text focus:outline-blue-500 focus:outline-solid px-0.5'
          : ''
      }`}
    >
      {value}
    </Tag>
  );
}

export const CvTemplate = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data, isEditing = false, onUpdate, className = '', fitOnePage = false }, ref) => {
    const labels = getLabels(data.locale);

    const internalRef = useRef<HTMLDivElement>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      if (!fitOnePage) {
        el.style.removeProperty('--cv-scale');
        el.style.removeProperty('transform');
        el.style.removeProperty('transformOrigin');
        el.style.removeProperty('width');
        return;
      }

      // Double rAF ensures the browser has fully painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const height = el.scrollHeight;
          if (!height || height === 0) return;
          const scale = Math.min(1, 842 / height);
          if (scale > 0) {
            el.style.setProperty('--cv-scale', String(scale));
            el.style.transform = `scale(${scale})`;
            el.style.transformOrigin = 'top left';
            el.style.width = `${100 / scale}%`;
          }
        });
      });
    }, [fitOnePage, data]);

    const handleEdit = (
      field: keyof CvData,
      value: string,
      index?: number,
      subField?: string,
      bulletIndex?: number
    ) => {
      if (!onUpdate) return;
      const updated = { ...data };
      if (index !== undefined && subField && bulletIndex !== undefined) {
        const arr = [...(updated[field] as Experience[])];
        const item = { ...arr[index] };
        const bullets = [...item.bullets];
        bullets[bulletIndex] = value;
        item.bullets = bullets;
        arr[index] = item;
        (updated[field] as Experience[]) = arr;
      } else if (index !== undefined && subField) {
        const arr = [...(updated[field] as any[])];
        arr[index] = { ...arr[index], [subField]: value };
        (updated[field] as any[]) = arr;
      } else if (index !== undefined) {
        const arr = [...(updated[field] as string[])];
        arr[index] = value;
        (updated[field] as string[]) = arr;
      } else {
        (updated[field] as any) = value;
      }
      onUpdate(updated);
    };

    return (
      <div
        ref={setRefs}
        id="cv-template"
        className={`bg-white text-gray-900 max-w-3xl mx-auto p-10 font-sans print:p-8 print:max-w-none print:shadow-none ${className} ${fitOnePage ? 'fit-one-page' : ''}`}
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {/* Header */}
        <header className="mb-8 border-b-2 border-gray-900 pb-6 print:border-gray-400">
          <EditableText
            tag="h1"
            value={data.name}
            onChange={(val) => handleEdit('name', val)}
            isEditing={isEditing}
            className="text-4xl font-bold uppercase tracking-wider text-gray-900 mb-2 block"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {data.email && <EditableText value={data.email} onChange={(val) => handleEdit('email', val)} isEditing={isEditing} />}
            {data.phone && <><span className="text-gray-300">|</span><EditableText value={data.phone} onChange={(val) => handleEdit('phone', val)} isEditing={isEditing} /></>}
            {data.location && <><span className="text-gray-300">|</span><EditableText value={data.location} onChange={(val) => handleEdit('location', val)} isEditing={isEditing} /></>}
            {data.linkedin && <><span className="text-gray-300">|</span><EditableText value={data.linkedin} onChange={(val) => handleEdit('linkedin', val)} isEditing={isEditing} /></>}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
              {labels.summary}
            </h2>
            <EditableText
              tag="p"
              value={data.summary}
              onChange={(val) => handleEdit('summary', val)}
              isEditing={isEditing}
              className="text-sm leading-relaxed text-gray-800 block"
            />
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-200 pb-1">
              {labels.experience}
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <EditableText
                        tag="h3"
                        value={exp.role}
                        onChange={(val) => handleEdit('experience', val, i, 'role')}
                        isEditing={isEditing}
                        className="font-bold text-gray-900 text-base block"
                      />
                      <EditableText
                        value={exp.company}
                        onChange={(val) => handleEdit('experience', val, i, 'company')}
                        isEditing={isEditing}
                        className="text-sm text-gray-700 block"
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                      <EditableText value={exp.startDate} onChange={(val) => handleEdit('experience', val, i, 'startDate')} isEditing={isEditing} />
                      {' – '}
                      <EditableText value={exp.endDate === 'Present' ? labels.present : exp.endDate} onChange={(val) => handleEdit('experience', val, i, 'endDate')} isEditing={isEditing} />
                    </span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 mt-2 marker:text-gray-400">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-800 pl-1">
                          <EditableText
                            tag="span"
                            value={bullet}
                            onChange={(val) => handleEdit('experience', val, i, 'bullets', j)}
                            isEditing={isEditing}
                            className="block w-full"
                          />
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-200 pb-1">
              {labels.education}
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <EditableText
                      tag="h3"
                      value={edu.institution}
                      onChange={(val) => handleEdit('education', val, i, 'institution')}
                      isEditing={isEditing}
                      className="font-bold text-gray-900 text-sm block"
                    />
                    <div className="text-sm text-gray-700 mt-0.5">
                      <EditableText value={edu.degree} onChange={(val) => handleEdit('education', val, i, 'degree')} isEditing={isEditing} />
                      {edu.field ? ' in ' : ''}
                      {edu.field ? <EditableText value={edu.field} onChange={(val) => handleEdit('education', val, i, 'field')} isEditing={isEditing} /> : null}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                    <EditableText value={edu.graduationYear} onChange={(val) => handleEdit('education', val, i, 'graduationYear')} isEditing={isEditing} />
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
              {labels.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded print:bg-transparent print:p-0 print:border-r print:border-gray-300 print:last:border-0 print:pr-2">
                  <EditableText
                    value={skill}
                    onChange={(val) => handleEdit('skills', val, i)}
                    isEditing={isEditing}
                  />
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
              {labels.languages}
            </h2>
            <div className="text-sm text-gray-700 space-x-2">
              {data.languages.map((language, i) => (
                <span key={i}>
                  <EditableText
                    value={language}
                    onChange={(val) => handleEdit('languages', val, i)}
                    isEditing={isEditing}
                  />
                  {i < data.languages.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }
);
CvTemplate.displayName = 'CvTemplate';
