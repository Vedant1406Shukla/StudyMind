'use client';

import { useState, useCallback, useId } from 'react';
import styles from './Quiz.module.css';

const ALPHABET = ['A', 'B', 'C', 'D'];

function QuizQuestion({ question, options, correct, explanation, index, onAnswer, userAnswer, submitted }) {
  const answered = submitted && userAnswer !== null && userAnswer !== undefined;
  const isCorrect = answered && userAnswer === correct;

  function getOptionState(optIdx) {
    if (!submitted) {
      return userAnswer === optIdx ? 'selected' : 'default';
    }
    if (optIdx === correct) return 'correct';
    if (optIdx === userAnswer && !isCorrect) return 'wrong';
    return 'dimmed';
  }

  return (
    <div className={`${styles.question} animate-fade-in`} style={{ animationDelay: `${index * 70}ms` }}>
      <div className={styles.questionHeader}>
        <span className="badge badge-purple">Q{index + 1}</span>
        {answered && (
          <span className={`badge ${isCorrect ? 'badge-success' : 'badge-error'}`}>
            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
        )}
      </div>

      <p className={styles.questionText}>{question}</p>

      <div className={styles.options} role="radiogroup" aria-label={`Options for question ${index + 1}`}>
        {options.map((opt, optIdx) => {
          const state = getOptionState(optIdx);
          return (
            <button
              key={optIdx}
              className={`${styles.option} ${styles[`option_${state}`]}`}
              onClick={() => !answered && onAnswer(index, optIdx)}
              disabled={answered}
              aria-label={`Option ${ALPHABET[optIdx]}: ${opt}`}
              aria-pressed={userAnswer === optIdx}
            >
              <span className={styles.optionLetter}>{ALPHABET[optIdx]}</span>
              <span className={styles.optionText}>{opt}</span>
              {answered && optIdx === correct && (
                <span className={styles.optionIcon} aria-hidden="true">✓</span>
              )}
              {answered && optIdx === userAnswer && !isCorrect && (
                <span className={styles.optionIcon} aria-hidden="true">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {answered && explanation && (
        <div className={styles.explanation} role="note" aria-label="Explanation">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function Quiz({ questions }) {
  // answers: array where answers[i] = chosen option index, or undefined if not answered
  const [answers, setAnswers] = useState(() => new Array(questions.length).fill(undefined));
  const [submitted, setSubmitted] = useState(false);
  const [retestMode, setRetestMode] = useState(false);
  const [retestIndices, setRetestIndices] = useState([]);

  const handleAnswer = useCallback((qIdx, optIdx) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }, []);

  const allAnswered = answers.every((a) => a !== undefined);

  function handleSubmit() {
    setSubmitted(true);
  }

  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  function handleRetest() {
    // Only re-test questions that were answered incorrectly
    const wrong = questions.reduce((acc, q, i) => {
      if (answers[i] !== q.correct) acc.push(i);
      return acc;
    }, []);
    setRetestIndices(wrong);
    setAnswers(new Array(questions.length).fill(undefined));
    setSubmitted(false);
    setRetestMode(true);
    // Scroll to top of quiz
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleRestart() {
    setAnswers(new Array(questions.length).fill(undefined));
    setSubmitted(false);
    setRetestMode(false);
    setRetestIndices([]);
  }

  const displayQuestions = retestMode
    ? retestIndices.map((i) => ({ ...questions[i], originalIdx: i }))
    : questions.map((q, i) => ({ ...q, originalIdx: i }));

  const displayAnswers = displayQuestions.map((q) => answers[q.originalIdx]);

  return (
    <div className={styles.quiz}>
      {retestMode && (
        <div className={styles.retestBanner}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          <span>Re-testing {retestIndices.length} incorrect answer{retestIndices.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {displayQuestions.map((q, displayIdx) => (
        <QuizQuestion
          key={`${retestMode ? 'retest' : 'full'}-${q.originalIdx}`}
          question={q.question}
          options={q.options}
          correct={q.correct}
          explanation={q.explanation}
          index={displayIdx}
          onAnswer={(_, optIdx) => handleAnswer(q.originalIdx, optIdx)}
          userAnswer={displayAnswers[displayIdx]}
          submitted={submitted}
        />
      ))}

      {!submitted && (
        <button
          className={`btn-primary ${styles.submitBtn}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
          aria-label={allAnswered ? 'Submit quiz answers' : 'Answer all questions to submit'}
        >
          {allAnswered ? 'Submit Answers' : `${answers.filter(a => a !== undefined).length} / ${displayQuestions.length} answered`}
        </button>
      )}

      {submitted && (
        <div className={`${styles.results} animate-bounce-in`}>
          <div className={styles.scoreRing} aria-label={`Score: ${score} out of ${questions.length}`}>
            <svg viewBox="0 0 100 100" className={styles.ring} aria-hidden="true">
              <circle className={styles.ringBg} cx="50" cy="50" r="40" />
              <circle
                className={styles.ringFill}
                cx="50"
                cy="50"
                r="40"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                style={{
                  stroke: percentage >= 70 ? 'var(--success)' : percentage >= 40 ? 'var(--warning)' : 'var(--error)'
                }}
              />
            </svg>
            <div className={styles.scoreText}>
              <span className={styles.scorePercent}>{percentage}%</span>
              <span className={styles.scoreLabel}>{score}/{questions.length}</span>
            </div>
          </div>

          <div className={styles.resultsInfo}>
            <h3 className={styles.resultsTitle}>
              {percentage === 100 ? '🎉 Perfect Score!' : percentage >= 70 ? '👏 Great Job!' : percentage >= 40 ? '📚 Keep Studying' : '💪 Try Again'}
            </h3>
            <p className={styles.resultsSubtitle}>
              You got {score} out of {questions.length} questions correct.
            </p>

            <div className={styles.resultsBtns}>
              {score < questions.length && (
                <button className="btn-primary" onClick={handleRetest}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                  </svg>
                  Re-test Wrong Answers
                </button>
              )}
              <button className="btn-secondary" onClick={handleRestart}>
                Restart Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
