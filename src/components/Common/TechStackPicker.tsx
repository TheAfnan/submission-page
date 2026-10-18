import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import styles from './TechStackPicker.module.css'

interface TechStackPickerProps {
  techStack: string[]
  onChange: (tags: string[]) => void
  error?: string
  disabled?: boolean
  required?: boolean
}

const POPULAR_SUGGESTIONS = [
  'Python',
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'FastAPI',
  'Flutter',
  'TensorFlow',
  'PyTorch',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'Tailwind CSS',
  'OpenCV',
  'Whisper AI',
]

export const TechStackPicker: React.FC<TechStackPickerProps> = ({
  techStack,
  onChange,
  error,
  disabled,
  required,
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    if (!techStack.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...techStack, trimmed])
    }
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAdd(inputValue)
    }
  }

  const handleRemove = (tagToRemove: string) => {
    onChange(techStack.filter((t) => t !== tagToRemove))
  }

  return (
    <div className={`${styles.wrapper} ${error ? styles.hasError : ''}`}>
      <div className={styles.labelRow}>
        <span className={styles.label}>
          Technology Stack & Tools
          {required && <span className={styles.requiredMark}>*</span>}
        </span>
        <span className={styles.countBadge}>{techStack.length} added</span>
      </div>

      <div className={`${styles.box} ${disabled ? styles.disabled : ''}`}>
        <div className={styles.tagsContainer}>
          {techStack.map((tech) => (
            <span key={tech} className={styles.tag}>
              <span>{tech}</span>
              {!disabled && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(tech)}
                  aria-label={`Remove ${tech}`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}

          <div className={styles.inputWrap}>
            <input
              type="text"
              value={inputValue}
              disabled={disabled}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={techStack.length === 0 ? 'Type a tool/framework and press Enter...' : 'Add another...'}
              className={styles.input}
            />
            {inputValue.trim() && (
              <button
                type="button"
                className={styles.addInlineBtn}
                onClick={() => handleAdd(inputValue)}
                disabled={disabled}
              >
                <Plus size={14} /> Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested chips */}
      <div className={styles.suggestionsRow}>
        <span className={styles.suggestionsLabel}>Suggestions:</span>
        <div className={styles.suggestionChips}>
          {POPULAR_SUGGESTIONS.filter((s) => !techStack.includes(s)).slice(0, 8).map((chip) => (
            <button
              key={chip}
              type="button"
              className={styles.suggestionChip}
              disabled={disabled}
              onClick={() => handleAdd(chip)}
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className={styles.errorMessage} role="alert">
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
