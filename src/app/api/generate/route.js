import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are StudyMind, an expert study assistant. Your job is to transform any text, notes, or topic into an engaging interactive study set.

RULES:
1. Always respond with ONLY valid JSON — no markdown fences, no explanation text, nothing before or after the JSON object.
2. The JSON must exactly follow the schema below.
3. Generate between 4 and 10 blocks total.
4. Mix flashcards and quiz questions thoughtfully based on the content.
5. For quiz questions, always provide exactly 4 answer options with exactly one correct answer.
6. For flashcards, the "front" should be a concise concept/term and the "back" should be a clear explanation.
7. The "title" should be a short, descriptive name for the study set (max 8 words).
8. If the input is too short, vague, or not study-worthy (< 20 words), return: {"error": "insufficient_content"}

JSON SCHEMA:
{
  "type": "mixed",
  "title": "<descriptive title>",
  "blocks": [
    {
      "blockType": "flashcard",
      "front": "<concept or question>",
      "back": "<explanation or answer>"
    },
    {
      "blockType": "quiz_question",
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correct": <0-3 index of correct option>,
      "explanation": "<brief explanation of the correct answer>"
    }
  ]
}`;

// Keep a single client instance
let openaiClient = null;

function getClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
      throw new Error('OPENAI_API_KEY is not configured on the server.');
    }
    openaiClient = new OpenAI({ 
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3867', 
        'X-Title': 'Study Assistant',
      }
    });
  }
  return openaiClient;
}

export async function POST(request) {
  let userText;
  try {
    const body = await request.json();
    userText = body?.text;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!userText || typeof userText !== 'string' || userText.trim().length < 10) {
    return NextResponse.json(
      { error: 'Please provide at least a few words for the AI to work with.' },
      { status: 400 }
    );
  }

  const truncated = userText.trim().slice(0, 6000);

  try {
    const openai = getClient();

    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: truncated },
      ],
      model: 'openai/gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const rawText = response.choices[0]?.message?.content?.trim();

    if (!rawText) {
      return NextResponse.json(
        { error: 'The AI returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'The AI returned malformed JSON. Please try again.' },
        { status: 502 }
      );
    }

    if (parsed?.error === 'insufficient_content') {
      return NextResponse.json(
        {
          error:
            'Your input is too short or vague. Please paste some notes, a topic, or a paragraph for the AI to study.',
        },
        { status: 422 }
      );
    }

    if (parsed && typeof parsed === 'object') {
      parsed.type = parsed.type || 'mixed';
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    console.error('[/api/generate] OpenAI error:', err);

    const isApiKeyError = err.message?.includes('OPENAI_API_KEY') || err.message?.includes('Incorrect API key');
    if (isApiKeyError) {
      return NextResponse.json(
        { error: 'Server configuration error: missing or invalid OpenAI API key.' },
        { status: 500 }
      );
    }

    if (err.status === 429 || err.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit reached on the OpenAI API. Please check your account quota.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'The AI service is currently unavailable. Please wait a moment and try again.',
      },
      { status: 503 }
    );
  }
}
