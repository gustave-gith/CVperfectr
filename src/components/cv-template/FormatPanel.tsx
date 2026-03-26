'use client';

import { useState } from 'react';
import { CvFormatting, DEFAULT_FORMATTING, TemplateId } from '@/types/cv';

interface FormatPanelProps {
  formatting: CvFormatting;
  onChange: (f: CvFormatting) => void;
  selectedTemplate: TemplateId;
}

export function FormatPanel({ formatting, onChange, selectedTemplate }: FormatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative print:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 h-10"
      >
        🎨 Format
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-4 z-50">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Font Size */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Text size</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatting.fontSize}px</span>
              </div>
              <input 
                type="range" min="9" max="14" step="0.5" 
                value={formatting.fontSize}
                onChange={(e) => onChange({...formatting, fontSize: parseFloat(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Line Height */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Line spacing</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatting.lineHeight}</span>
              </div>
              <input 
                type="range" min="1.2" max="2.0" step="0.1" 
                value={formatting.lineHeight}
                onChange={(e) => onChange({...formatting, lineHeight: parseFloat(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Section Spacing */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Section gaps</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatting.sectionSpacing}px</span>
              </div>
              <input 
                type="range" min="8" max="32" step="4" 
                value={formatting.sectionSpacing}
                onChange={(e) => onChange({...formatting, sectionSpacing: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Horizontal Margins */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Side margins</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatting.marginH}px</span>
              </div>
              <input 
                type="range" min="16" max="64" step="4" 
                value={formatting.marginH}
                onChange={(e) => onChange({...formatting, marginH: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Vertical Margins */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Top/bottom margins</label>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatting.marginV}px</span>
              </div>
              <input 
                type="range" min="16" max="64" step="4" 
                value={formatting.marginV}
                onChange={(e) => onChange({...formatting, marginV: parseInt(e.target.value)})}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Font Family */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-2">Font style</label>
              <div className="flex gap-2">
                {(['serif', 'sans', 'mono'] as const).map(font => (
                  <button
                    key={font}
                    onClick={() => onChange({...formatting, fontFamily: font})}
                    className={`flex-1 py-1 text-xs rounded transition-colors capitalize ${
                      formatting.fontFamily === font 
                        ? 'bg-indigo-600 text-white font-medium shadow-inner' 
                        : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="col-span-2 mt-2 border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-end">
              <button 
                onClick={() => onChange(DEFAULT_FORMATTING)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Reset to defaults
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
