import './globals.css';

export const metadata = {
  title: 'StudyMind — AI-Powered Study Assistant',
  description:
    'Paste your notes or any topic and let StudyMind generate interactive flashcards and quizzes powered by AI.',
  keywords: ['study assistant', 'flashcards', 'quiz', 'AI learning', 'spaced repetition'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
