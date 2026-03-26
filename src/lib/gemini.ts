import { CvData } from '@/types/cv';

// Using the correct gemini-1.5-flash model
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const GOLDEN_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) CV optimizer.

STRICT RULES — NEVER BREAK THESE:
1. NEVER invent, fabricate, or hallucinate any job, company, role, degree, 
   institution, date, or personal detail not present in the original CV text.
2. NEVER change dates, years, company names, or proper nouns.
3. You MAY rewrite bullet points to use stronger action verbs and quantify 
   achievements, but only based on information already present.
4. You MAY add skills keywords from the Job Description IF AND ONLY IF 
   they are genuinely supported by the candidate's existing experience.
5. Return ONLY a raw JSON object. No markdown. No backticks. No explanation.
   The very first character of your response must be { and the last must be }.

OUTPUT FORMAT — return exactly this structure:
{
  "name": "string",
  "email": "string",
  "phone": "string", 
  "location": "string",
  "linkedin": "string",
  "summary": "2-3 sentence professional summary optimized for the job",
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "bullets": ["action verb + achievement", "action verb + achievement"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduationYear": "string"
    }
  ],
  "skills": ["skill1", "skill2"],
  "languages": ["language1"]
}`;

export async function optimizeCvWithGemini(
  cvText: string,
  jobDescription: string,
  language: string = 'English'
): Promise<CvData> {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log({ apiKey });
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const userMessage = `
ORIGINAL CV TEXT:
${cvText}

TARGET JOB DESCRIPTION:
${jobDescription}

Optimize this CV for the job description following all rules above. 
CRITICAL LANGUAGE RULE: You MUST write and translate ALL generated output text strictly in ${language}.
Return only the JSON object.`;

  // Use the native system_instruction structure required by Gemini API
  const body = {
    system_instruction: {
      parts: [{ text: GOLDEN_SYSTEM_PROMPT }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 8192
    }
  };

  try {
    // Gemini API requires the key in the query string, NOT as a Bearer token
    // Using Bearer token causes 403 / 404 errors.
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log(response)
    if (!response.ok) {
      const errorText = await response.text();
      let gracefulError = errorText;
      if (response.status === 400) gracefulError = 'Invalid request payload (400).';
      else if (response.status === 403 || response.status === 401) gracefulError = 'Invalid or expired GEMINI_API_KEY. Please verify your .env.local file.';
      else if (response.status === 404) gracefulError = `Model not found (404). Ensure you are using a valid model like ${GEMINI_MODEL}.`;

      throw new Error(`Gemini API Error: ${gracefulError}`);
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error('Gemini returned an empty response. Often caused by safety filters or an internal model block.');

    // Strip accidental markdown fences from completion
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(cleaned) as CvData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Gemini response as JSON. The model did not return valid JSON.');
    }
    throw error;
  }
}
