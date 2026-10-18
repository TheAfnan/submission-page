import React, { useEffect } from 'react'
import { X, ExternalLink, FileText, Send, ArrowLeft } from 'lucide-react'
import type { SubmissionFormData } from '../../types/submission'
import styles from './ReviewModal.module.css'

interface ReviewModalProps {
  isOpen: boolean
  data: SubmissionFormData
  isSubmitting?: boolean
  onClose: () => void
  onConfirmSubmit: () => void
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  data,
  isSubmitting,
  onClose,
  onConfirmSubmit,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div className={styles.modal}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>SPIRIT 3.0 Verification</span>
            <h2 id="review-modal-title" className={styles.title}>
              Review Submission Details
            </h2>
            <p className={styles.subtitle}>
              Please verify all entries carefully. Once submitted, your submission will be logged for Round 1 screening.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close review modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          {/* Section 1 Review: Team */}
          <div className={styles.summaryBlock}>
            <h3 className={styles.blockTitle}>01. Team & Institution</h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Team Name</span>
                <strong className={styles.dataValue}>{data.teamName || '—'}</strong>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>College / University</span>
                <strong className={styles.dataValue}>{data.collegeName || '—'}</strong>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Location</span>
                <strong className={styles.dataValue}>{data.cityState || '—'}</strong>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Team Leader</span>
                <strong className={styles.dataValue}>
                  {data.leaderName} ({data.leaderEmail}) • {data.leaderMobile}
                </strong>
              </div>
              <div className={`${styles.dataItem} ${styles.fullWidth}`}>
                <span className={styles.dataLabel}>Team Members ({data.teamMembers.length})</span>
                <div className={styles.membersList}>
                  {data.teamMembers.map((m, idx) => (
                    <span key={m.id} className={styles.memberTag}>
                      {idx === 0 ? '👑 ' : ''}
                      {m.name || 'Unnamed'}{' '}
                      {m.email ? <span className={styles.mutedEmail}>({m.email})</span> : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 Review: Project */}
          <div className={styles.summaryBlock}>
            <h3 className={styles.blockTitle}>02. Project Details</h3>
            <div className={styles.dataGrid}>
              <div className={`${styles.dataItem} ${styles.fullWidth}`}>
                <span className={styles.dataLabel}>Project Title</span>
                <strong className={styles.dataValue}>{data.projectTitle || '—'}</strong>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Competition Theme</span>
                <strong className={styles.dataValue} style={{ color: 'var(--brand-coral)' }}>
                  {data.theme || '—'}
                </strong>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Implementation Stage</span>
                <strong className={styles.dataValue}>{data.implementationStatus || '—'}</strong>
              </div>
              <div className={`${styles.dataItem} ${styles.fullWidth}`}>
                <span className={styles.dataLabel}>Tech Stack & Tools</span>
                <div className={styles.techStackRow}>
                  {data.techStack.map((tech) => (
                    <span key={tech} className={styles.techChip}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`${styles.dataItem} ${styles.fullWidth}`}>
                <span className={styles.dataLabel}>Problem Statement</span>
                <p className={styles.textExcerpt}>{data.problemStatement || '—'}</p>
              </div>
              <div className={`${styles.dataItem} ${styles.fullWidth}`}>
                <span className={styles.dataLabel}>Proposed Solution</span>
                <p className={styles.textExcerpt}>{data.proposedSolution || '—'}</p>
              </div>
            </div>
          </div>

          {/* Section 3 Review: Deliverables */}
          <div className={styles.summaryBlock}>
            <h3 className={styles.blockTitle}>03. Project Deliverables</h3>
            <div className={styles.deliverablesList}>
              <div className={styles.deliverableRow}>
                <FileText size={16} className={styles.deliverableIcon} />
                <div className={styles.deliverableMeta}>
                  <span className={styles.dataLabel}>Presentation (8–10 Slides)</span>
                  <strong className={styles.dataValue}>
                    {data.presentationFile
                      ? `${data.presentationFile.name} (${formatFileSize(data.presentationFile.size)})`
                      : 'Not uploaded'}
                  </strong>
                </div>
              </div>

              <div className={styles.deliverableRow}>
                <FileText size={16} className={styles.deliverableIcon} />
                <div className={styles.deliverableMeta}>
                  <span className={styles.dataLabel}>Source Code ZIP Archive</span>
                  <strong className={styles.dataValue}>
                    {data.sourceCodeZipFile
                      ? `${data.sourceCodeZipFile.name} (${formatFileSize(data.sourceCodeZipFile.size)})`
                      : 'Not uploaded'}
                  </strong>
                </div>
              </div>

              <div className={styles.deliverableRow}>
                <ExternalLink size={16} className={styles.deliverableIcon} />
                <div className={styles.deliverableMeta}>
                  <span className={styles.dataLabel}>GitHub Repository</span>
                  <span className={styles.linkUrl}>{data.githubRepoUrl || '—'}</span>
                </div>
              </div>

              <div className={styles.deliverableRow}>
                <ExternalLink size={16} className={styles.deliverableIcon} />
                <div className={styles.deliverableMeta}>
                  <span className={styles.dataLabel}>Live Demo</span>
                  <span className={styles.linkUrl}>{data.liveDemoUrl || '—'}</span>
                </div>
              </div>

              {data.demoVideoUrl && (
                <div className={styles.deliverableRow}>
                  <ExternalLink size={16} className={styles.deliverableIcon} />
                  <div className={styles.deliverableMeta}>
                    <span className={styles.dataLabel}>Demo Video (Optional)</span>
                    <span className={styles.linkUrl}>{data.demoVideoUrl}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} />
            <span>Edit Information</span>
          </button>

          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Submitting to SPIRIT 3.0...' : 'Confirm & Final Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
