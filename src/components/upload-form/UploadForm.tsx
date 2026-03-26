'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CvData } from '@/types/cv';

interface UploadFormProps {
  onSuccess: (data: CvData) => void;
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') {
      setPdfFile(file);
      setError(null);
    } else {
      setError('Please drop a PDF file');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('jobDescription', jobDescription);
      formData.append('language', language);

      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });

      // Handle common Vercel/Network errors before parsing JSON
      if (response.status === 504) {
        throw new Error('The request timed out. This often happens on Vercel Hobby tier when the AI takes more than 10 seconds. Try a shorter CV or job description.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned an unexpected response (${response.status}). This may be a deployment issue.`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Optimization failed');
      }

      onSuccess(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent server/client DOM hydration mismatch by ensuring it renders completely clientside
  if (!isMounted) return null;

  if (isLoading) {
    return <Spinner message="Analyzing your CV with AI... this takes 10-20 seconds" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PDF Drop Zone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your CV (PDF only)
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById('pdf-input')?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
              : pdfFile
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
          `}
        >
          <input
            id="pdf-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setPdfFile(file); setError(null); }
            }}
          />
          {pdfFile ? (
            <div className="space-y-1">
              <div className="text-3xl">✅</div>
              <p className="font-medium text-green-700 dark:text-green-400">{pdfFile.name}</p>
              <p className="text-xs text-green-600 dark:text-green-500">
                {(pdfFile.size / 1024).toFixed(0)} KB — Click to change
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl text-gray-400">📄</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Drop your CV here, or click to browse
              </p>
              <p className="text-xs text-gray-400">PDF files only, max 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Target Language Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CV Output Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200 bg-white dark:bg-gray-900"
        >
          <option value="English">🇬🇧 English</option>
          <option value="French">🇫🇷 French / Français</option>
        </select>
      </div>

      {/* Job Description Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Job Description
          <span className="ml-1 text-xs text-gray-400 font-normal">
            (paste the full job posting)
          </span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here. Include requirements, responsibilities, and any keywords you see. The more detail you provide, the better the AI can optimize your CV."
          rows={8}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 
                   placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 focus:outline-none focus:ring-2 
                   focus:ring-indigo-500 focus:border-transparent resize-none
                   transition-shadow duration-200"
        />
        <p className="mt-1 text-xs text-gray-400">
          {jobDescription.length} characters
          {jobDescription.length < 50 && jobDescription.length > 0 && (
            <span className="text-amber-500 ml-2">— needs at least 50 characters</span>
          )}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!isMounted || !pdfFile || jobDescription.trim().length < 50}
        suppressHydrationWarning
      >
        ✨ Optimize My CV with AI
      </Button>
    </form>
  );
}
