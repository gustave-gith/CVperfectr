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
  const [language, setLanguage] = useState('French');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load saved API key if user previously entered one
    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) setApiKey(savedKey);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    try {
      if (val.trim()) {
        localStorage.setItem('gemini_api_key', val.trim());
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch {
      // Ignore
    }
  };

  const isPdf = (file?: File | null) => {
    if (!file) return false;
    return (
      file.type === 'application/pdf' ||
      file.type === 'application/x-pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    );
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && isPdf(file)) {
      setPdfFile(file);
      setError(null);
    } else {
      setError('Veuillez déposer un fichier au format PDF.');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
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
      if (apiKey.trim()) {
        formData.append('apiKey', apiKey.trim());
      }

      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });

      // Handle common Vercel/Network errors before parsing JSON
      if (response.status === 504) {
        throw new Error('Le délai d\'attente a expiré (504). Cela peut arriver sur Vercel Hobby si l\'analyse prend plus de 10-15 secondes. Essayez avec un texte plus court.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Le serveur a renvoyé une réponse inattendue (${response.status}).`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'L\'optimisation a échoué');
      }

      onSuccess(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent server/client DOM hydration mismatch
  if (!isMounted) return null;

  if (isLoading) {
    return <Spinner message="Analyse et réécriture humaine de votre CV en cours... (environ 10 à 20 secondes)" />;
  }

  const isApiKeyError = error && (
    error.includes('GEMINI_API_KEY') ||
    error.includes('Clé API') ||
    error.includes('API key')
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* PDF Drop Zone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Votre CV actuel (format PDF)
        </label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('pdf-input')?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 select-none
            ${isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 ring-4 ring-indigo-200 dark:ring-indigo-800 scale-[1.01]'
              : pdfFile
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
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
              if (file && isPdf(file)) {
                setPdfFile(file);
                setError(null);
              } else if (file) {
                setError('Veuillez sélectionner un fichier PDF.');
              }
            }}
          />
          {pdfFile ? (
            <div className="space-y-2">
              <div className="text-4xl animate-bounce">📄</div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-base">{pdfFile.name}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                {(pdfFile.size / 1024).toFixed(0)} KB • Prêt pour l'analyse • Cliquez pour remplacer
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl text-gray-400">📂</div>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {isDragging ? 'Déposez votre CV ici !' : 'Glissez-déposez votre CV ici, ou cliquez pour parcourir'}
              </p>
              <p className="text-xs text-gray-400">Fichier PDF uniquement, max 5 Mo</p>
            </div>
          )}
        </div>
      </div>

      {/* Target Language Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Langue du CV généré
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow duration-200 bg-white dark:bg-gray-900"
        >
          <option value="French">🇫🇷 Français (tournures naturelles & humaines)</option>
          <option value="English">🇬🇧 English (natural & ATS-optimized)</option>
        </select>
      </div>

      {/* Job Description Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description ou fiche du poste visé
          <span className="ml-1 text-xs text-gray-400 font-normal">
            (collez le texte complet de l'offre)
          </span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Collez ici l'intégralité de l'offre d'emploi : missions, profil recherché, compétences attendues... Plus l'offre est complète, plus l'optimisation ATS sera ciblée et humaine."
          rows={7}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 
                   placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 focus:outline-none focus:ring-2 
                   focus:ring-indigo-500 focus:border-transparent resize-none
                   transition-shadow duration-200"
        />
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{jobDescription.length} caractères</span>
          {jobDescription.length < 50 && jobDescription.length > 0 && (
            <span className="text-amber-500 font-medium">Au moins 50 caractères requis</span>
          )}
        </div>
      </div>

      {/* Optional Custom Gemini API Key Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
        >
          <span>⚙️</span>
          <span>{showApiKeyInput ? 'Masquer les options d\'API' : 'Options avancées / Clé API Gemini'}</span>
          {apiKey && <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">Clé enregistrée</span>}
        </button>

        {showApiKeyInput && (
          <div className="mt-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Clé API Gemini (optionnelle si configurée dans le fichier .env.local)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-[11px] text-gray-500">
              Si votre serveur Next.js n'a pas accès à la variable d'environnement ou en cas de déploiement, collez votre clé ici. Elle sera sauvegardée localement dans votre navigateur.
            </p>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 space-y-3">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">⚠️ {error}</p>
          {isApiKeyError && !showApiKeyInput && (
            <button
              type="button"
              onClick={() => setShowApiKeyInput(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 transition-colors"
            >
              🔑 Saisir ma clé API Gemini maintenant
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full shadow-md hover:shadow-indigo-500/20 transition-all"
        disabled={!isMounted || !pdfFile || jobDescription.trim().length < 50}
        suppressHydrationWarning
      >
        ✨ Optimiser mon CV avec l'IA
      </Button>
    </form>
  );
}
