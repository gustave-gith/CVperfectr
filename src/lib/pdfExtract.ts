import { PDFParse } from 'pdf-parse';

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
