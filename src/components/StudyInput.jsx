'use client';

import { useState } from 'react';
import styles from './StudyInput.module.css';

const PLACEHOLDER = `Paste your notes or describe a topic here…

Examples:
• "The mitochondria is the powerhouse of the cell. It produces ATP through cellular respiration…"
• "World War 2: key causes, major battles, turning points, and the end of the war in 1945."
• "Python list comprehensions, lambda functions, decorators, and generators."`;

export default function StudyInput({ onGenerate, isLoading }) {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);

  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    setCharCount(val.length);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onGenerate(text);
    }
  }

  function handleKeyDown(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  const canSubmit = text.trim().length >= 10 && !isLoading;
  const isNearLimit = charCount > 5000;

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Study input form">
      <div className={styles.textareaWrapper}>
        <textarea
          id="study-input"
          className={styles.textarea}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          rows={10}
          maxLength={6000}
          disabled={isLoading}
          aria-label="Enter your study notes or topic"
          aria-describedby="input-hint"
        />
        <div className={styles.textareaFooter}>
          <span id="input-hint" className={styles.hint}>
            <kbd className={styles.kbd}>Ctrl</kbd>+<kbd className={styles.kbd}>Enter</kbd> to generate
          </span>
          <span className={`${styles.charCount} ${isNearLimit ? styles.charCountWarn : ''}`}>
            {charCount.toLocaleString()} / 6,000
          </span>
        </div>
      </div>

      <button
        type="submit"
        className={`btn-primary ${styles.submitBtn}`}
        disabled={!canSubmit}
        aria-busy={isLoading}
        aria-label={isLoading ? 'Generating study set…' : 'Generate study set'}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Generating…
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Generate Study Set
          </>
        )}
      </button>
    </form>
  );
}
