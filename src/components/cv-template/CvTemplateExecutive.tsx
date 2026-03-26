'use client';

import React, { forwardRef, useEffect, useRef, useCallback } from 'react';
import { CvData, Experience, Education, CvFormatting } from '@/types/cv';
import { getLabels } from '@/lib/cvLabels';

interface CvTemplateProps {
  data: CvData;
  className?: string;
  fitOnePage?: boolean;
  isEditing?: boolean;
  onUpdate?: (data: CvData) => void;
  formatting?: CvFormatting;
}

function EditableText({
  value,
  onChange,
  isEditing,
  className = '',
  tag: Tag = 'span',
  style,
}: {
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  className?: string;
  tag?: any;
  style?: React.CSSProperties;
}) {
  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={(e: any) => onChange(e.currentTarget.textContent || '')}
      className={`${className} ${
        isEditing
          ? 'outline-dashed outline-2 outline-blue-300 rounded cursor-text focus:outline-blue-500 focus:outline-solid px-0.5 inline-block'
          : ''
      }`}
      style={style}
    >
      {value}
    </Tag>
  );
}

export const CvTemplateExecutive = forwardRef<HTMLDivElement, CvTemplateProps>(
  ({ data, className = '', fitOnePage = false, isEditing = false, onUpdate, formatting }, ref) => {
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
        id="cv-template-executive"
        className={`bg-white text-gray-900 max-w-3xl mx-auto print:max-w-none print:shadow-none ${className} ${fitOnePage ? 'fit-one-page' : ''}`}
        style={{
          fontSize: `${formatting?.fontSize ?? 11}px`,
          lineHeight: formatting?.lineHeight ?? 1.5,
          padding: `${formatting?.marginV ?? 32}px ${formatting?.marginH ?? 32}px`,
          fontFamily: formatting?.fontFamily === 'sans'
            ? 'system-ui, sans-serif'
            : formatting?.fontFamily === 'mono'
            ? '"Courier New", monospace'
            : '"Trebuchet MS", Calibri, sans-serif',
        }}
      >
        <header className="text-center mb-8 border-b-2 border-gray-800 pb-6 print:border-gray-400">
          <EditableText
            tag="h1"
            value={data.name}
            onChange={(val) => handleEdit('name', val)}
            isEditing={isEditing}
            className="text-5xl font-black uppercase text-gray-900 mb-2 block"
          />
          {data.targetPosition && (
            <EditableText
              tag="p"
              value={data.targetPosition}
              onChange={(val) => handleEdit('targetPosition' as keyof CvData, val)}
              isEditing={isEditing}
              className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-3 block"
            />
          )}
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-700 font-medium">
            {data.email && <EditableText value={data.email} onChange={(val) => handleEdit('email', val)} isEditing={isEditing} />}
            {data.phone && <><span className="text-gray-400">·</span><EditableText value={data.phone} onChange={(val) => handleEdit('phone', val)} isEditing={isEditing} /></>}
            {data.location && <><span className="text-gray-400">·</span><EditableText value={data.location} onChange={(val) => handleEdit('location', val)} isEditing={isEditing} /></>}
            {data.linkedin && <><span className="text-gray-400">·</span><EditableText value={data.linkedin} onChange={(val) => handleEdit('linkedin', val)} isEditing={isEditing} /></>}
          </div>
        </header>

        {data.summary && (
          <section style={{ marginBottom: `${formatting?.sectionSpacing ?? 16}px` }}>
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs block">
              {labels.summary}
            </h2>
            <EditableText
              tag="p"
              value={data.summary}
              onChange={(val) => handleEdit('summary', val)}
              isEditing={isEditing}
              className="text-sm leading-relaxed text-gray-800 px-1 block"
            />
          </section>
        )}

        {data.experience?.length > 0 && (
          <section style={{ marginBottom: `${formatting?.sectionSpacing ?? 16}px` }}>
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-4 print:bg-gray-200 print:text-gray-900 print:text-xs block">
              {labels.experience}
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="bg-gray-50 rounded p-4 print:bg-transparent print:p-0 print:mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <EditableText
                        tag="h3"
                        value={exp.company}
                        onChange={(val) => handleEdit('experience', val, i, 'company')}
                        isEditing={isEditing}
                        className="font-bold text-gray-900 text-[15px] uppercase tracking-wide block"
                      />
                      <EditableText
                        value={exp.role}
                        onChange={(val) => handleEdit('experience', val, i, 'role')}
                        isEditing={isEditing}
                        className="text-sm font-semibold text-gray-700 block"
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm print:border-none print:shadow-none print:px-0 whitespace-nowrap">
                      <EditableText value={exp.startDate} onChange={(val) => handleEdit('experience', val, i, 'startDate')} isEditing={isEditing} />
                      {' – '}
                      <EditableText value={exp.endDate === 'Present' ? labels.present : exp.endDate} onChange={(val) => handleEdit('experience', val, i, 'endDate')} isEditing={isEditing} />
                    </span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-1.5 mt-3">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-800 flex gap-2.5 items-start">
                          <span className="text-gray-400 text-[10px] mt-1 shrink-0">▶</span>
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

        {data.education?.length > 0 && (
          <section style={{ marginBottom: `${formatting?.sectionSpacing ?? 16}px` }}>
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs block">
              {labels.education}
            </h2>
            <div className="space-y-3 px-1">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <EditableText
                      tag="h3"
                      value={edu.institution}
                      onChange={(val) => handleEdit('education', val, i, 'institution')}
                      isEditing={isEditing}
                      className="font-bold text-gray-900 text-sm uppercase block"
                    />
                    <div className="text-sm text-gray-700">
                      <EditableText value={edu.degree} onChange={(val) => handleEdit('education', val, i, 'degree')} isEditing={isEditing} />
                      {edu.field ? ' — ' : ''}
                      {edu.field ? <EditableText value={edu.field} onChange={(val) => handleEdit('education', val, i, 'field')} isEditing={isEditing} /> : null}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                    <EditableText value={edu.graduationYear} onChange={(val) => handleEdit('education', val, i, 'graduationYear')} isEditing={isEditing} />
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section style={{ marginBottom: `${formatting?.sectionSpacing ?? 16}px` }}>
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs block">
              {labels.skills}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 px-1">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rotate-45 shrink-0"></span>
                  <EditableText
                    value={skill}
                    onChange={(val) => handleEdit('skills', val, i)}
                    isEditing={isEditing}
                    className="text-sm font-medium text-gray-800"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {data.languages?.length > 0 && (
          <section style={{ marginBottom: `${formatting?.sectionSpacing ?? 16}px` }}>
            <h2 className="bg-gray-800 text-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide mb-3 print:bg-gray-200 print:text-gray-900 print:text-xs block">
              {labels.languages}
            </h2>
            <p className="text-sm text-gray-800 px-1 font-medium space-x-2">
              {data.languages.map((lang, i) => (
                <span key={i}>
                  <EditableText
                    value={lang}
                    onChange={(val) => handleEdit('languages', val, i)}
                    isEditing={isEditing}
                  />
                  {i < data.languages.length - 1 ? '  |  ' : ''}
                </span>
              ))}
            </p>
          </section>
        )}
      </div>
    );
  }
);
CvTemplateExecutive.displayName = 'CvTemplateExecutive';
