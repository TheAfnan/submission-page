import React from 'react'
import styles from './FormTextarea.module.css'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  maxLength?: number
  minLength?: number
  value?: string
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  name,
  label,
  error,
  hint,
  required,
  maxLength,
  minLength,
  value = '',
  disabled,
  className,
  rows = 4,
  ...props
}) => {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${textareaId}-error`
  const hintId = `${textareaId}-hint`

  const currentLength = typeof value === 'string' ? value.length : 0
  const isNearLimit = maxLength ? currentLength >= maxLength * 0.9 : false
  const isBelowMin = minLength && currentLength > 0 ? currentLength < minLength : false

  return (
    <div className={`${styles.wrapper} ${error ? styles.hasError : ''} ${className || ''}`}>
      <div className={styles.labelRow}>
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
        {maxLength && (
          <span
            className={`${styles.charCount} ${isNearLimit ? styles.charCountWarn : ''} ${
              isBelowMin ? styles.charCountBelow : ''
            }`}
          >
            {currentLength} / {maxLength}
            {minLength && currentLength < minLength && ` (min ${minLength})`}
          </span>
        )}
      </div>

      <div className={`${styles.textareaContainer} ${disabled ? styles.disabled : ''}`}>
        <textarea
          id={textareaId}
          name={name}
          rows={rows}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-required={required}
          className={styles.textarea}
          {...props}
        />
      </div>

      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className={styles.errorMessage} role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
