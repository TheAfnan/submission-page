import React, { useRef, useState } from 'react'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react'
import styles from './FileUpload.module.css'

interface FileUploadProps {
  id: string
  name: string
  label: string
  accept: string
  acceptedFormatsLabel: string
  maxSizeBytes: number
  file: File | null
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  validationFn?: (file: File | null, maxSizeBytes: number) => string | null
  onChange: (file: File | null) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept,
  acceptedFormatsLabel,
  maxSizeBytes,
  file,
  error,
  hint,
  required,
  disabled,
  validationFn,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  const maxMb = Math.round(maxSizeBytes / (1024 * 1024))
  const displayError = error || internalError

  const handleFile = (selectedFile: File | null) => {
    setInternalError(null)
    if (!selectedFile) {
      onChange(null)
      return
    }

    if (validationFn) {
      const err = validationFn(selectedFile, maxSizeBytes)
      if (err) {
        setInternalError(err)
        onChange(null)
        if (inputRef.current) inputRef.current.value = ''
        return
      }
    }

    onChange(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (disabled) return

    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      handleFile(dropped)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className={`${styles.wrapper} ${displayError ? styles.hasError : ''}`}>
      <div className={styles.labelRow}>
        <span className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </span>
        <span className={styles.limitBadge}>Max {maxMb}MB</span>
      </div>

      {!file ? (
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''} ${
            disabled ? styles.disabled : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          aria-label={`Upload ${label}`}
        >
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            disabled={disabled}
            className={styles.hiddenInput}
            onChange={(e) => {
              const f = e.target.files?.[0] || null
              handleFile(f)
            }}
          />

          <div className={styles.uploadIconWrap}>
            <UploadCloud className={styles.uploadIcon} />
          </div>

          <div className={styles.dropZoneText}>
            <p className={styles.primaryText}>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className={styles.formatsText}>{acceptedFormatsLabel}</p>
          </div>
        </div>
      ) : (
        <div className={styles.fileSelectedCard}>
          <div className={styles.fileInfo}>
            <div className={styles.fileIconWrap}>
              <FileText className={styles.fileIcon} />
            </div>
            <div className={styles.fileDetails}>
              <div className={styles.fileNameRow}>
                <span className={styles.fileName} title={file.name}>
                  {file.name}
                </span>
                <span className={styles.readyBadge}>
                  <CheckCircle2 size={12} /> Ready
                </span>
              </div>
              <span className={styles.fileMeta}>{formatFileSize(file.size)}</span>
            </div>
          </div>

          <div className={styles.fileActions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              title="Replace file"
            >
              <RefreshCw size={14} />
              <span>Replace</span>
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              onClick={() => {
                handleFile(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
              disabled={disabled}
              title="Remove file"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              disabled={disabled}
              className={styles.hiddenInput}
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                handleFile(f)
              }}
            />
          </div>
        </div>
      )}

      {hint && !displayError && <p className={styles.hint}>{hint}</p>}

      {displayError && (
        <p className={styles.errorMessage} role="alert">
          <AlertCircle size={14} />
          {displayError}
        </p>
      )}
    </div>
  )
}
