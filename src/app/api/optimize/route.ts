export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPdf } from '@/lib/pdfExtract';
import { optimizeCvWithGemini } from '@/lib/gemini';
import { OptimizeResponse } from '@/types/cv';

export async function POST(request: NextRequest): Promise<NextResponse<OptimizeResponse>> {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;
    const language = (formData.get('language') as string) || 'English';

    // Optional user-provided API key & model
    const clientApiKey = (formData.get('apiKey') as string | null) ||
      request.headers.get('x-gemini-api-key') ||
      undefined;

    const clientModel = (formData.get('model') as string | null) ||
      request.headers.get('x-gemini-model') ||
      undefined;

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier PDF fourni. Veuillez déposer votre CV.' },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'La description du poste doit comporter au moins 50 caractères.' },
        { status: 400 }
      );
    }

    const isPdf = 
      pdfFile.type === 'application/pdf' || 
      pdfFile.type === 'application/x-pdf' || 
      pdfFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: 'Le fichier déposé doit être un fichier PDF.' },
        { status: 400 }
      );
    }

    if (pdfFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Le fichier PDF ne doit pas dépasser 5 Mo.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for pdf-parse
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: Extract text from PDF
    const cvText = await extractTextFromPdf(buffer);

    if (cvText.trim().length < 100) {
      return NextResponse.json(
        { success: false, error: 'Impossible d\'extraire suffisamment de texte du PDF. Vérifiez qu\'il ne s\'agit pas d\'une image scannée.' },
        { status: 422 }
      );
    }

    // Step 2: Send to Gemini with futureproof model cascade & optional client API key
    const optimizedCv = await optimizeCvWithGemini(
      cvText,
      jobDescription.trim(),
      language,
      clientApiKey,
      clientModel
    );

    return NextResponse.json({ success: true, data: optimizedCv });

  } catch (error) {
    console.error('CV optimization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue lors de l\'optimisation.'
      },
      { status: 500 }
    );
  }
}
