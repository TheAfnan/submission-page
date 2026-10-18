import React, { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Download,
  FileText,
} from 'lucide-react'
import type { SubmissionResult } from '../../types/submission'
import styles from './ConfirmationCard.module.css'

interface ConfirmationCardProps {
  result: SubmissionResult
  backToEventUrl?: string
  onReset?: () => void
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  result,
  backToEventUrl = 'https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon',
  onReset,
}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Subtle confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e4232e', '#f4695e', '#f6c9c2', '#ffffff'],
        disableForReducedMotion: true,
      })
    } catch {
      // Ignore if canvas-confetti is not supported in environment
    }
  }, [])

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(result.submissionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDownloadReceipt = () => {
    const receiptData = {
      event: 'SPIRIT 3.0 – Buildathon',
      organizer: 'Dr. Shakuntala Misra National Rehabilitation University (DSMNRU), Lucknow',
      round: 'Round 1 – Idea Screening & PPT Submission',
      submissionId: result.submissionId,
      submittedAt: result.submittedAt,
      teamName: result.teamName,
      leader: {
        name: result.leaderName,
        email: result.leaderEmail,
        mobile: result.leaderMobile,
      },
      college: result.collegeName,
      location: result.cityState,
      memberCount: result.memberCount,
      project: {
        title: result.projectTitle,
        theme: result.theme,
        implementationStatus: result.implementationStatus,
        techStack: result.techStack,
      },
      deliverables: {
        presentationFileName: result.presentationFileName,
        sourceCodeZipFileName: result.sourceCodeZipFileName,
        githubRepoUrl: result.githubRepoUrl,
        liveDemoUrl: result.liveDemoUrl,
        demoVideoUrl: result.demoVideoUrl || 'N/A',
      },
      status: result.status,
    }

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SPIRIT3_RECEIPT_${result.submissionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formattedDate = (() => {
    try {
      return new Date(result.submittedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    } catch {
      return result.submittedAt
    }
  })()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Success Icon Header */}
        <div className={styles.heroSection}>
          <div className={styles.iconCircle}>
            <CheckCircle size={36} className={styles.checkIcon} />
          </div>
          <span className={styles.eyebrow}>Submission Confirmed</span>
          <h2 className={styles.title}>Project Submitted Successfully!</h2>
          <p className={styles.message}>{result.message}</p>
        </div>

        {/* Highlighted Submission ID Box */}
        <div className={styles.idBox}>
          <div className={styles.idInfo}>
            <span className={styles.idLabel}>Official Submission ID</span>
            <div className={styles.idRow}>
              <span className={styles.idValue}>{result.submissionId}</span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopyId}
                title="Copy Submission ID"
                aria-label="Copy Submission ID"
              >
                {copied ? <Check size={16} className={styles.copySuccess} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>
          </div>
          <p className={styles.idNote}>
            Save this ID for reference during Round 1 presentation evaluation and organizer announcements.
          </p>
        </div>

        {/* Project & Team Summary Strip */}
        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Project Title</span>
            <strong className={styles.metaValue}>{result.projectTitle}</strong>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Theme</span>
            <strong className={styles.metaValue} style={{ color: 'var(--brand-coral)' }}>
              {result.theme}
            </strong>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Team Name</span>
            <strong className={styles.metaValue}>{result.teamName}</strong>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Submission Timestamp</span>
            <strong className={styles.metaValue}>{formattedDate}</strong>
          </div>
        </div>

        {/* Deliverables summary */}
        <div className={styles.deliverablesCard}>
          <span className={styles.deliverablesTitle}>Logged Deliverables</span>
          <div className={styles.deliverablesList}>
            <div className={styles.dItem}>
              <FileText size={15} />
              <span>PPT Presentation: <strong>{result.presentationFileName}</strong></span>
            </div>
            <div className={styles.dItem}>
              <FileText size={15} />
              <span>Source ZIP: <strong>{result.sourceCodeZipFileName}</strong></span>
            </div>
            <div className={styles.dItem}>
              <ExternalLink size={15} />
              <a href={result.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                {result.githubRepoUrl}
              </a>
            </div>
            <div className={styles.dItem}>
              <ExternalLink size={15} />
              <a href={result.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                {result.liveDemoUrl}
              </a>
            </div>
          </div>
        </div>

        {/* What Happens Next Card */}
        <div className={styles.nextStepsCard}>
          <span className={styles.nextStepsHeading}>What Happens Next?</span>
          <ul className={styles.stepsList}>
            <li>
              <strong>1. Technical Review:</strong> The DSMNRU jury will screen submitted PPT slides (8–10 slides compliance) and source code.
            </li>
            <li>
              <strong>2. Shortlist Announcement:</strong> Teams qualifying for the live buildathon round will be notified via email to <code>{result.leaderEmail}</code>.
            </li>
            <li>
              <strong>3. Event Day (24 October 2026):</strong> Shortlisted finalists present their solution in hybrid format at ALRC, DSMNRU Campus, Lucknow.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.receiptBtn}
            onClick={handleDownloadReceipt}
          >
            <Download size={16} />
            <span>Download Submission Receipt (.JSON)</span>
          </button>

          <a
            href={backToEventUrl}
            className={styles.eventPageBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Return to Event Page</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {onReset && (
          <div className={styles.resetRow}>
            <button type="button" className={styles.resetBtn} onClick={onReset}>
              Submit another project entry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
