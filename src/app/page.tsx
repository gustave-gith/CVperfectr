'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { UploadForm } from '@/components/upload-form/UploadForm';
import { 
  CvTemplate,
  CvTemplateClassic,
  CvTemplateExecutive,
  TemplateSwitcher,
  FormatPanel
} from '@/components/cv-template';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CvData, CvFormatting, DEFAULT_FORMATTING, TemplateId } from '@/types/cv';

type AppState = 'idle' | 'result';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [cvData, setCvData] = useState<CvData | null>(null);
  const cvRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('default');
  const [fitOnePage, setFitOnePage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formatting, setFormatting] = useState<CvFormatting>(DEFAULT_FORMATTING);
  const [isDraggingCv, setIsDraggingCv] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Pre-generated PDF blob for instant download & native Drag & Drop
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isPdfReady, setIsPdfReady] = useState(false);

  const getPdfFilename = useCallback(() => {
    return `CV-${cvData?.name?.replace(/\s+/g, '-') ?? 'optimise'}.pdf`;
  }, [cvData?.name]);

  const generatePdfBlob = useCallback(async (): Promise<Blob | null> => {
    if (!cvRef.current) return null;
    const html2pdf = (await import('html2pdf.js')).default;
    const blob: Blob = await html2pdf()
      .set({
        margin: 0,
        filename: getPdfFilename(),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(cvRef.current)
      .outputPdf('blob');
    return blob;
  }, [getPdfFilename]);

  // Pre-generate PDF Blob whenever CV or formatting changes
  useEffect(() => {
    if (appState !== 'result' || !cvData || isEditing) return;

    let isCurrent = true;
    setIsPdfReady(false);

    const timer = setTimeout(async () => {
      try {
        const blob = await generatePdfBlob();
        if (blob && isCurrent) {
          setPdfBlob(blob);
          setPdfBlobUrl((prevUrl) => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(blob);
          });
          setIsPdfReady(true);
        }
      } catch (err) {
        console.error('Erreur de pré-génération du PDF:', err);
      }
    }, 600);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [appState, cvData, selectedTemplate, fitOnePage, formatting, isEditing, generatePdfBlob]);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [pdfBlobUrl]);

  useReactToPrint({
    contentRef: cvRef,
    documentTitle: getPdfFilename().replace('.pdf', ''),
  });

  const handleDownload = useCallback(async () => {
    setIsGeneratingPdf(true);
    try {
      let blob = pdfBlob;
      if (!blob) {
        blob = await generatePdfBlob();
      }
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getPdfFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [pdfBlob, generatePdfBlob, getPdfFilename]);

  // Real synchronous HTML5 Drag & Drop for generated PDF
  const handleDragStart = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.dataTransfer.effectAllowed = 'copy';
    setIsDraggingCv(true);

    const filename = getPdfFilename();

    if (pdfBlobUrl && pdfBlob) {
      // 1. Native Chrome/Edge Drag-to-Desktop format:
      // "application/pdf:filename.pdf:URL"
      e.dataTransfer.setData('DownloadURL', `application/pdf:${filename}:${pdfBlobUrl}`);

      // 2. Add File to DataTransferItemList for apps like Slack, Discord, Mail
      try {
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        e.dataTransfer.items.add(file);
      } catch {
        // Fallback silently if browser restricts items.add
      }

      // 3. Fallback URL formats
      e.dataTransfer.setData('text/uri-list', pdfBlobUrl);
      e.dataTransfer.setData('text/plain', filename);
    } else {
      // Fallback hint
      e.dataTransfer.setData('text/plain', filename);
    }
  }, [pdfBlobUrl, pdfBlob, getPdfFilename]);

  const handleDragEnd = useCallback(() => {
    setIsDraggingCv(false);
  }, []);

  const handleSuccess = (data: CvData) => {
    setCvData(data);
    setAppState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAppState('idle');
    setCvData(null);
    setPdfBlob(null);
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl(null);
    setIsPdfReady(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-950 via-white dark:via-gray-900 to-purple-50 dark:to-indigo-950/20">
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-gray-900 dark:text-white text-lg">CVperfectr</span>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 
                           rounded-full font-medium ml-1">
              IA Future-Proof
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {appState === 'result' && (
              <>
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  ← Optimiser un autre CV
                </Button>
                <Button size="sm" onClick={handleDownload} disabled={isGeneratingPdf}>
                  {isGeneratingPdf ? '⏳ Préparation…' : '↓ Télécharger le PDF'}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {appState === 'idle' ? (
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                Passez les filtres ATS. Décrochez l'entretien.
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Déposez votre CV et collez l'offre d'emploi. Notre IA reformule votre CV
                avec un ton humain, naturel et percutant, parfaitement calibré pour les recruteurs.
              </p>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { step: '1', icon: '📄', title: 'Déposez votre CV', desc: 'Glisser-déposer de votre PDF' },
                { step: '2', icon: '🤖', title: 'Réécriture IA', desc: 'Phrases naturelles & ATS' },
                { step: '3', icon: '📥', title: 'Export Drag & Drop', desc: 'Glissez le PDF sur le bureau' },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} className="text-center p-4 rounded-xl bg-white dark:bg-gray-900 
                                           border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</div>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
              <UploadForm onSuccess={handleSuccess} />
            </div>
          </div>
        ) : (
          <div>
            {/* Result Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print-hidden">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>✅</span> Votre CV optimisé est prêt
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Vérifiez le contenu ci-dessous, personnalisez le style et exportez votre PDF.
                </p>
                {isEditing && (
                  <p className="text-xs text-blue-600 font-medium mt-2">
                    ✏️ Cliquez directement sur n'importe quel texte du CV pour le modifier. Cliquez sur "Terminer l'édition" quand vous avez fini.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  ← Recommencer
                </Button>
                <Button
                  variant={isEditing ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? '✅ Terminer l\'édition' : '✏️ Modifier le CV'}
                </Button>
                <Button size="sm" onClick={handleDownload} disabled={isGeneratingPdf}>
                  {isGeneratingPdf ? '⏳ Génération…' : '↓ Télécharger PDF'}
                </Button>
              </div>
            </div>

            {/* Dedicated Drag & Drop PDF Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print-hidden">
              <div className="flex items-center gap-3 text-left">
                <div
                  draggable={isPdfReady}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all select-none shadow-sm cursor-grab active:cursor-grabbing
                    ${isPdfReady 
                      ? 'bg-white dark:bg-gray-900 border-indigo-500/60 hover:border-indigo-600 hover:shadow-indigo-500/20 scale-100 hover:scale-[1.02]' 
                      : 'bg-gray-100 dark:bg-gray-800 border-dashed border-gray-300 dark:border-gray-700 opacity-70 cursor-wait'
                    }
                  `}
                  title="Glissez ce badge directement sur votre bureau, dans un dossier ou dans un email !"
                >
                  <span className="text-3xl animate-bounce">📄</span>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span>{getPdfFilename()}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                        {isPdfReady ? 'Glisser-Déposer actif' : 'Préparation du PDF…'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {isPdfReady 
                        ? '👉 Glissez vers votre bureau ou un dossier pour récupérer le PDF'
                        : 'Calcul du PDF en cours...'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                <span>💡</span>
                <span>Vous pouvez aussi glisser la feuille du CV directement !</span>
              </div>
            </div>

            {/* Template Switcher */}
            <TemplateSwitcher
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
              fitOnePage={fitOnePage}
              onFitOnePageChange={setFitOnePage}
            />

            {/* Format Panel */}
            <FormatPanel
              formatting={formatting}
              onChange={setFormatting}
              selectedTemplate={selectedTemplate}
            />

            {/* CV Preview Card — draggable as a PDF file */}
            <div
              draggable={isPdfReady}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className={`group relative rounded-2xl border shadow-lg overflow-hidden cursor-grab active:cursor-grabbing
                transition-all duration-200
                ${isDraggingCv
                  ? 'border-indigo-400 ring-4 ring-indigo-300 dark:ring-indigo-600 scale-[0.99]'
                  : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                } bg-white`}
            >
              {/* Drag hint badge */}
              <div className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                bg-indigo-600 text-white shadow-md
                transition-all duration-200 print:hidden
                ${isDraggingCv ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'}`}
              >
                <span>✋</span>
                <span>{isDraggingCv ? 'Relâchez pour déposer le PDF' : 'Glissez pour enregistrer le PDF'}</span>
              </div>

              {(() => {
                const templateWrapperClass = fitOnePage 
                  ? 'print:text-[10.5px] print:[&_*]:leading-tight' 
                  : '';

                return (
                  <div ref={cvRef} className={templateWrapperClass}>
                    {selectedTemplate === 'default' && (
                      <CvTemplate data={cvData!} isEditing={isEditing} onUpdate={(updated) => setCvData(updated)} formatting={formatting} />
                    )}
                    {selectedTemplate === 'classic' && (
                      <CvTemplateClassic data={cvData!} isEditing={isEditing} onUpdate={(updated) => setCvData(updated)} formatting={formatting} />
                    )}
                    {selectedTemplate === 'executive' && (
                      <CvTemplateExecutive data={cvData!} isEditing={isEditing} onUpdate={(updated) => setCvData(updated)} formatting={formatting} />
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
