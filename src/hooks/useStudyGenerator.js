/**
 * useStudyGenerator – custom hook that calls /api/generate and handles:
 *  - loading / error / data states
 *  - race conditions via AbortController (newest request wins)
 *  - JSON parse failures and shape validation
 */

'use client';

import { useCallback, useRef, useState } from 'react';

// ── Schema validator ──────────────────────────────────────────────────────────
//
// Expected JSON envelope from the API:
// {
//   "type": "flashcards" | "quiz",
//   "title": string,
//   "blocks": [
//     // flashcard block:
//     { "blockType": "flashcard", "front": string, "back": string }
//     // quiz block:
//     { "blockType": "quiz_question", "question": string, "options": string[],
//       "correct": number, "explanation": string }
//   ]
// }
//
// Returns null if the shape is invalid.

function validateStudyData(data) {
  if (!data || typeof data !== 'object') return null;
  if (!['flashcards', 'quiz', 'mixed'].includes(data.type)) return null;
  if (typeof data.title !== 'string' || !data.title.trim()) return null;
  if (!Array.isArray(data.blocks) || data.blocks.length === 0) return null;

  const validBlocks = data.blocks.filter((block) => {
    if (!block || typeof block !== 'object') return false;
    if (block.blockType === 'flashcard') {
      return typeof block.front === 'string' && typeof block.back === 'string';
    }
    if (block.blockType === 'quiz_question') {
      return (
        typeof block.question === 'string' &&
        Array.isArray(block.options) &&
        block.options.length >= 2 &&
        typeof block.correct === 'number' &&
        block.correct >= 0 &&
        block.correct < block.options.length
      );
    }
    return false;
  });

  if (validBlocks.length === 0) return null;
  return { ...data, blocks: validBlocks };
}

// ── The Hook ──────────────────────────────────────────────────────────────────

export function useStudyGenerator() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [studyData, setStudyData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Track the latest request so stale responses can't overwrite newer ones.
  const latestRequestId = useRef(0);
  // Keep a ref to the current AbortController for cancellation.
  const abortControllerRef = useRef(null);

  const generate = useCallback(async (userText) => {
    if (!userText?.trim()) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Increment and capture the request ID for this invocation
    latestRequestId.current += 1;
    const thisRequestId = latestRequestId.current;

    setStatus('loading');
    setErrorMsg('');
    setStudyData(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText }),
        signal: controller.signal,
      });

      // Guard: if a newer request was fired while this one was in flight, discard.
      if (thisRequestId !== latestRequestId.current) return;

      if (!response.ok) {
        let serverMsg = 'The AI service returned an error.';
        try {
          const errJson = await response.json();
          if (errJson?.error) serverMsg = errJson.error;
        } catch {}
        throw new Error(serverMsg);
      }

      const rawJson = await response.json();

      // Guard again after the second await
      if (thisRequestId !== latestRequestId.current) return;

      const validated = validateStudyData(rawJson);

      if (!validated) {
        throw new Error(
          'The AI returned an unexpected format. Please try again or rephrase your input.'
        );
      }

      setStudyData(validated);
      setStatus('success');
    } catch (err) {
      // Guard: discard errors from stale requests
      if (thisRequestId !== latestRequestId.current) return;

      if (err.name === 'AbortError') return; // intentionally cancelled

      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setStudyData(null);
    setErrorMsg('');
  }, []);

  return { status, studyData, errorMsg, generate, reset };
}
