import './pdf-init';
import fs from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';

// Load the worker from node_modules and convert to a Data URI.
// This bypasses Node.js ESM protocol restrictions for https:// imports.
const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
const workerContent = fs.readFileSync(workerPath, 'base64');
const workerDataUri = `data:text/javascript;base64,${workerContent}`;

PDFParse.setWorker(workerDataUri);

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Use the PDFParse class from v2 of the pdf-parse package
  // This explicitly prevents any "parseFn is not a function" errors.
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : error}`);
  } finally {
    // Frees memory safely
    await parser.destroy();
  }
}
