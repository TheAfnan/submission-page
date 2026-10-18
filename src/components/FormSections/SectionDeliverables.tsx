import { Globe, Video, AlertCircle, Info } from 'lucide-react'
import { FormInput } from '../Common/FormInput'
import { FileUpload } from '../Common/FileUpload'
import {
  validatePresentationFile,
  validateZipFile,
} from '../../validation/validators'
import type { FormErrors, SubmissionFormData } from '../../types/submission'
import styles from './FormSections.module.css'

interface SectionDeliverablesProps {
  data: SubmissionFormData
  errors: FormErrors
  maxPresentationSizeBytes: number
  maxZipSizeBytes: number
  disabled?: boolean
  onChange: <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => void
}

export const SectionDeliverables: React.FC<SectionDeliverablesProps> = ({
  data,
  errors,
  maxPresentationSizeBytes,
  maxZipSizeBytes,
  disabled,
  onChange,
}) => {
  return (
    <section className={styles.sectionCard} aria-labelledby="section-deliverables-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumberBadge}>03</div>
        <div className={styles.sectionTitleWrap}>
          <span className={styles.sectionEyebrow}>Submission Artifacts</span>
          <h2 id="section-deliverables-heading" className={styles.sectionTitle}>
            Required Project Submissions
          </h2>
          <p className={styles.sectionDescription}>
            Deliverables are evaluated by the DSMNRU screening committee. Ensure all files meet formatting rules and links remain accessible.
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        {/* Deliverable A: Presentation File */}
        <div className={styles.gridTwoCol}>
          <div>
            <FileUpload
              id="presentationFile"
              name="presentationFile"
              label="Project Presentation (8–10 Slides)"
              accept=".pdf,.ppt,.pptx"
              acceptedFormatsLabel="PDF, PPT, or PPTX format (Max 25MB)"
              maxSizeBytes={maxPresentationSizeBytes}
              file={data.presentationFile}
              error={errors.presentationFile}
              required
              disabled={disabled}
              validationFn={validatePresentationFile}
              hint="Must strictly contain between 8 and 10 slides."
              onChange={(file) => onChange('presentationFile', file)}
            />
            <div className={styles.calloutBox} style={{ marginTop: '10px' }}>
              <AlertCircle size={16} className={styles.calloutIcon} />
              <div>
                <strong>Strict Rule:</strong> Presentations exceeding 10 slides may not be considered for evaluation in Round 1.
              </div>
            </div>
          </div>

          {/* Deliverable B: Complete Source Code ZIP */}
          <div>
            <FileUpload
              id="sourceCodeZipFile"
              name="sourceCodeZipFile"
              label="Complete Project Source Code (.zip)"
              accept=".zip,application/zip,application/x-zip-compressed"
              acceptedFormatsLabel="Standard ZIP archive containing source files & README (Max 50MB)"
              maxSizeBytes={maxZipSizeBytes}
              file={data.sourceCodeZipFile}
              error={errors.sourceCodeZipFile}
              required
              disabled={disabled}
              validationFn={validateZipFile}
              hint="Include all project source files, dependencies instructions, and configuration guidelines."
              onChange={(file) => onChange('sourceCodeZipFile', file)}
            />
            <div className={styles.calloutBox} style={{ marginTop: '10px' }}>
              <Info size={16} className={styles.calloutIcon} />
              <div>
                <strong>Packaging Note:</strong> Omit bulky compiled binaries or <code>node_modules</code>. Include a <code>README.md</code> with setup instructions.
              </div>
            </div>
          </div>
        </div>

        {/* Deliverable C & D: GitHub Repo URL & Live Demo URL */}
        <div className={styles.gridTwoCol}>
          <FormInput
            id="githubRepoUrl"
            name="githubRepoUrl"
            type="url"
            label="GitHub Repository URL"
            placeholder="https://github.com/username/project-name"
            required
            disabled={disabled}
            value={data.githubRepoUrl}
            error={errors.githubRepoUrl}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            }
            hint="Valid HTTPS repository URL. If private, grant access or share collaborator credentials where requested."
            onChange={(e) => onChange('githubRepoUrl', e.target.value)}
          />

          <FormInput
            id="liveDemoUrl"
            name="liveDemoUrl"
            type="url"
            label="Live Project Demo"
            placeholder="https://your-project.vercel.app"
            required
            disabled={disabled}
            value={data.liveDemoUrl}
            error={errors.liveDemoUrl}
            leftIcon={<Globe size={16} />}
            hint="Active deployment, hosted web app, or cloud demonstration accessible to evaluators."
            onChange={(e) => onChange('liveDemoUrl', e.target.value)}
          />
        </div>

        {/* Deliverable E: Demo Video URL (OPTIONAL) */}
        <div>
          <FormInput
            id="demoVideoUrl"
            name="demoVideoUrl"
            type="url"
            label="Demo Video Link (Optional)"
            placeholder="https://youtu.be/... or https://loom.com/share/..."
            disabled={disabled}
            value={data.demoVideoUrl}
            error={errors.demoVideoUrl}
            leftIcon={<Video size={16} />}
            hint="Optional 2–3 minute video walkthrough hosted on YouTube, Loom, or Google Drive (ensure public link access)."
            onChange={(e) => onChange('demoVideoUrl', e.target.value)}
          />
        </div>
      </div>
    </section>
  )
}
