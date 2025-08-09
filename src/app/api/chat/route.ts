import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const { prompt, topic, context, history } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPreamble = `You are an expert guide helping users explore a Wikipedia topic. Be concise, accurate, and cite useful facts. Topic title: "${topic ?? ''}". If context is provided below, prioritize it for factual grounding. If no context is provided, rely on your own knowledge and clearly indicate uncertainty when appropriate.\n\nContext (may be empty):\n${context ?? ''}`;

    const historyContents = Array.isArray(history)
      ? history.slice(-12).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content ?? '' }],
        }))
      : [];

    const contents = [
      ...historyContents,
      { role: 'user', parts: [{ text: prompt }] },
    ];

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction: systemPreamble,
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 512,
        temperature: 0.4,
      } as any,
    });

    return NextResponse.json({ text: response.text ?? '' });
  } catch (error: any) {
    const message = error?.message || 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}