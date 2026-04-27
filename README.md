# NGO OS: Humanitarian Intelligence Command Center

![NGO OS Banner](https://via.placeholder.com/1000x200/0b0f1a/06d6f2?text=NGO+OS+HUMANITARIAN+INTELLIGENCE)

**NGO OS** is an advanced, AI-driven case management and intelligence platform designed for humanitarian organizations, field responders, and NGO executives. It transforms raw field reports into structured, actionable intelligence, enabling rapid decision-making in crisis environments.

---

## 🌟 Core Features

### 1. Gemini AI Case Engine (Intelligence Ingestion)
Powered by Google's latest **Gemini 1.5 Flash** model, the intelligence engine automatically ingests unstructured field reports and securely extracts:
*   **Risk & Severity Analysis**: Calculates a 0-100 Risk Score, Severity level, and Operational Urgency.
*   **Resource Mapping**: Automatically identifies required materials, optimal personnel skills, and volunteer profiles.
*   **Decision Intelligence**: Generates a prioritized list of immediate, short-term, and follow-up actions.
*   **Outcome Simulation**: Predicts strategic impact if actions are followed and provides "Red Flag" escalation warnings if ignored.

### 2. High-Fidelity "Liquid-Glass" Command Center UI
A premium, dark-themed SaaS operational dashboard heavily inspired by Palantir and Linear. Built for high-stress environments. Features include:
*   **Liquid-Glass Architecture**: Deep frosted glass, backdrop blur, smooth hover micro-interactions, and neon gradient accents (Cyan/Purple/Emerald/Rose).
*   **Threat Radar & Risk Monitor**: Live animated radar sweeps with pulsing priority alerts and dynamic severity cards.
*   **Data-Rich Analytics**: Integrated **Recharts** for real-time visual area charts, categorization pie charts, and animated count-up metrics.
*   **Optimistic UI Updates**: Instantaneous interaction for case approvals, feedback logging, and system configurations.

### 3. Ultra-Dense Intelligence Briefs (PDF)
A bulletproof, one-page PDF generator that produces executive-ready intelligence briefs. Features include:
*   **Vector Charts**: Custom-drawn impact dashboards, risk gauges, and severity bars.
*   **Strict Layout**: Mathematically aligned, single-page format guaranteeing zero data overflow, ensuring perfect readability in the field.

### 4. Zero-Downtime Architecture & Demo Mode
Built for unpredictable field environments, the system utilizes a **Dual-Persistence Layer**:
*   **Tier 1 (MongoDB)**: Primary cloud/local database for centralized case management and history.
*   **Tier 2 (LocalDB)**: Automatic fallback to a local JSON storage engine. If MongoDB goes offline, the UI adapts seamlessly without throwing errors.
*   **AI Demo Mode**: If the Gemini API key is missing or invalid, the platform gracefully switches to an intelligent keyword-based simulated NLP engine, guaranteeing the app NEVER breaks during demonstrations.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (with custom liquid-glass utilities)
*   **Animations**: Framer Motion
*   **Data Visualization**: Recharts
*   **Database**: MongoDB (Mongoose) + Local JSON Fallback
*   **AI Engine**: Google Generative AI (`@google/generative-ai`)
*   **Document Generation**: PDFKit

---

## 🚀 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Google Gemini API Key (Optional for Demo Mode, Required for full AI)

### 1. Clone & Install
```bash
git clone <repository-url>
cd hackathon
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/ngoos
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Command Center
```bash
npm run dev
```
Navigate to `http://localhost:3000` (or `http://localhost:3001` if port is in use) to access the NGO OS Dashboard.

---

## 📖 Operational Workflow

1.  **Ingest**: Field officers submit raw text reports via the dashboard.
2.  **Analyze**: The Gemini AI Engine securely processes the text, generating a structured Intelligence Object.
3.  **Review**: Operational Leads review the AI's Recommended Actions and approve them via the UI.
4.  **Execute & Update**: Ground teams execute the actions and submit Field Feedback.
5.  **Track**: Risk levels and analytics update in real-time on the Recharts-powered dashboard.
6.  **Export**: Commanders generate the **One-Page Intelligence Brief (PDF)** for official record-keeping.

---

## 🔒 Security & Data Ethics
*   **Privacy-First Processing**: The Gemini API calls are securely masked server-side in Next.js to protect the API keys.
*   **Local Resilience**: Field data is never lost due to connection drops, thanks to the LocalDB fallback system.

---
*Developed as a high-impact humanitarian technology solution.*
