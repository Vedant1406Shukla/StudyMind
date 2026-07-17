'use client';

import { useRef } from 'react';
import { useStudyGenerator } from '@/hooks/useStudyGenerator';
import StudyInput from '@/components/StudyInput';
import StudyResults from '@/components/StudyResults';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';
import styles from './page.module.css';

export default function Home() {
  const { status, studyData, errorMsg, generate, reset } = useStudyGenerator();

  // Keep a ref to the last input so the error "Try Again" button can retry
  const lastInputRef = useRef('');

  function handleGenerate(text) {
    lastInputRef.current = text;
    generate(text);
  }

  function handleRetry() {
    if (lastInputRef.current) {
      generate(lastInputRef.current);
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Background decoration ── */}
      <div className={styles.bgDecor} aria-hidden="true" />

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logo} aria-label="StudyMind logo">
          <span className={styles.logoIcon} aria-hidden="true">✦</span>
          StudyMind
        </div>
        <p className={styles.tagline}>AI-Powered Study Assistant</p>
      </header>

      {/* ── Main Content ── */}
      <main className={styles.main} id="main-content">

        {/* Hero — shown only on idle/error (no results yet) */}
        {(status === 'idle' || status === 'error') && !studyData && (
          <section className={`${styles.hero} animate-fade-in`} aria-label="Introduction">
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <span aria-hidden="true">⚡</span>
              </div>
              <h1 className={styles.heroTitle}>
                Turn <span className="gradient-text">any notes</span> into an
                interactive study set
              </h1>
              <p className={styles.heroDesc}>
                Paste your notes, a topic, or even a paragraph. StudyMind will
                generate flashcards and quiz questions you can study right in your
                browser.
              </p>
            </div>

            {/* Feature pills */}
            <div className={styles.features} aria-label="Features">
              {[
                { icon: '🃏', label: 'Flip flashcards' },
                { icon: '📝', label: 'Take quizzes' },
                { icon: '🔁', label: 'Re-test mistakes' },
              ].map((f) => (
                <div key={f.label} className={styles.feature}>
                  <span aria-hidden="true">{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Input ── */}
        {status !== 'success' && (
          <section className={styles.inputSection} aria-label="Study input">
            <StudyInput onGenerate={handleGenerate} isLoading={status === 'loading'} />
          </section>
        )}

        {/* ── Error state ── */}
        {status === 'error' && (
          <section aria-label="Error" className={styles.section}>
            <ErrorMessage message={errorMsg} onRetry={handleRetry} />
          </section>
        )}

        {/* ── Loading state ── */}
        {status === 'loading' && (
          <section aria-label="Loading" className={styles.section}>
            <LoadingState />
          </section>
        )}

        {/* ── Results ── */}
        {status === 'success' && studyData && (
          <section aria-label="Study set results" className={styles.section}>
            <StudyResults studyData={studyData} onReset={reset} />
          </section>
        )}
      </main>

 
    </div>
  );
}
