# StudyMind — AI-Powered Study Assistant

> Paste your notes or any topic. Get interactive flashcards and a quiz — instantly.

---
<img width="1917" height="1075" alt="Screenshot 2026-07-17 091221" src="https://github.com/user-attachments/assets/f896cd71-7314-414a-98a9-90618b04ffbe" /> <br>
<img width="1437" height="965" alt="Screenshot 2026-07-17 093820" src="https://github.com/user-attachments/assets/c97aca71-a498-4bf9-8937-eb7b0592308e" /> <br>
<img width="1917" height="951" alt="Screenshot 2026-07-17 094836" src="https://github.com/user-attachments/assets/0bb9ca6a-2d0a-49fd-8c65-89a6deff4326" /> <br>
<img width="1917" height="862" alt="Screenshot 2026-07-17 094848" src="https://github.com/user-attachments/assets/8668c0a2-d4e3-44f5-af4d-cb2e615d8105" />

## ✨ Features

- **Free-form text input** — paste notes, a topic, or a paragraph
- **AI-generated study sets** — flashcards and quiz questions powered by GPT-4o Mini via OpenRouter
- **Interactive flashcards** — click to flip with a 3D animation
- **Quizzes with scoring** — select answers, submit, and see your score
- **Re-test wrong answers** — automatically retry incorrectly answered questions
- **Robust error handling** — handles malformed JSON, empty responses, and API/network failures gracefully
- **Race condition protection** — stale AI responses never overwrite newer requests
- **Keyboard navigation** — `Ctrl + Enter` to generate, `Space` / `Enter` to flip flashcards
- **Responsive UI** — optimized for desktop, tablet, and mobile devices
- **Modern glassmorphism design** — dark theme with smooth animations

---

# 🚀 Setup

## Prerequisites

- Node.js 18+
- npm
- OpenRouter API Key

---

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd study-assistant
```

---

## 2. Install dependencies

```bash
npm install
npm install openai
```

---

## 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
OPENAI_API_KEY=your_openrouter_api_key
```

Obtain a free API key from:

**https://openrouter.ai/**

---

## 4. Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

in your browser.

---

# 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.js        # Server-side OpenRouter API integration
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   ├── page.js                 # Main page
│   └── page.module.css
│
├── components/
│   ├── StudyInput.jsx
│   ├── StudyResults.jsx
│   ├── Flashcard.jsx
│   ├── Quiz.jsx
│   ├── LoadingState.jsx
│   └── ErrorMessage.jsx
│
└── hooks/
    └── useStudyGenerator.js
```

---

# 🤖 AI Usage

### AI used during development

- OpenAI GPT models (through Cursor AI) were used to assist with:
  - Component scaffolding
  - CSS refinements
  - API integration
  - Code review
  - Documentation

All architectural decisions, UI design, application flow, prompt engineering, and error handling logic were implemented, verified, and refined manually.

---

### Runtime Model

The application uses **OpenRouter** with the **OpenAI SDK**.

**Provider**

OpenRouter

**Model**

```
openai/gpt-4o-mini
```

Configured in:

```
src/app/api/generate/route.js
```

using

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
```

---

# ⚠️ Known Limitations

1. AI responses depend on model availability and OpenRouter service status.
2. Very large inputs are truncated to reduce token usage.
3. Designed primarily for English-language study material.
4. No persistent storage (database/localStorage) is implemented.
5. Free-tier API rate limits may temporarily reject requests.
6. Generated content should always be reviewed before academic use.

---

# ⏱️ Time Spent

| Task | Time |
|------|------:|
| Planning & Architecture | 20 min |
| Next.js Setup & API | 30 min |
| Custom Hook & Error Handling | 40 min |
| Flashcard Component | 30 min |
| Quiz Component | 45 min |
| UI Styling & Animations | 60 min |
| Integration & Testing | 50 min |
| Documentation | 20 min |
| **Total** | **~5.5 Hours** |

---

# 🛠️ Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **OpenAI JavaScript SDK**
- **OpenRouter API**
- **GPT-4o Mini**
- **CSS Modules**
- **Google Fonts (Inter & Space Grotesk)**

---

# 📌 Environment Variable

```
OPENAI_API_KEY=your_openrouter_api_key
```

---

# 📄 License

This project was developed as part of a frontend internship assignment for educational and evaluation purposes.
