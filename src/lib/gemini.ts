import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

// Debug: confirm API key is loaded
if (API_KEY) {
  console.log('Gemini API Key loaded:', API_KEY.substring(0, 10) + '...');
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn(
    'Gemini API Key not found. Please add VITE_GEMINI_API_KEY to your .env file'
  );
}

/* =========================
   TYPES
========================= */

export interface SubstitutionRequest {
  absentTeacherName: string;
  absentTeacherDesignation: string;
  absentTeacherSubject: string;
  periodsToCover: Array<{
    period: number;
    className: string;
  }>;
  availableTeachers: Array<{
    period: number;
    teachers: Array<{
      id: string;
      name: string;
      designation: string;
      subject: string;
      isClassTeacher: boolean;
      isSameSubject: boolean;
    }>;
  }>;
}

export interface SubstitutionResponse {
  substitutions: Array<{
    period: number;
    className: string;
    substituteTeacherId: string;
    substituteTeacherName: string;
    reason: string;
  }>;
}

/* =========================
   SUBSTITUTION GENERATION
========================= */

export async function generateSubstitutions(
  request: SubstitutionRequest
): Promise<SubstitutionResponse> {
  if (!genAI) {
    throw new Error(
      'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file'
    );
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompt = `You are an AI assistant for a school substitution management system.

Context:
- Absent Teacher: ${request.absentTeacherName} (${request.absentTeacherDesignation} - ${request.absentTeacherSubject})
- Periods to Cover: ${JSON.stringify(request.periodsToCover)}
- Available Teachers per Period: ${JSON.stringify(request.availableTeachers)}

IMPORTANT DESIGNATION RULES:
1. PRIMARY CLASSES (1–5): Only PRT teachers allowed
2. SECONDARY CLASSES (6–12): Only TGT or PGT teachers allowed
3. TGT and PGT can substitute for each other in secondary classes
4. NEVER violate designation rules

PRIORITY RULES:
1. Same subject
2. Class teacher
3. Correct designation
4. Minimum workload
5. Always explain the reason

Return ONLY valid JSON in this format:
{
  "substitutions": [
    {
      "period": 1,
      "className": "10A",
      "substituteTeacherId": "teacher_id",
      "substituteTeacherName": "Teacher Name",
      "reason": "Clear justification"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  console.log('Raw AI Response:', text);

  let cleanedText = text;
  if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText
      .replace(/^```json\n?/, '')
      .replace(/^```\n?/, '')
      .replace(/\n```$/, '');
  }

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('JSON Parse Error:', cleanedText);
    throw new Error('Failed to parse AI response');
  }
}

/* =========================
   CHAT (NON-STREAMING)
========================= */

export async function chatResponse(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  if (!genAI) {
    throw new Error(
      'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file'
    );
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const systemInstruction = `You are the AI Assistant for the KVS AI Substitution Manager.
Help users with substitutions, timetables, leaves, and general guidance.
Be concise, professional, and clear.`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemInstruction }],
        },
        {
          role: 'model',
          parts: [
            {
              text: 'Understood. I will assist users professionally and accurately.',
            },
          ],
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(
      `Gemini API Error: ${error.message || 'Unknown error occurred'}`
    );
  }
}
