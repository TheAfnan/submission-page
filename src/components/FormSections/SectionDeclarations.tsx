import { Check, Eye, Send } from 'lucide-react'
import type { FormErrors, SubmissionFormData } from '../../types/submission'
import styles from './FormSections.module.css'

interface SectionDeclarationsProps {
  data: SubmissionFormData
  errors: FormErrors
  disabled?: boolean
  isSubmitting?: boolean
  onReview: () => void
  onSubmit: () => void
  onChange: <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => void
}

export const SectionDeclarations: React.FC<SectionDeclarationsProps> = ({
  data,
  errors,
  disabled,
  isSubmitting,
  onReview,
  onSubmit,
  onChange,
}) => {
  const allDeclarationsChecked =
    data.declarationAccuracy && data.declarationOriginality && data.declarationSlideCount

  return (
    <section className={styles.sectionCard} aria-labelledby="section-declarations-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumberBadge}>04</div>
        <div className={styles.sectionTitleWrap}>
          <span className={styles.sectionEyebrow}>Verification & Compliance</span>
          <h2 id="section-declarations-heading" className={styles.sectionTitle}>
            Declarations & Submission
          </h2>
          <p className={styles.sectionDescription}>
            Confirm event compliance and review your project submission before sending it to the evaluation committee.
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        {/* Declaration 1 */}
        <div
          className={`${styles.declarationItem} ${
            data.declarationAccuracy ? styles.declarationChecked : ''
          }`}
          onClick={() => !disabled && onChange('declarationAccuracy', !data.declarationAccuracy)}
          role="checkbox"
          aria-checked={data.declarationAccuracy}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              !disabled && onChange('declarationAccuracy', !data.declarationAccuracy)
            }
          }}
        >
          <div className={styles.customCheckbox}>
            {data.declarationAccuracy && <Check size={14} strokeWidth={3} />}
          </div>
          <span className={styles.declarationText}>
            I confirm that the information and links provided are accurate.
          </span>
        </div>
        {errors.declarationAccuracy && (
          <p className={styles.errorMessage} role="alert" style={{ color: '#ff9296', marginTop: '-10px' }}>
            {errors.declarationAccuracy}
          </p>
        )}

        {/* Declaration 2 */}
        <div
          className={`${styles.declarationItem} ${
            data.declarationOriginality ? styles.declarationChecked : ''
          }`}
          onClick={() => !disabled && onChange('declarationOriginality', !data.declarationOriginality)}
          role="checkbox"
          aria-checked={data.declarationOriginality}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              !disabled && onChange('declarationOriginality', !data.declarationOriginality)
            }
          }}
        >
          <div className={styles.customCheckbox}>
            {data.declarationOriginality && <Check size={14} strokeWidth={3} />}
          </div>
          <span className={styles.declarationText}>
            I confirm that the submitted project materials belong to our team or are used with appropriate permission.
          </span>
        </div>
        {errors.declarationOriginality && (
          <p className={styles.errorMessage} role="alert" style={{ color: '#ff9296', marginTop: '-10px' }}>
            {errors.declarationOriginality}
          </p>
        )}

        {/* Declaration 3 */}
        <div
          className={`${styles.declarationItem} ${
            data.declarationSlideCount ? styles.declarationChecked : ''
          }`}
          onClick={() => !disabled && onChange('declarationSlideCount', !data.declarationSlideCount)}
          role="checkbox"
          aria-checked={data.declarationSlideCount}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              !disabled && onChange('declarationSlideCount', !data.declarationSlideCount)
            }
          }}
        >
          <div className={styles.customCheckbox}>
            {data.declarationSlideCount && <Check size={14} strokeWidth={3} />}
          </div>
          <span className={styles.declarationText}>
            I understand that our presentation must comply with the event's <strong>8–10 slide requirement</strong>.
          </span>
        </div>
        {errors.declarationSlideCount && (
          <p className={styles.errorMessage} role="alert" style={{ color: '#ff9296', marginTop: '-10px' }}>
            {errors.declarationSlideCount}
          </p>
        )}

        {/* Action Buttons: Review & Direct Submit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '14px',
            marginTop: '16px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={onReview}
            disabled={disabled || isSubmitting}
            style={{
              minHeight: '48px',
              padding: '0 24px',
              borderRadius: '999px',
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              color: 'var(--foreground)',
              fontWeight: 600,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <Eye size={16} />
            <span>Review Submission Details</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={disabled || isSubmitting || !allDeclarationsChecked}
            style={{
              minHeight: '48px',
              padding: '0 28px',
              borderRadius: '999px',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: disabled || !allDeclarationsChecked ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 18px rgba(228, 35, 46, 0.25)',
              opacity: disabled || !allDeclarationsChecked ? 0.5 : 1,
              transition: 'all 0.18s ease',
            }}
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Submitting Project...' : 'Submit Project'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
