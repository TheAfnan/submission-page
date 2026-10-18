# SPIRIT 3.0 – Buildathon: Backend Submission API Specification

This document provides the formal API specification and integration contract for the **SPIRIT 3.0 – Buildathon** project submission service, organized by **Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow**.

The frontend module interacts with the backend service using standard `multipart/form-data` HTTP requests.

---

## 1. Overview & Endpoints

| Method | Endpoint | Description | Content-Type |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/submissions` | Create a new project submission | `multipart/form-data` |
| `GET` | `/api/submissions/:id` | Check submission status / verification | `application/json` |

Base URL is configurable in the frontend via `VITE_API_BASE_URL` or the `apiBaseUrl` React prop.

---

## 2. Submission Endpoint (`POST /api/submissions`)

### 2.1 Request Parameters (`multipart/form-data`)

#### A. Team Details (Section 1)
| Field | Type | Required | Constraints & Description |
| :--- | :--- | :---: | :--- |
| `teamName` | `string` | **Yes** | 2–60 characters. Must be unique. |
| `leaderName` | `string` | **Yes** | 2–100 characters. Full name of team leader. |
| `leaderEmail` | `string` | **Yes** | Valid RFC 5322 email. Primary communication channel. |
| `leaderMobile` | `string` | **Yes** | 10–14 digits. Phone number with country code. |
| `collegeName` | `string` | **Yes** | 3–150 characters. College or university name. |
| `cityState` | `string` | **Yes** | 3–100 characters. e.g. "Lucknow, Uttar Pradesh". |
| `teamMembers` | `string` (JSON) | **Yes** | Array of `{ id, name, email, isLeader, role }`. Between 1 and `maxTeamSize` (default: 4). |

#### B. Project Details (Section 2)
| Field | Type | Required | Constraints & Description |
| :--- | :--- | :---: | :--- |
| `projectTitle` | `string` | **Yes** | 3–100 characters. |
| `theme` | `string` | **Yes** | One of: `"Assistive Technology"`, `"Fintech & Security"`, `"Open Innovation"`. |
| `problemStatement` | `string` | **Yes** | 40–1200 characters. Specific real-world problem. |
| `proposedSolution` | `string` | **Yes** | 40–1200 characters. Proposed technical solution. |
| `projectOverview` | `string` | **Yes** | 50–1500 characters. High-level architecture & workflow. |
| `keyFeatures` | `string` | **Yes** | 30–1500 characters. List of core features & capabilities. |
| `targetUsersAndImpact`| `string` | **Yes** | 30–1200 characters. Beneficiaries & quantifiable impact. |
| `techStack` | `string` (JSON) | **Yes** | Array of technology strings, e.g. `["Python","FastAPI","React"]`. |
| `innovationUniqueness`| `string` | **Yes** | 30–1200 characters. Key differentiators & originality. |
| `implementationStatus`| `string` | **Yes** | One of: `"Architecture & Ideation"`, `"Working Prototype / MVP"`, `"Functional Alpha"`, `"Production Ready / Deployed"`. |

#### C. Deliverables & Links (Section 3)
| Field | Type | Required | Constraints & Description |
| :--- | :--- | :---: | :--- |
| `presentation` | `File` (Binary) | **Yes** | PPT, PPTX, or PDF. **Must contain 8–10 slides**. Max 25 MB. |
| `sourceCodeZip` | `File` (Binary) | **Yes** | `.zip` archive containing project source files, README, dependencies instructions. Max 50 MB. |
| `githubRepoUrl` | `string` | **Yes** | Valid HTTPS GitHub repository URL (`https://github.com/org/repo`). |
| `liveDemoUrl` | `string` | **Yes** | Valid HTTPS URL to the deployed web/mobile demonstration. |
| `demoVideoUrl` | `string` | *Optional* | Valid HTTPS video URL (YouTube, Loom, Google Drive). |

#### D. Declarations (Section 4)
| Field | Type | Required | Value |
| :--- | :--- | :---: | :--- |
| `declarationAccuracy` | `string` / `boolean` | **Yes** | Must be `true`. Accuracy of provided data. |
| `declarationOriginality`| `string` / `boolean` | **Yes** | Must be `true`. Ownership or authorized use of code. |
| `declarationSlideCount` | `string` / `boolean` | **Yes** | Must be `true`. Compliance with 8–10 slide rule. |

---

## 3. Server Response Contracts

### 3.1 Success Response (`HTTP 201 Created`)

```json
{
  "success": true,
  "data": {
    "submissionId": "SP3-BTH-2026-X98AK",
    "submittedAt": "2026-10-24T14:32:00.000Z",
    "teamName": "CyberPulse DSMNRU",
    "leaderName": "Ramakant Yadav",
    "leaderEmail": "ramakant@dsmnru.ac.in",
    "leaderMobile": "9876543210",
    "collegeName": "Dr. Shakuntala Misra National Rehabilitation University, Lucknow",
    "cityState": "Lucknow, Uttar Pradesh",
    "memberCount": 3,
    "projectTitle": "TactileNav: Haptic Navigation for Campus Accessibility",
    "theme": "Assistive Technology",
    "implementationStatus": "Working Prototype / MVP",
    "techStack": ["Python", "FastAPI", "OpenCV", "React"],
    "presentationFileName": "tactilenav-presentation.pdf",
    "presentationFileSize": 4829104,
    "sourceCodeZipFileName": "tactilenav-source.zip",
    "sourceCodeZipFileSize": 12849022,
    "githubRepoUrl": "https://github.com/cyberpulse/tactilenav",
    "liveDemoUrl": "https://tactilenav.vercel.app",
    "demoVideoUrl": "https://youtu.be/sample-walkthrough",
    "status": "RECEIVED",
    "message": "Your project has been successfully received for SPIRIT 3.0 – Buildathon (Round 1: Idea Screening & PPT Submission). Keep your Submission ID safe for future evaluation and presentation rounds."
  }
}
```

### 3.2 Error Responses

#### `HTTP 400 Bad Request` (Validation Failed)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input data provided. Please check the required fields.",
    "details": {
      "presentation": ["Presentation file must be in PDF, PPT, or PPTX format with 8–10 slides."],
      "githubRepoUrl": ["Invalid GitHub repository format. Must start with https://github.com/."]
    }
  }
}
```

#### `HTTP 403 Forbidden` (Deadline Expired)
```json
{
  "success": false,
  "error": {
    "code": "DEADLINE_EXPIRED",
    "message": "The official submission deadline for SPIRIT 3.0 – Buildathon Round 1 has passed. Submissions are no longer accepted."
  }
}
```

#### `HTTP 409 Conflict` (Duplicate Submission)
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ENTRY",
    "message": "A submission with this Team Name or Leader Email has already been registered."
  }
}
```

#### `HTTP 413 Payload Too Large`
```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "The uploaded file exceeds the allowed server threshold (25MB for presentation, 50MB for source code)."
  }
}
```

---

## 4. Server-Side Security & Storage Recommendations

1. **File Storage Service Integration**:
   - Store binary presentation and source code files in an S3-compatible object storage bucket (e.g., AWS S3, Cloudflare R2, Google Cloud Storage, or Supabase Storage).
   - **Never store binary files as Base64 strings inside SQL/PostgreSQL databases**.
   - Organize bucket paths using unique identifiers:
     `s3://spirit-submissions/2026/round1/{submissionId}/presentation.pdf`
     `s3://spirit-submissions/2026/round1/{submissionId}/source-code.zip`
2. **Server-Side Deadline Enforcement**:
   - Never rely exclusively on client-side clocks.
   - The backend server must verify `new Date() <= SUBMISSION_DEADLINE` before accepting the upload stream.
3. **MIME & Extension Verification**:
   - Inspect magic bytes (file signatures) to verify that uploaded files match their declared format.
   - Reject executable binaries (`.exe`, `.sh`, `.bat`, `.dll`) within ZIP archives where possible.
4. **Rate Limiting**:
   - Apply rate limiting on `POST /api/submissions` (e.g., maximum 5 submission attempts per IP per 10 minutes) to prevent denial of service.
