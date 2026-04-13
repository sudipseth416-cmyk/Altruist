# NGO OS — AI Humanitarian Decision System

An AI-powered operational dashboard for humanitarian organizations. Upload field reports, receive real-time AI-driven analysis, make informed decisions with confidence scoring, and track humanitarian impact — all from a single command center.

![NGO OS Dashboard](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)

---

## ✨ Features

- **Data Upload Panel** — Drag-and-drop file upload (PDF, images, CSV, text) + free-text field reports
- **AI Analysis Engine** — Sends field data to an AI model (OpenAI-compatible) with a specialized humanitarian system prompt
- **Structured Results** — Detected issues with severity, priority scoring, recommended actions, risk alerts, and AI explanation
- **Human Decision Panel** — Confidence gauge, decision notes, and Approve / Modify / Reject workflow
- **Impact Overview** — Animated metrics for people affected, tasks generated, regions impacted, response time
- **Live Activity Feed** — Real-time event timeline
- **Toast Notifications** — Contextual success/error feedback
- **Intelligent Fallback** — Keyword-based analysis when no API key is configured (demo mode)

## 🏗️ Project Structure

```
d:\hackathon\
├── .env.local                    # API keys (gitignored)
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Custom theme (colors, animations)
├── postcss.config.mjs            # PostCSS + Tailwind
├── tsconfig.json                 # TypeScript config
├── package.json
│
└── src/
    ├── app/
    │   ├── layout.tsx            # Root layout + SEO metadata
    │   ├── page.tsx              # Main dashboard (state orchestrator)
    │   ├── globals.css           # Design system (glassmorphism, buttons, etc.)
    │   │
    │   └── api/
    │       ├── analyze/
    │       │   └── route.ts      # AI analysis endpoint
    │       └── decision/
    │           └── route.ts      # Decision submission endpoint
    │
    ├── components/
    │   ├── Sidebar.tsx           # Collapsible navigation sidebar
    │   ├── Header.tsx            # Top bar (search, status, user)
    │   ├── DataUploadPanel.tsx   # File upload + text input
    │   ├── AIResultsPanel.tsx    # AI results with gauges & cards
    │   ├── HumanDecisionPanel.tsx # Decision making UI
    │   └── ImpactPanel.tsx       # Impact metrics + activity feed
    │
    └── lib/
        └── types.ts              # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (tested with v24)
- **npm** 9+

### Installation

```bash
# Clone or navigate to the project
cd d:\hackathon

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configure AI (Optional)

The app works out of the box with an intelligent keyword-based fallback. To enable real AI analysis:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Edit `.env.local`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the dev server

The API route supports any OpenAI-compatible endpoint (Azure OpenAI, local LLMs via LM Studio, etc.) by setting `OPENAI_API_URL`.

## 🔌 API Routes

### `POST /api/analyze`

Analyzes humanitarian field data using AI.

**Request:**
```json
{
  "text": "Flooding has displaced 15,000 people...",
  "fileName": "field_report.pdf"
}
```

**Response:** `AnalysisResult` with:
| Field | Type | Description |
|-------|------|-------------|
| `detectedIssues` | `Issue[]` | Issues with severity & category |
| `priorityScore` | `number` | 0-100 urgency score |
| `recommendedActions` | `Action[]` | Actionable recommendations |
| `riskAlerts` | `Risk[]` | Cascading risk warnings |
| `explanation` | `string` | Plain-English AI summary |
| `confidenceScore` | `number` | 0-100 AI self-confidence |
| `impactEstimate` | `Impact` | People, tasks, regions |

### `POST /api/decision`

Records human decisions on AI analyses.

**Request:**
```json
{
  "analysisId": "analysis-123",
  "decision": "approve",
  "notes": "Proceed with water purification deployment"
}
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `ngo-dark-900` | `#0a0e1a` | Page background |
| `ngo-accent` | `#34d399` | Primary accent (emerald) |
| `ngo-cyan` | `#22d3ee` | Secondary accent |
| `ngo-amber` | `#fbbf24` | Warnings & modify actions |
| `ngo-rose` | `#fb7185` | Alerts & reject actions |

Components use `.glass-card`, `.btn-primary`, `.btn-danger`, `.btn-outline`, `.input-field`, `.badge-*`, and `.icon-box-*` utility classes.

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.5
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **AI:** OpenAI-compatible API (GPT-4o-mini default)

## 📄 License

MIT
