import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Header } from './Header/Header'
import { EventStrip } from './EventStrip/EventStrip'
import { SectionTeam } from './FormSections/SectionTeam'
import { SectionProject } from './FormSections/SectionProject'
import { SectionDeliverables } from './FormSections/SectionDeliverables'
import { SectionDeclarations } from './FormSections/SectionDeclarations'
import { ReviewModal } from './ReviewModal/ReviewModal'
import { ConfirmationCard } from './Confirmation/ConfirmationCard'
import { validateForm } from '../validation/validators'
import { submitProject, SubmissionError } from '../services/api'
import type {
  FormErrors,
  PortalConfig,
  SubmissionFormData,
  SubmissionResult,
} from '../types/submission'
import styles from './SpiritSubmissionPortal.module.css'

export interface SpiritSubmissionPortalProps {
  apiBaseUrl?: string
  mode?: 'demo' | 'production'
  submissionDeadline?: string
  maxTeamSize?: number
  minTeamSize?: number
  maxPresentationSizeBytes?: number
  maxZipSizeBytes?: number
  eventTitle?: string
  roundTitle?: string
  eventDate?: string
  backToEventUrl?: string
  onSuccess?: (result: SubmissionResult) => void
  onError?: (error: Error) => void
}

const INITIAL_FORM_DATA: SubmissionFormData = {
  teamName: '',
  leaderName: '',
  leaderEmail: '',
  leaderMobile: '',
  collegeName: '',
  cityState: '',
  teamMembers: [
    {
      id: 'leader-1',
      name: '',
      email: '',
      isLeader: true,
      role: 'Team Leader',
    },
  ],
  projectTitle: '',
  theme: '',
  projectDescription: '',
  techStack: [],
  problemStatement: '',
  proposedSolution: '',
  projectOverview: '',
  keyFeatures: '',
  targetUsersAndImpact: '',
  innovationUniqueness: '',
  implementationStatus: '',
  presentationFile: null,
  sourceCodeZipFile: null,
  githubRepoUrl: '',
  liveDemoUrl: '',
  demoVideoUrl: '',
  declarationAccuracy: false,
  declarationOriginality: false,
  declarationSlideCount: false,
}

export const SpiritSubmissionPortal: React.FC<SpiritSubmissionPortalProps> = ({
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.spirit-dsmnru.vercel.app',
  mode: initialMode = (import.meta.env.VITE_APP_MODE as 'demo' | 'production') || 'demo',
  submissionDeadline = import.meta.env.VITE_SUBMISSION_DEADLINE || '2026-10-24T23:59:59+05:30',
  maxTeamSize = 4,
  minTeamSize = 1,
  maxPresentationSizeBytes = 25 * 1024 * 1024, // 25 MB
  maxZipSizeBytes = 50 * 1024 * 1024, // 50 MB
  eventTitle = 'SPIRIT 3.0 – Buildathon',
  roundTitle = 'Round 1 – Idea Screening & PPT Submission',
  eventDate = '24 October 2026',
  backToEventUrl = 'https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon',
  onSuccess,
  onError,
}) => {
  const [currentMode] = useState<'demo' | 'production'>(initialMode)

  // Portal configuration
  const config = useMemo<PortalConfig>(
    () => ({
      mode: currentMode,
      apiBaseUrl,
      submissionDeadline,
      maxTeamSize,
      minTeamSize,
      maxPresentationSizeBytes,
      maxZipSizeBytes,
      eventTitle,
      roundTitle,
      eventDate,
      backToEventUrl,
    }),
    [
      currentMode,
      apiBaseUrl,
      submissionDeadline,
      maxTeamSize,
      minTeamSize,
      maxPresentationSizeBytes,
      maxZipSizeBytes,
      eventTitle,
      roundTitle,
      eventDate,
      backToEventUrl,
    ]
  )

  // Form State
  const [formData, setFormData] = useState<SubmissionFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDirty, setIsDirty] = useState(false)

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadPhase, setUploadPhase] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [serverError, setServerError] = useState<{ message: string; code?: string } | null>(null)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !submissionResult) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, submissionResult])

  // Field change handler
  const handleFieldChange = useCallback(
    <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => {
      setIsDirty(true)
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error for this field if present
      if (errors[field as string]) {
        setErrors((prev) => {
          const updated = { ...prev }
          delete updated[field as string]
          return updated
        })
      }
    },
    [errors]
  )

  // Review step handler
  const handleOpenReview = () => {
    setServerError(null)
    const validationErrors = validateForm(formData, config)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0]
      const el = document.getElementById(firstErrorKey)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.focus()
      }
      return
    }

    setIsReviewOpen(true)
  }

  // Final submission execution
  const executeSubmission = async () => {
    setIsReviewOpen(false)
    setServerError(null)

    // Re-validate just in case
    const validationErrors = validateForm(formData, config)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setUploadProgress(5)
    setUploadPhase('Initiating project submission...')

    try {
      const result = await submitProject({
        formData,
        config,
        onProgress: (phase, percent) => {
          setUploadPhase(phase)
          setUploadProgress(percent)
        },
      })

      // Success
      setSubmissionResult(result)
      setIsDirty(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      onSuccess?.(result)
    } catch (err: unknown) {
      const errorObj =
        err instanceof SubmissionError
          ? { message: err.message, code: err.code }
          : {
              message:
                err instanceof Error
                  ? err.message
                  : 'An unexpected submission error occurred. Your form inputs have been preserved. Please try again.',
            }

      setServerError(errorObj)
      onError?.(err instanceof Error ? err : new Error(errorObj.message))
      window.scrollTo({ top: 200, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form handler
  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
    setServerError(null)
    setSubmissionResult(null)
    setIsDirty(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.portalRoot}>
      {/* A. Compact Header */}
      <Header />

      {/* B. Event Information Strip & Deadline */}
      <EventStrip
        deadlineIso={config.submissionDeadline}
        eventDate={config.eventDate}
        roundTitle={config.roundTitle}
        eventTitle={config.eventTitle}
        mode={config.mode}
      />

      <main className={styles.mainContainer}>
        {/* D. Confirmation State: shown ONLY on confirmed submission */}
        {submissionResult ? (
          <ConfirmationCard
            result={submissionResult}
            onReset={handleResetForm}
          />
        ) : (
          /* C. Main Submission Form */
          <div className={styles.formWrapper}>
            {/* Server Error Alert Banner (does NOT wipe form) */}
            {serverError && (
              <div className={styles.serverErrorBanner} role="alert">
                <div className={styles.errorIconWrap}>
                  <AlertCircle size={22} />
                </div>
                <div className={styles.errorContent}>
                  <strong className={styles.errorTitle}>Submission Request Failed</strong>
                  <p className={styles.errorMessage}>{serverError.message}</p>
                  <p className={styles.errorPreserveNote}>
                    Your submitted details and uploaded files have been preserved. You do not need to re-type everything.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.retryBtn}
                  onClick={executeSubmission}
                  disabled={isSubmitting}
                >
                  <RefreshCw size={14} />
                  <span>Retry Submission</span>
                </button>
              </div>
            )}

            {/* Submission Loading Overlay / Progress Bar */}
            {isSubmitting && (
              <div className={styles.submittingCard} role="status" aria-live="polite">
                <div className={styles.submittingHeader}>
                  <Loader2 size={24} className={styles.spinner} />
                  <div>
                    <strong className={styles.submittingTitle}>
                      Transmitting SPIRIT 3.0 Project Deliverables...
                    </strong>
                    <p className={styles.submittingPhase}>{uploadPhase}</p>
                  </div>
                </div>

                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className={styles.progressPercent}>{uploadProgress}% complete</span>
              </div>
            )}

            {/* Form Title & Introduction */}
            <div className={styles.formIntro}>
              <h2 className={styles.introHeading}>
                SPIRIT 3.0 – <em>Project Submission</em>
              </h2>
              <p className={styles.introDesc}>
                Complete all mandatory fields across the four sections below. Make sure your presentation adheres strictly to the <strong>8–10 slide rule</strong> and your source code ZIP is packaged properly.
              </p>
            </div>

            {/* Section 01: Team Details */}
            <SectionTeam
              data={formData}
              errors={errors}
              maxTeamSize={config.maxTeamSize}
              minTeamSize={config.minTeamSize}
              disabled={isSubmitting}
              onChange={handleFieldChange}
            />

            {/* Section 02: Project Details */}
            <SectionProject
              data={formData}
              errors={errors}
              disabled={isSubmitting}
              onChange={handleFieldChange}
            />

            {/* Section 03: Required Deliverables */}
            <SectionDeliverables
              data={formData}
              errors={errors}
              maxPresentationSizeBytes={config.maxPresentationSizeBytes}
              maxZipSizeBytes={config.maxZipSizeBytes}
              disabled={isSubmitting}
              onChange={handleFieldChange}
            />

            {/* Section 04: Declarations & Submit */}
            <SectionDeclarations
              data={formData}
              errors={errors}
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
              onReview={handleOpenReview}
              onSubmit={executeSubmission}
              onChange={handleFieldChange}
            />
          </div>
        )}
      </main>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        data={formData}
        isSubmitting={isSubmitting}
        onClose={() => setIsReviewOpen(false)}
        onConfirmSubmit={executeSubmission}
      />

      {/* Portal Footer Note */}
      <footer className={styles.portalFooter}>
        <div className={styles.footerInner}>
          <span>
            © 2026 SPIRIT 3.0 – Buildathon • Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow.
          </span>
        </div>
      </footer>
    </div>
  )
}
