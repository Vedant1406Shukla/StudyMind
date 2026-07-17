'use client';

import { useState } from 'react';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import styles from './StudyResults.module.css';

export default function StudyResults({ studyData, onReset }) {
  const flashcards = studyData.blocks.filter((b) => b.blockType === 'flashcard');
  const quizQuestions = studyData.blocks.filter((b) => b.blockType === 'quiz_question');

  const hasBoth = flashcards.length > 0 && quizQuestions.length > 0;
  const [activeTab, setActiveTab] = useState(
    flashcards.length > 0 ? 'flashcards' : 'quiz'
  );

  return (
    <div className={`${styles.container} animate-slide-up`}>
      {/* ── Header ────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
              ✦ Study Set Ready
            </span>
            <h2 className={styles.title}>{studyData.title}</h2>
          </div>
          <button
            className={`btn-secondary ${styles.resetBtn}`}
            onClick={onReset}
            aria-label="Generate a new study set"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/>
            </svg>
            New Topic
          </button>
        </div>

        {/* Stats pills */}
        <div className={styles.stats}>
          {flashcards.length > 0 && (
            <span className={styles.stat}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z"/>
              </svg>
              {flashcards.length} Flashcard{flashcards.length !== 1 ? 's' : ''}
            </span>
          )}
          {quizQuestions.length > 0 && (
            <span className={styles.stat}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              {quizQuestions.length} Quiz Question{quizQuestions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Tabs (only when both types are present) */}
        {hasBoth && (
          <div className={styles.tabs} role="tablist" aria-label="Study mode selection">
            <button
              className={`${styles.tab} ${activeTab === 'flashcards' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('flashcards')}
              role="tab"
              aria-selected={activeTab === 'flashcards'}
              aria-controls="panel-flashcards"
              id="tab-flashcards"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z"/>
              </svg>
              Flashcards
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'quiz' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('quiz')}
              role="tab"
              aria-selected={activeTab === 'quiz'}
              aria-controls="panel-quiz"
              id="tab-quiz"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              Quiz
            </button>
          </div>
        )}
      </div>

      {/* ── Content panels ──────────────────────────────────────── */}
      {(!hasBoth || activeTab === 'flashcards') && flashcards.length > 0 && (
        <div
          className={styles.panel}
          id="panel-flashcards"
          role="tabpanel"
          aria-labelledby="tab-flashcards"
        >
          <div className={styles.cardGrid}>
            {flashcards.map((card, i) => (
              <Flashcard
                key={i}
                front={card.front}
                back={card.back}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {(!hasBoth || activeTab === 'quiz') && quizQuestions.length > 0 && (
        <div
          className={styles.panel}
          id="panel-quiz"
          role="tabpanel"
          aria-labelledby="tab-quiz"
        >
          <Quiz questions={quizQuestions} />
        </div>
      )}
    </div>
  );
}
