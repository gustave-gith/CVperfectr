'use client';

import { forwardRef } from 'react';
import { CvData, Experience, Education } from '@/types/cv';

interface CvTemplateProps {
  data: CvData;
  isEditing?: boolean;
  onUpdate?: (data: CvData) => void;
  className?: string; // in case we used it
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
  ({ data, isEditing = false, onUpdate, className = '' }, ref) => {

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
        ref={ref}
        id="cv-template"
        className={`bg-white text-gray-900 max-w-3xl mx-auto p-10 font-sans print:p-8 print:max-w-none print:shadow-none ${className}`}
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {/* Header */}
        <header className="border-b-2 border-gray-800 pb-4 mb-6">
          <EditableText
            tag="h1"
            value={data.name}
            onChange={(val) => handleEdit('name', val)}
            isEditing={isEditing}
            className="text-4xl font-bold text-gray-900 tracking-tight"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
            {data.email && (
              <span>✉ <EditableText value={data.email} onChange={(val) => handleEdit('email', val)} isEditing={isEditing} /></span>
            )}
            {data.phone && (
              <span>📞 <EditableText value={data.phone} onChange={(val) => handleEdit('phone', val)} isEditing={isEditing} /></span>
            )}
            {data.location && (
              <span>📍 <EditableText value={data.location} onChange={(val) => handleEdit('location', val)} isEditing={isEditing} /></span>
            )}
            {data.linkedin && (
              <span>🔗 <EditableText value={data.linkedin} onChange={(val) => handleEdit('linkedin', val)} isEditing={isEditing} /></span>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <EditableText
              tag="p"
              value={data.summary}
              onChange={(val) => handleEdit('summary', val)}
              isEditing={isEditing}
              className="text-sm leading-relaxed text-gray-700"
            />
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-200 pb-1">
              Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <EditableText
                        tag="h3"
                        value={exp.role}
                        onChange={(val) => handleEdit('experience', val, i, 'role')}
                        isEditing={isEditing}
                        className="font-bold text-gray-900 text-base"
                      />
                      <EditableText
                        tag="p"
                        value={exp.company}
                        onChange={(val) => handleEdit('experience', val, i, 'company')}
                        isEditing={isEditing}
                        className="text-sm text-gray-600 font-medium block"
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                      <EditableText value={exp.startDate} onChange={(val) => handleEdit('experience', val, i, 'startDate')} isEditing={isEditing} />
                      {' – '}
                      <EditableText value={exp.endDate} onChange={(val) => handleEdit('experience', val, i, 'endDate')} isEditing={isEditing} />
                    </span>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-gray-700 flex gap-2 items-start">
                          <span className="text-gray-400 mt-0.5 shrink-0">▸</span>
                          <EditableText
                            tag="span"
                            value={bullet}
                            onChange={(val) => handleEdit('experience', val, i, 'bullets', j)}
                            isEditing={isEditing}
                            className="block"
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
              Education
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
                      className="font-bold text-gray-900 text-sm"
                    />
                    <div className="text-sm text-gray-600">
                      <EditableText value={edu.degree} onChange={(val) => handleEdit('education', val, i, 'degree')} isEditing={isEditing} />
                      {edu.field ? ' in ' : ''}
                      {edu.field ? <EditableText value={edu.field} onChange={(val) => handleEdit('education', val, i, 'field')} isEditing={isEditing} /> : ''}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
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
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <EditableText
                  key={i}
                  tag="span"
                  value={skill}
                  onChange={(val) => handleEdit('skills', val, i)}
                  isEditing={isEditing}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200 font-medium print:border print:border-gray-300 inline-block"
                />
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">
              Languages
            </h2>
            <div className="text-sm text-gray-700 space-x-2">
              {data.languages.map((language, i) => (
                <span key={i}>
                  <EditableText
                    tag="span"
                    value={language}
                    onChange={(val) => handleEdit('languages', val, i)}
                    isEditing={isEditing}
                  />
                  {i < data.languages.length - 1 ? ' · ' : ''}
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
