import { FormInput } from '../Common/FormInput'
import { FormTextarea } from '../Common/FormTextarea'
import { TechStackPicker } from '../Common/TechStackPicker'
import type { FormErrors, ProjectTheme, ImplementationStatus, SubmissionFormData } from '../../types/submission'
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

const IMPLEMENTATION_STATUSES: { id: ImplementationStatus; label: string; desc: string }[] = [
  {
    id: 'Architecture & Ideation',
    label: 'Architecture & Design',
    desc: 'System diagrams, user flows, UI mockups, and planned technical specifications.',
  },
  {
    id: 'Working Prototype / MVP',
    label: 'Working Prototype / MVP',
    desc: 'Core feature implemented and verifiable with sample data.',
  },
  {
    id: 'Functional Alpha',
    label: 'Functional Alpha',
    desc: 'Integrated frontend and backend with majority user workflows operational.',
  },
  {
    id: 'Production Ready / Deployed',
    label: 'Production Ready',
    desc: 'Deployed on cloud infrastructure with live domain, authentication, and testing.',
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
          <span className={styles.sectionEyebrow}>Ideation & Architecture</span>
          <h2 id="section-project-heading" className={styles.sectionTitle}>
            Project Details
          </h2>
          <p className={styles.sectionDescription}>
            Articulate your problem statement, technical approach, innovation, and expected impact for Round 1 screening.
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        {/* Field 1: Project Title */}
        <FormInput
          id="projectTitle"
          name="projectTitle"
          label="Project Title"
          placeholder="e.g., VisionAssist: Low-Cost Spatial Audio Navigation for the Visually Impaired"
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

        {/* Field 3 & 4: Problem Statement & Proposed Solution */}
        <div className={styles.gridTwoCol}>
          <FormTextarea
            id="problemStatement"
            name="problemStatement"
            label="Problem Statement"
            placeholder="Clearly define the specific pain point or challenge your team is solving. Who experiences this problem and why do existing solutions fall short?"
            required
            rows={4}
            minLength={40}
            maxLength={1200}
            disabled={disabled}
            value={data.problemStatement}
            error={errors.problemStatement}
            hint="Be precise about the real-world challenge and context"
            onChange={(e) => onChange('problemStatement', e.target.value)}
          />

          <FormTextarea
            id="proposedSolution"
            name="proposedSolution"
            label="Proposed Solution"
            placeholder="Describe your engineered solution. How does your software/system address the root causes of the problem identified above?"
            required
            rows={4}
            minLength={40}
            maxLength={1200}
            disabled={disabled}
            value={data.proposedSolution}
            error={errors.proposedSolution}
            hint="Explain the methodology and user experience"
            onChange={(e) => onChange('proposedSolution', e.target.value)}
          />
        </div>

        {/* Field 5: Project Overview */}
        <FormTextarea
          id="projectOverview"
          name="projectOverview"
          label="Comprehensive Project Overview"
          placeholder="Summarize the core architecture, workflow, data flow, and components of your system. Explain how the pieces work together end-to-end."
          required
          rows={5}
          minLength={50}
          maxLength={1500}
          disabled={disabled}
          value={data.projectOverview}
          error={errors.projectOverview}
          hint="Comprehensive summary evaluated by technical judges"
          onChange={(e) => onChange('projectOverview', e.target.value)}
        />

        {/* Field 6 & 7: Key Features & Target Users/Impact */}
        <div className={styles.gridTwoCol}>
          <FormTextarea
            id="keyFeatures"
            name="keyFeatures"
            label="Key Features & Functionality"
            placeholder="1. Real-time spatial audio processing\n2. Offline edge inference\n3. High-contrast accessible navigation UI\n4. Automated emergency telemetry"
            required
            rows={4}
            minLength={30}
            maxLength={1500}
            disabled={disabled}
            value={data.keyFeatures}
            error={errors.keyFeatures}
            hint="Highlight primary capabilities, user workflows, or algorithms"
            onChange={(e) => onChange('keyFeatures', e.target.value)}
          />

          <FormTextarea
            id="targetUsersAndImpact"
            name="targetUsersAndImpact"
            label="Target Users & Expected Impact"
            placeholder="Define your beneficiaries (students, persons with disabilities, unbanked individuals, SMBs) and measurable outcomes (reduced latency, accessibility metrics, cost reduction)."
            required
            rows={4}
            minLength={30}
            maxLength={1200}
            disabled={disabled}
            value={data.targetUsersAndImpact}
            error={errors.targetUsersAndImpact}
            hint="Quantify expected societal, economic, or technical benefits"
            onChange={(e) => onChange('targetUsersAndImpact', e.target.value)}
          />
        </div>

        {/* Field 8: Tech Stack Picker */}
        <TechStackPicker
          techStack={data.techStack}
          required
          disabled={disabled}
          error={errors.techStack}
          onChange={(tags) => onChange('techStack', tags)}
        />

        {/* Field 9: Innovation and Uniqueness */}
        <FormTextarea
          id="innovationUniqueness"
          name="innovationUniqueness"
          label="Innovation & Uniqueness"
          placeholder="What sets your project apart from standard implementations or commercial alternatives? Highlight novel algorithms, creative integrations, low computational footprint, or user-centric adaptations."
          required
          rows={4}
          minLength={30}
          maxLength={1200}
          disabled={disabled}
          value={data.innovationUniqueness}
          error={errors.innovationUniqueness}
          hint="Help evaluators recognize your creative technical differentiators"
          onChange={(e) => onChange('innovationUniqueness', e.target.value)}
        />

        {/* Field 10: Current Implementation Status */}
        <div>
          <div className={styles.labelRow} style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--foreground)' }}>
              Current Implementation Status <span style={{ color: 'var(--brand-red)' }}>*</span>
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--foreground-subtle)' }}>Select stage</span>
          </div>

          <div className={`${styles.radioGrid} ${styles.radioGridFour}`}>
            {IMPLEMENTATION_STATUSES.map((status) => {
              const isSelected = data.implementationStatus === status.id
              return (
                <div
                  key={status.id}
                  className={`${styles.radioCard} ${isSelected ? styles.radioCardSelected : ''}`}
                  onClick={() => !disabled && onChange('implementationStatus', status.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      !disabled && onChange('implementationStatus', status.id)
                    }
                  }}
                >
                  <div className={styles.radioCardTitle}>
                    <span style={{ fontSize: '0.86rem' }}>{status.label}</span>
                    <div className={styles.radioIndicator}>
                      {isSelected && <div className={styles.radioDot} />}
                    </div>
                  </div>
                  <p className={styles.radioCardDesc}>{status.desc}</p>
                </div>
              )
            })}
          </div>

          {errors.implementationStatus && (
            <p className={styles.errorMessage} role="alert" style={{ color: '#ff9296', marginTop: '6px' }}>
              {errors.implementationStatus}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
