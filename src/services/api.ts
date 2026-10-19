import type {
  ApiResponse,
  PortalConfig,
  SubmissionFormData,
  SubmissionResult,
} from '../types/submission'

export interface SubmitOptions {
  formData: SubmissionFormData
  config: PortalConfig
  onProgress?: (phase: string, percent: number) => void
}

/**
 * Normalizes and formats error messages from server responses
 */
export class SubmissionError extends Error {
  code: string
  details?: Record<string, string[]>

  constructor(message: string, code = 'SUBMISSION_FAILED', details?: Record<string, string[]>) {
    super(message)
    this.name = 'SubmissionError'
    this.code = code
    this.details = details
  }
}

/**
 * Submits the hackathon application.
 * In DEMO mode: simulates realistic network latency, file upload phases, and generates a formatted ID.
 * In PRODUCTION mode: performs real multipart/form-data POST request to the configured API.
 */
export async function submitProject({
  formData,
  config,
  onProgress,
}: SubmitOptions): Promise<SubmissionResult> {
  const isDemo = config.mode === 'demo'

  if (isDemo) {
    return simulateDemoSubmission(formData, onProgress)
  }

  return executeProductionSubmission(formData, config, onProgress)
}

/**
 * Production Submission via fetch with FormData
 */
async function executeProductionSubmission(
  formData: SubmissionFormData,
  config: PortalConfig,
  onProgress?: (phase: string, percent: number) => void
): Promise<SubmissionResult> {
  onProgress?.('Preparing payload and deliverables...', 10)

  const body = new FormData()

  // 1. Team details
  body.append('teamName', formData.teamName.trim())
  body.append('leaderName', formData.leaderName.trim())
  body.append('leaderEmail', formData.leaderEmail.trim())
  body.append('leaderMobile', formData.leaderMobile.trim())
  body.append('collegeName', formData.collegeName.trim())
  body.append('cityState', formData.cityState.trim())
  body.append('teamMembers', JSON.stringify(formData.teamMembers))

  // 2. Project details
  body.append('projectTitle', formData.projectTitle.trim())
  body.append('theme', formData.theme)
  body.append('projectDescription', formData.projectDescription.trim())
  body.append('techStack', JSON.stringify(formData.techStack))
  if (formData.problemStatement) body.append('problemStatement', formData.problemStatement.trim())
  if (formData.proposedSolution) body.append('proposedSolution', formData.proposedSolution.trim())
  if (formData.projectOverview) body.append('projectOverview', formData.projectOverview.trim())
  if (formData.keyFeatures) body.append('keyFeatures', formData.keyFeatures.trim())
  if (formData.targetUsersAndImpact) body.append('targetUsersAndImpact', formData.targetUsersAndImpact.trim())
  if (formData.innovationUniqueness) body.append('innovationUniqueness', formData.innovationUniqueness.trim())
  if (formData.implementationStatus) body.append('implementationStatus', formData.implementationStatus)

  // 3. Links and deliverables
  body.append('githubRepoUrl', formData.githubRepoUrl.trim())
  body.append('liveDemoUrl', formData.liveDemoUrl.trim())
  if (formData.demoVideoUrl?.trim()) {
    body.append('demoVideoUrl', formData.demoVideoUrl.trim())
  }

  // 4. Binary files
  if (formData.presentationFile) {
    body.append('presentation', formData.presentationFile, formData.presentationFile.name)
  }
  if (formData.sourceCodeZipFile) {
    body.append('sourceCodeZip', formData.sourceCodeZipFile, formData.sourceCodeZipFile.name)
  }

  // 5. Declarations
  body.append('declarationAccuracy', String(formData.declarationAccuracy))
  body.append('declarationOriginality', String(formData.declarationOriginality))
  body.append('declarationSlideCount', String(formData.declarationSlideCount))

  onProgress?.('Uploading presentation and source code archive...', 45)

  const endpoint = `${config.apiBaseUrl.replace(/\/$/, '')}/api/submissions`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body,
      headers: {
        // Note: Do not set Content-Type header manually when using FormData
        Accept: 'application/json',
      },
    })

    onProgress?.('Verifying submission on DSMNRU servers...', 85)

    const contentType = response.headers.get('content-type') || ''
    let json: ApiResponse<SubmissionResult> | null = null

    if (contentType.includes('application/json')) {
      json = (await response.json()) as ApiResponse<SubmissionResult>
    }

    if (!response.ok || !json?.success) {
      const errorMsg =
        json?.error?.message ||
        `Server returned error HTTP ${response.status}: ${response.statusText || 'Submission request failed'}`
      const errorCode = json?.error?.code || `HTTP_${response.status}`
      throw new SubmissionError(errorMsg, errorCode, json?.error?.details)
    }

    if (!json.data || !json.data.submissionId) {
      throw new SubmissionError(
        'Backend did not return a valid submission payload or Submission ID.',
        'MALFORMED_RESPONSE'
      )
    }

    onProgress?.('Submission confirmed!', 100)
    return json.data
  } catch (err: unknown) {
    if (err instanceof SubmissionError) {
      throw err
    }
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to connect to the SPIRIT 3.0 submission service. Please check your internet connection.'
    throw new SubmissionError(
      `Network or server communication failure: ${message}. If this continues, contact the event coordinator.`,
      'NETWORK_ERROR'
    )
  }
}

/**
 * Demo Mode simulation with controlled delay and realistic stages
 */
async function simulateDemoSubmission(
  formData: SubmissionFormData,
  onProgress?: (phase: string, percent: number) => void
): Promise<SubmissionResult> {
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  onProgress?.('Validating project deliverables...', 15)
  await wait(400)

  onProgress?.('Encrypting and staging presentation slides...', 45)
  await wait(500)

  onProgress?.('Uploading project repository archive...', 75)
  await wait(600)

  onProgress?.('Registering entry in DSMNRU SPIRIT 3.0 Registry...', 95)
  await wait(400)

  // Generate randomized but formatted Submission ID
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
  const submissionId = `SP3-BTH-2026-${randomSuffix}`

  onProgress?.('Completed successfully!', 100)

  return {
    submissionId,
    submittedAt: new Date().toISOString(),
    teamName: formData.teamName.trim(),
    leaderName: formData.leaderName.trim(),
    leaderEmail: formData.leaderEmail.trim(),
    leaderMobile: formData.leaderMobile.trim(),
    collegeName: formData.collegeName.trim(),
    cityState: formData.cityState.trim(),
    memberCount: formData.teamMembers.length,
    projectTitle: formData.projectTitle.trim(),
    theme: formData.theme,
    implementationStatus: formData.implementationStatus || 'Submitted',
    techStack: formData.techStack,
    presentationFileName: formData.presentationFile?.name || 'presentation.pdf',
    presentationFileSize: formData.presentationFile?.size || 0,
    sourceCodeZipFileName: formData.sourceCodeZipFile?.name || 'source-code.zip',
    sourceCodeZipFileSize: formData.sourceCodeZipFile?.size || 0,
    githubRepoUrl: formData.githubRepoUrl.trim(),
    liveDemoUrl: formData.liveDemoUrl.trim(),
    demoVideoUrl: formData.demoVideoUrl?.trim() || undefined,
    status: 'RECEIVED',
    message:
      'Your project has been successfully received for SPIRIT 3.0 – Buildathon (Round 1: Idea Screening & PPT Submission). Keep your Submission ID safe for future evaluation and presentation rounds.',
  }
}
