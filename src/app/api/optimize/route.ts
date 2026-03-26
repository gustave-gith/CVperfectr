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

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Job description must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    if (pdfFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'PDF must be smaller than 5MB' },
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
        { success: false, error: 'Could not extract enough text from PDF. Make sure it is not a scanned image.' },
        { status: 422 }
      );
    }

    // Step 2: Send to Gemini
    const optimizedCv = await optimizeCvWithGemini(cvText, jobDescription.trim());

    return NextResponse.json({ success: true, data: optimizedCv });

  } catch (error) {
    console.error('CV optimization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
