import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

// Debug: Log API key status (first 10 chars only for security)
if (API_KEY) {
  console.log('Gemini API Key loaded:', API_KEY.substring(0, 10) + '...');
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn('Gemini API Key not found. Please add VITE_GEMINI_API_KEY to your .env file');
}

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

export async function generateSubstitutions(request: SubstitutionRequest): Promise<SubstitutionResponse> {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
  });

  const prompt = `You are an AI assistant for a school substitution management system. Your task is to generate optimal teacher substitutions.

Context:
- Absent Teacher: ${request.absentTeacherName} (${request.absentTeacherDesignation} - ${request.absentTeacherSubject})
- Periods to Cover: ${JSON.stringify(request.periodsToCover)}
- Available Teachers per Period: ${JSON.stringify(request.availableTeachers)}

IMPORTANT DESIGNATION RULES:
1. PRIMARY CLASSES (1-5): Only PRT (Primary Teacher) can teach
2. SECONDARY CLASSES (6-12): Only TGT (Trained Graduate Teacher) and PGT (Post Graduate Teacher) can teach
3. TGT and PGT teachers can substitute for each other in secondary classes
4. NEVER assign a PRT to secondary classes or TGT/PGT to primary classes

Substitution Priority Rules:
1. PRIORITY 1: Assign teachers with the SAME SUBJECT as the class subject
2. PRIORITY 2: Assign the CLASS TEACHER if they teach that class
3. PRIORITY 3: For Secondary: TGT/PGT can substitute for each other (prefer subject match)
4. PRIORITY 4: Distribute workload - assign teachers to as few periods as possible
5. Provide a clear reason explaining why this teacher is the best choice

Please return ONLY a valid JSON object in this exact format (no markdown, no code blocks, just raw JSON):
{
  "substitutions": [
    {
      "period": 1,
      "className": "10A",
      "substituteTeacherId": "teacher_id",
      "substituteTeacherName": "Teacher Name",
      "reason": "Subject expert in Physics (TGT can teach secondary classes)"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  console.log('Raw AI Response:', text);
  
  // Clean up the response - remove markdown code blocks if present
  let cleanedText = text.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Failed to parse AI response:', cleanedText);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

export async function* streamChatResponse(message: string, conversationHistory: Array<{ role: string; content: string }>) {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please create a .env file in the project root and add: VITE_GEMINI_API_KEY=your_api_key');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const systemInstruction = `You are a helpful AI assistant for the KVS AI Substitution Manager application. 
You help users understand how to use the application, answer questions about teacher substitutions, timetables, and school management.
Be concise, friendly, and professional. Provide clear step-by-step guidance when needed.`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemInstruction }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will assist users with the KVS AI Substitution Manager application in a helpful and professional manner.' }],
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API Error: ${error.message || 'Unknown error occurred'}`);
  }
}
