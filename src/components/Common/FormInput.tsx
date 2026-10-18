import React from 'react'
import styles from './FormInput.module.css'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
  leftIcon?: React.ReactNode
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  error,
  hint,
  required,
  leftIcon,
  className,
  disabled,
  ...props
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className={`${styles.wrapper} ${error ? styles.hasError : ''} ${className || ''}`}>
      <div className={styles.labelRow}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
        {hint && !error && (
          <span id={hintId} className={styles.hint}>
            {hint}
          </span>
        )}
      </div>

      <div className={`${styles.inputContainer} ${disabled ? styles.disabled : ''}`}>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <input
          id={inputId}
          name={name}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-required={required}
          className={`${styles.input} ${leftIcon ? styles.withIcon : ''}`}
          {...props}
        />
      </div>

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
