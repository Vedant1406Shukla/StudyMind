'use client';

import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className={`${styles.container} animate-fade-in`}
      role="alert"
      aria-live="assertive"
      aria-label="Error message"
    >
      <div className={styles.icon} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>Something went wrong</h3>
        <p className={styles.message}>{message}</p>
      </div>

      {onRetry && (
        <button
          className={`btn-secondary ${styles.retryBtn}`}
          onClick={onRetry}
          aria-label="Retry the previous request"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}
