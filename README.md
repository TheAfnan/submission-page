# SPIRIT 3.0 – Buildathon: Project Submission Portal

Official, standalone, integration-ready project submission portal for **SPIRIT 3.0 – Buildathon**, organized by **Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow**.

Designed to visually and architecturally match the live SPIRIT event website:  
🔗 [https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon](https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon)

---

## 🚀 Key Features & Highlights

- **Aesthetic Precision**: Implements the identical dark palette (`#08090c`, `#0d0f14`, `#12141b`), brand crimson/coral highlights (`#e4232e`, `#f4695e`), Archivo/Space Grotesk typography, red eyebrows, and rounded pill badges.
- **Integration-Ready & Conflict-Free**: All component styles are isolated using scoped CSS Modules. No destructive global CSS resets or style bleed that could impact the host site.
- **Section 01 — Team Details**:
  - Team Name, College/University, City/State.
  - Team Leader full name, validated email, and 10-digit mobile number.
  - Dynamic member addition and removal with configurable minimum and maximum team sizes.
  - Automatic duplicate email detection across team members.
- **Section 02 — Project Details**:
  - Project Title & Selected Competition Theme: *Assistive Technology*, *Fintech & Security*, or *Open Innovation*.
  - Problem Statement, Proposed Solution, Project Overview, Key Features, and Target Users/Impact text areas with real-time character counters.
  - Interactive Tech Stack & Tools tag picker (supports quick suggestion chips and custom entries).
  - Innovation & Uniqueness description and Current Implementation Status selector.
- **Section 03 — Mandatory & Optional Deliverables**:
  - **Project Presentation (8–10 Slides)**: Validated for PPT, PPTX, or PDF format with file size checking and strict 8–10 slide compliance guidance.
  - **Complete Source Code (.zip)**: Accepts ZIP archives containing project source code and README. Rejects unsupported formats.
  - **GitHub Repository URL**: Validates HTTPS GitHub repository links.
  - **Live Project Demo**: Validates HTTPS live web/mobile deployment links.
  - **Demo Video URL (Optional)**: Clearly labeled as non-mandatory, accepting YouTube, Loom, or Google Drive links without blocking submission.
- **Section 04 — Declarations & Final Review**:
  - Three mandatory compliance checkboxes (accuracy, code originality/permissions, and 8–10 slide rule agreement).
  - Pre-submission verification modal allowing participants to inspect all filled information before locking in.
- **Submission Confirmation State**:
  - Displays verified Submission ID (`SP3-BTH-2026-XXXXX`), project title, team name, timestamp, and next steps.
  - One-click copyable Submission ID with visual feedback.
  - Downloadable JSON submission receipt for participant proof of entry.
  - Direct navigation back to the official event page.
- **Robust Error Recovery**:
  - Never clears or resets form inputs when an API request fails.
  - Displays user-friendly error banners with one-click retry.
- **Demo & Production Modes**:
  - Explicit Demo Mode for offline development, local verification, and testing with simulated progress phases.
  - Production Mode connects directly to your backend API via `multipart/form-data` and **never** generates fake success responses.

---

## 📦 Tech Stack & Dependencies

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: CSS Modules + CSS Variables matching DSMNRU SPIRIT design system
- **Icons**: [lucide-react](https://lucide.dev/)
- **Visuals**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Testing**: Vitest + @testing-library/react + jsdom

---

## 🛠️ Installation & Local Development

### 1. Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm or pnpm or yarn

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/spirit-submission-portal.git
cd spirit-submission-portal

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```

Available environment variables:
```env
# Set to 'demo' for local testing or 'production' for live submissions
VITE_APP_MODE=demo

# Base URL of your backend submission service
VITE_API_BASE_URL=https://api.spirit-dsmnru.vercel.app

# Submission deadline (ISO 8601 with timezone offset)
VITE_SUBMISSION_DEADLINE=2026-10-24T23:59:59+05:30

# URL to the main event page
VITE_EVENT_URL=https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

Run the test suite verifying required field validation, file type/size validation, duplicate email checks, and API error handling:
```bash
npm test
```

---

## 🏗️ Production Build

Generate the production bundle:
```bash
npm run build
```
The optimized output will be created in the `dist/` directory.

---

## 🔌 Integration Instructions for Host Developers

To integrate this portal into the main DSMNRU website (e.g., at `/events/spirit-3-0-buildathon/submit`):

1. Consult [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md) for Next.js (App Router or Pages Router) mounting instructions.
2. Consult [`API_SPECIFICATION.md`](./API_SPECIFICATION.md) for the backend `POST /api/submissions` contract, payload schemas, and S3 object storage recommendations.

---

## 📄 License & Credits

Built for **SPIRIT 3.0 – Buildathon**, organized by the **SPIRIT Community** at **Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow**.
