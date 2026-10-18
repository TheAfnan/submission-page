# SPIRIT 3.0 – Buildathon: Developer Integration Guide

This guide is written specifically for the developer integrating this submission portal into the official **SPIRIT Community Website** (hosted at `https://spirit-dsmnru.vercel.app/`).

---

## 1. Architecture & Design Alignment

This module has been specifically engineered to drop into the existing SPIRIT codebase without conflicts:

- **100% Theme Match**: Uses the exact CSS tokens from the live SPIRIT site:
  - Deep dark background: `#08090c`, `#0d0f14`, `#12141b`
  - Brand accents: Crimson `#e4232e`, Coral `#f4695e`, Soft Pink `#f6c9c2`
  - Fonts: `Archivo` for editorial headings and `Space Grotesk` for numbers/body
  - Visual hierarchy: small uppercase red eyebrows (`— EVENT DETAILS`), rounded pill buttons, dark rounded cards with subtle borders.
- **Style Isolation via CSS Modules**: All component styles are isolated using CSS Modules (`*.module.css`). There are **no global CSS resets** or destructive global tags that could interfere with the host website's header, navigation, or footer.
- **Self-Contained Module**: You can mount the component on any route (such as `/events/spirit-3-0-buildathon/submit`).

---

## 2. Recommended Integration Options

### Option A: Next.js App Router (Recommended for `spirit-dsmnru.vercel.app`)

If the host website is built with Next.js App Router:

1. Copy the `src/` directory into your project under `components/submission-portal/` (or copy the needed folders `components/`, `types/`, `services/`, `validation/`, and `theme/`).
2. Install the lightweight dependencies in your host project:
   ```bash
   npm install lucide-react canvas-confetti
   npm install -D @types/canvas-confetti
   ```
3. Create the route page file at `app/(site)/events/[slug]/submit/page.tsx` or `app/(site)/events/spirit-3-0-buildathon/submit/page.tsx`:

```tsx
// app/(site)/events/spirit-3-0-buildathon/submit/page.tsx
'use client'

import React from 'react'
import { SpiritSubmissionPortal } from '@/components/submission-portal/components/SpiritSubmissionPortal'

export default function SpiritSubmissionPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08090c' }}>
      <SpiritSubmissionPortal
        mode={process.env.NEXT_PUBLIC_APP_MODE === 'production' ? 'production' : 'demo'}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}
        submissionDeadline="2026-10-24T23:59:59+05:30"
        maxTeamSize={4}
        minTeamSize={1}
        backToEventUrl="/events/spirit-3-0-buildathon"
        onSuccess={(result) => {
          // Optional: Analytics tracking, redirect, or notifications
          console.log('Submission ID generated:', result.submissionId)
        }}
        onError={(err) => {
          console.error('Submission failed:', err.message)
        }}
      />
    </main>
  )
}
```

---

### Option B: Next.js Pages Router

If the host website uses Next.js Pages Router:

1. Copy the component files into `components/submission-portal/`.
2. Create `pages/events/spirit-3-0-buildathon/submit.tsx`:

```tsx
// pages/events/spirit-3-0-buildathon/submit.tsx
import React from 'react'
import Head from 'next/head'
import { SpiritSubmissionPortal } from '@/components/submission-portal/components/SpiritSubmissionPortal'

export default function SubmissionPage() {
  return (
    <>
      <Head>
        <title>Project Submission | SPIRIT 3.0 – Buildathon | DSMNRU</title>
        <meta
          name="description"
          content="Official submission portal for SPIRIT 3.0 – Buildathon Round 1"
        />
      </Head>
      <SpiritSubmissionPortal
        mode={process.env.NEXT_PUBLIC_APP_MODE === 'production' ? 'production' : 'demo'}
        apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL || ''}
        submissionDeadline="2026-10-24T23:59:59+05:30"
        backToEventUrl="/events/spirit-3-0-buildathon"
      />
    </>
  )
}
```

---

### Option C: Standalone Deployment / Reverse Proxy

You can also build this project standalone using Vite:
```bash
npm run build
```
This generates a static production bundle in `dist/`, which can be served independently or routed behind your reverse proxy / Vercel rewrite at `/events/spirit-3-0-buildathon/submit`.

---

## 3. Configuration & Props Reference

The `SpiritSubmissionPortal` component accepts the following configurable props:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'demo' \| 'production'` | `'demo'` | In demo mode, submissions are simulated locally with progress and formatted IDs. In production mode, real `fetch()` calls are made. |
| `apiBaseUrl` | `string` | `VITE_API_BASE_URL` | Base URL for the submission API. |
| `submissionDeadline` | `string` (ISO 8601) | `'2026-10-24T23:59:59+05:30'` | Event deadline used by the countdown timer. |
| `maxTeamSize` | `number` | `4` | Maximum allowable team members (configurable per organizer policy). |
| `minTeamSize` | `number` | `1` | Minimum allowable team members. |
| `maxPresentationSizeBytes` | `number` | `26214400` (25MB) | Max size for PPT/PDF presentation file. |
| `maxZipSizeBytes` | `number` | `52428800` (50MB) | Max size for source code ZIP file. |
| `eventTitle` | `string` | `'SPIRIT 3.0 – Buildathon'` | Event title displayed in header and banner. |
| `roundTitle` | `string` | `'Round 1 – Idea Screening & PPT Submission'` | Current competition round. |
| `eventDate` | `string` | `'24 October 2026'` | Date of the hackathon event. |
| `backToEventUrl` | `string` | `'https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon'` | URL for the "Back to Event" button. |
| `onSuccess` | `(result: SubmissionResult) => void` | `undefined` | Callback invoked upon confirmed submission. |
| `onError` | `(err: Error) => void` | `undefined` | Callback invoked upon API submission failure. |

---

## 4. Backend Endpoints & Storage Requirements

To connect to your production backend, your backend developer needs to implement the endpoint documented in [`API_SPECIFICATION.md`](./API_SPECIFICATION.md):

1. **Endpoint**: `POST /api/submissions`
2. **Payload format**: `multipart/form-data`
3. **Storage Handler**:
   - Save `presentation` (PDF/PPT) and `sourceCodeZip` (ZIP) to S3/Cloudflare R2/Supabase bucket.
   - Insert team & project metadata into PostgreSQL / MongoDB.
   - Return `{ success: true, data: { submissionId: "SP3-BTH-2026-...", ... } }`.
4. **Form State Preservation**:
   - If the backend returns a non-200 status code, the frontend preserves all form inputs, allowing the participant to resolve the error and retry without losing their progress.
