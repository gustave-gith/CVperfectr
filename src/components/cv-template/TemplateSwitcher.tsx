'use client'

import { TemplateId, TEMPLATE_OPTIONS } from '@/types/cv';

interface TemplateSwitcherProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
  fitOnePage: boolean;
  onFitOnePageChange: (val: boolean) => void;
}

export function TemplateSwitcher({ 
  selected, 
  onSelect, 
  fitOnePage, 
  onFitOnePageChange 
}: TemplateSwitcherProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm print:hidden">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Style:</span>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selected === opt.id
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-1'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: opt.accent }}
              />
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

      <label className="flex items-center gap-2 cursor-pointer group ml-auto sm:ml-0">
        <input
          type="checkbox"
          checked={fitOnePage}
          onChange={(e) => onFitOnePageChange(e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
          📐 Fit to one page
        </span>
      </label>
    </div>
  );
}
