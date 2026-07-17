'use client';

import styles from './LoadingState.module.css';

export default function LoadingState() {
  return (
    <div className={`${styles.container} animate-fade-in`} aria-busy="true" aria-label="Generating your study set…">
      {/* Header skeleton */}
      <div className={styles.headerSkeleton}>
        <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonSub}`} />
      </div>

      {/* Card skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${styles.cardSkeleton} glass-card`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className={styles.cardSkeletonInner}>
            <div className={`${styles.skeleton} ${styles.skeletonBadgeSm}`} />
            <div className={styles.skeletonLines}>
              <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLineFull}`} />
              <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLine80}`} />
              <div className={`${styles.skeleton} ${styles.skeletonLine} ${styles.skeletonLine60}`} />
            </div>
          </div>
        </div>
      ))}

      <p className={styles.hint}>
        <span className={styles.dots} aria-hidden="true">
          <span /><span /><span />
        </span>
        AI is generating your study set…
      </p>
    </div>
  );
}
