'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { UploadForm } from '@/components/upload-form/UploadForm';
import { CvTemplate } from '@/components/cv-template';
import { Button } from '@/components/ui/Button';
import { CvData } from '@/types/cv';

type AppState = 'idle' | 'result';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [cvData, setCvData] = useState<CvData | null>(null);
  const cvRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `CV-${cvData?.name?.replace(/\s+/g, '-') ?? 'optimized'}`,
  });

  const handleSuccess = (data: CvData) => {
    setCvData(data);
    setAppState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAppState('idle');
    setCvData(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-gray-900 text-lg">CVperfectr</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 
                           rounded-full font-medium ml-1">
              AI-Powered
            </span>
          </div>
          {appState === 'result' && (
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={handleReset}>
                ← Optimize Another
              </Button>
              <Button size="sm" onClick={() => handlePrint()}>
                ↓ Download PDF
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {appState === 'idle' ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Beat the ATS. Land the Interview.
              </h1>
              <p className="text-gray-500 text-lg">
                Upload your CV and paste a job description. Our AI rewrites your
                CV to match the exact keywords recruiters and ATS systems look for.
              </p>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { step: '1', icon: '📄', title: 'Upload CV', desc: 'Your PDF stays private' },
                { step: '2', icon: '🤖', title: 'AI Analyzes', desc: 'Gemini rewrites content' },
                { step: '3', icon: '✅', title: 'Download', desc: 'ATS-optimized PDF' },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} className="text-center p-4 rounded-xl bg-white 
                                           border border-gray-200 shadow-sm">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-semibold text-gray-800 text-sm">{title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <UploadForm onSuccess={handleSuccess} />
            </div>
          </div>
        ) : (
          <div>
            {/* Result Header */}
            <div className="flex items-center justify-between mb-6 print-hidden">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  ✅ Your optimized CV is ready
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Review the content below, then download as PDF
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleReset}>
                  ← Start over
                </Button>
                <Button size="lg" onClick={() => handlePrint()}>
                  ↓ Download as PDF
                </Button>
              </div>
            </div>

            {/* CV Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <CvTemplate ref={cvRef} data={cvData!} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
