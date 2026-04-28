# Altruist: Real-Time Crisis Intelligence System

![Altruist Banner](https://via.placeholder.com/1000x200/0b0f1a/FF6B00?text=ALTRUIST+CRISIS+INTELLIGENCE)

**Altruist** is a real-time crisis intelligence system built specifically for Indian NGOs. It solves data fragmentation and delayed response by collecting scattered field data across India, surfacing the most urgent community needs in real time, and matching the right volunteers to the right districts — automatically.

Designed to transition unstructured data (like WhatsApp messages and paper surveys) into structured action, Altruist empowers field responders and NGO executives to coordinate effectively, execute rapidly, and deliver real-world impact.

---

## 🌟 The Problem We Solve

Every year, thousands of Indian NGOs collect critical community data—flood surveys, healthcare assessments, ration needs. Most of it never gets acted on. Why?
*   **Buried in Paper**: Critical surveys lost in physical files and cabinets.
*   **Scattered on WhatsApp**: Urgent needs forwarded and forgotten in group chats.
*   **Delayed Response**: Days lost organizing data while situations escalate.
*   **Unused Volunteers**: Willing helpers unable to find where they are needed most.

**Altruist closes that gap** by acting as a high-fidelity command center tailored for low-bandwidth environments.

---

## ⚙️ Core System Architecture: Chaos → Intelligence → Resolution

1.  **Ingest (Collect & Ingest)**: Pulls data from fragmented sources (WhatsApp, Voice, Paper) securely via Multilingual OCR and smart extraction.
2.  **Analyze (AI Prioritization)**: Google's **Gemini 1.5 Flash** model ranks urgency based on severity, frequency, and district-level metrics.
3.  **Resolve (Match & Execute)**: Algorithmic pairing of registered helpers based on required skills and distance.

---

## ⚡ Platform Capabilities

*   **Real-Time India Impact Map**: Live geospatial visualization of district-level needs and active resources (Focusing on regions like West Bengal, Bihar, and Odisha).
*   **Multilingual OCR & Upload**: Instantly process physical surveys and voice notes in regional Indian languages.
*   **Smart Prioritization Engine**: AI calculates Risk Scores, Severity levels, and Operational Urgency.
*   **Volunteer Matching Engine**: Algorithmic pairing of volunteers to tasks based on skills and geolocation.
*   **Automated Report Generator**: One-click generation of comprehensive, donor-ready PDF briefs for transparency.
*   **Feedback Intelligence Loop**: Continuous learning system improving responses from ground-level NGO feedback.

---

## 🖥️ High-Fidelity Command Center UI

A premium, dark-themed SaaS operational dashboard built for high-stress environments.
*   **Glassmorphic Aesthetics**: Deep frosted glass, backdrop blur, smooth hover micro-interactions, and Saffron/Green gradient accents reflecting the Indian context.
*   **Threat Radar & Risk Monitor**: Live animated radar sweeps with pulsing priority alerts and dynamic severity cards.
*   **Data-Rich Analytics**: Integrated **Recharts** for real-time visual area charts, categorization pie charts, and animated count-up metrics.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (with Saffron & Green accents)
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
Navigate to `http://localhost:3000` to access the Altruist Dashboard.

---

## 🔒 Resilience & Security
*   **Dual-Persistence Layer**: Utilizes a fallback to a local JSON storage engine if MongoDB drops, ensuring zero-downtime in unpredictable field environments.
*   **AI Demo Mode**: Gracefully switches to an intelligent keyword-based simulated NLP engine if the Gemini API key is missing.
*   **Privacy-First Processing**: Gemini API calls are securely masked server-side to protect keys and PII.

---
*Built around real-world NGO workflows across India — including flood surveys, healthcare needs, and ration distribution systems.*
