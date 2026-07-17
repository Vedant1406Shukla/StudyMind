'use client';

import { useState, useCallback } from 'react';
import styles from './Flashcard.module.css';

export default function Flashcard({ front, back, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasBeenFlipped, setHasBeenFlipped] = useState(false);

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    setHasBeenFlipped(true);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    },
    [flip]
  );

  return (
    <div
      className={`${styles.cardOuter} animate-fade-in`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={`${styles.scene} ${isFlipped ? styles.flipped : ''}`}
        onClick={flip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${index + 1}: ${isFlipped ? 'showing answer, press to flip back' : 'showing question, press to reveal answer'}`}
        aria-pressed={isFlipped}
      >
        {/* Front */}
        <div className={`${styles.face} ${styles.front}`}>
          <div className={styles.label}>
            <span className="badge badge-purple">Question</span>
            <span className={styles.cardNum}>#{index + 1}</span>
          </div>
          <p className={styles.text}>{front}</p>
          <div className={styles.flipHint}>
            {!hasBeenFlipped && (
              <span className={styles.tapHint}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.42z"/>
                </svg>
                Tap to reveal
              </span>
            )}
          </div>
        </div>

        {/* Back */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.label}>
            <span className="badge badge-success">Answer</span>
            <span className={styles.cardNum}>#{index + 1}</span>
          </div>
          <p className={styles.text}>{back}</p>
          <div className={styles.flipHint}>
            <span className={styles.tapHint}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
              Tap to flip back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
