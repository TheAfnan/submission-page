import { ArrowLeft, ChevronRight, Flame } from 'lucide-react'
import styles from './Header.module.css'

interface HeaderProps {
  backToEventUrl?: string
}

export const Header: React.FC<HeaderProps> = ({
  backToEventUrl = 'https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon',
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="https://spirit-dsmnru.vercel.app/" className={styles.breadcrumbLink}>
              Home
            </a>
            <ChevronRight size={12} className={styles.breadcrumbSep} />
            <a href="https://spirit-dsmnru.vercel.app/events" className={styles.breadcrumbLink}>
              Events
            </a>
            <ChevronRight size={12} className={styles.breadcrumbSep} />
            <a href={backToEventUrl} className={styles.breadcrumbLink}>
              SPIRIT 3.0
            </a>
            <ChevronRight size={12} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbActive} aria-current="page">
              Submission
            </span>
          </nav>

          {/* Branding and Page Title */}
          <div className={styles.brandingRow}>
            <div className={styles.logoBadge} aria-hidden="true">
              <span className={styles.logoFlame}>
                <Flame size={20} />
              </span>
            </div>

            <div className={styles.titleInfo}>
              <div className={styles.eventEyebrow}>
                <span>SPIRIT 3.0 – BUILDATHON</span>
                <span className={styles.universityTag}>DSMNRU Lucknow</span>
              </div>
              <h1 className={styles.pageTitle}>Project Submission</h1>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>

          {/* Back to event link */}
          <a
            href={backToEventUrl}
            className={styles.backBtn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Back to SPIRIT 3.0 event page"
          >
            <ArrowLeft size={16} />
            <span>Back to Event</span>
          </a>
        </div>
      </div>
    </header>
  )
}
