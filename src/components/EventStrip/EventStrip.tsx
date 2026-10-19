import React from 'react'
import { Info } from 'lucide-react'
import styles from './EventStrip.module.css'

interface EventStripProps {
  deadlineIso?: string
  eventDate?: string
  roundTitle?: string
  eventTitle?: string
  mode?: 'demo' | 'production'
}

export const EventStrip: React.FC<EventStripProps> = ({ mode = 'demo' }) => {
  if (mode !== 'demo') return null

  return (
    <section className={styles.section} aria-label="Event overview and guidelines">
      <div className={styles.container}>
        {/* Mode advisory notice */}
        <div className={styles.demoNotice} role="status">
          <Info size={16} className={styles.demoNoticeIcon} />
          <div className={styles.demoNoticeText}>
            <strong>Demo & Integration Mode Active:</strong> You can test validations, drag-and-drop file uploads, review modals, and simulated submissions safely without connecting to a live DSMNRU production database. Toggle to <em>Production Mode</em> in the header or via <code>VITE_APP_MODE=production</code> for real HTTP submission endpoints.
          </div>
        </div>
      </div>
    </section>
  )
}
