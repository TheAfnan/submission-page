import { FormInput } from '../Common/FormInput'
import { FormTextarea } from '../Common/FormTextarea'
import { TechStackPicker } from '../Common/TechStackPicker'
import type { FormErrors, ProjectTheme, SubmissionFormData } from '../../types/submission'
import styles from './FormSections.module.css'

interface SectionProjectProps {
  data: SubmissionFormData
  errors: FormErrors
  disabled?: boolean
  onChange: <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => void
}

const THEMES: { id: ProjectTheme; label: string; desc: string }[] = [
  {
    id: 'Assistive Technology',
    label: 'Assistive Technology',
    desc: 'Empowering individuals with diverse abilities through accessible hardware, software, or AI solutions.',
  },
  {
    id: 'Fintech & Security',
    label: 'Fintech & Security',
    desc: 'Next-gen payment rails, fraud prevention, zero-trust architectures, cryptography, and financial inclusion.',
  },
  {
    id: 'Open Innovation',
    label: 'Open Innovation',
    desc: 'High-impact solutions across healthcare, education, sustainability, robotics, and social technologies.',
  },
]

export const SectionProject: React.FC<SectionProjectProps> = ({
  data,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <section className={styles.sectionCard} aria-labelledby="section-project-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumberBadge}>02</div>
        <div className={styles.sectionTitleWrap}>
          <span className={styles.sectionEyebrow}>Project Overview</span>
          <h2 id="section-project-heading" className={styles.sectionTitle}>
            Project Details
          </h2>
          <p className={styles.sectionDescription}>
            Provide your project title, competition theme, brief summary, and technology stack.
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        {/* Field 1: Project Title */}
        <FormInput
          id="projectTitle"
          name="projectTitle"
          label="Project Title"
          placeholder="e.g., VisionAssist: Spatial Audio Navigation"
          required
          maxLength={100}
          disabled={disabled}
          value={data.projectTitle}
          error={errors.projectTitle}
          hint="Clear, descriptive title summarizing the solution"
          onChange={(e) => onChange('projectTitle', e.target.value)}
        />

        {/* Field 2: Selected Theme */}
        <div>
          <div className={styles.labelRow} style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--foreground)' }}>
              Selected Competition Theme <span style={{ color: 'var(--brand-red)' }}>*</span>
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--foreground-subtle)' }}>Select one</span>
          </div>

          <div className={styles.radioGrid}>
            {THEMES.map((theme) => {
              const isSelected = data.theme === theme.id
              return (
                <div
                  key={theme.id}
                  className={`${styles.radioCard} ${isSelected ? styles.radioCardSelected : ''}`}
                  onClick={() => !disabled && onChange('theme', theme.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      !disabled && onChange('theme', theme.id)
                    }
                  }}
                >
                  <div className={styles.radioCardTitle}>
                    <span>{theme.label}</span>
                    <div className={styles.radioIndicator}>
                      {isSelected && <div className={styles.radioDot} />}
                    </div>
                  </div>
                  <p className={styles.radioCardDesc}>{theme.desc}</p>
                </div>
              )
            })}
          </div>

          {errors.theme && (
            <p className={styles.errorMessage} role="alert" style={{ color: '#ff9296', marginTop: '6px' }}>
              {errors.theme}
            </p>
          )}
        </div>

        {/* Field 3: Project Summary / Description */}
        <FormTextarea
          id="projectDescription"
          name="projectDescription"
          label="Project Summary & Overview"
          placeholder="Briefly describe what your project does, the core problem it solves, key features, and how it works..."
          required
          rows={4}
          minLength={15}
          maxLength={1500}
          disabled={disabled}
          value={data.projectDescription}
          error={errors.projectDescription}
          hint="A concise overview for evaluators. Additional detailed architecture is included in your PPT."
          onChange={(e) => onChange('projectDescription', e.target.value)}
        />

        {/* Field 4: Tech Stack Picker */}
        <TechStackPicker
          techStack={data.techStack}
          required
          disabled={disabled}
          error={errors.techStack}
          onChange={(tags) => onChange('techStack', tags)}
        />
      </div>
    </section>
  )
}
