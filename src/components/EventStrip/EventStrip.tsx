import React, { useEffect, useState } from 'react'
import { Calendar, Clock, AlertTriangle, FileText, Info } from 'lucide-react'
import styles from './EventStrip.module.css'

interface EventStripProps {
  deadlineIso?: string
  eventDate?: string
  roundTitle?: string
  eventTitle?: string
  mode?: 'demo' | 'production'
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export const EventStrip: React.FC<EventStripProps> = ({
  deadlineIso = '2026-10-24T23:59:59+05:30',
  eventDate = '24 October 2026',
  roundTitle = 'Round 1 – Idea Screening & PPT Submission',
  eventTitle = 'SPIRIT 3.0 – Buildathon',
  mode = 'demo',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeLeft(deadlineIso))

  function calculateTimeLeft(deadline: string): TimeRemaining {
    const diff = new Date(deadline).getTime() - new Date().getTime()
    if (diff <= 0 || isNaN(diff)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: diff <= 0 }
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadlineIso))
    }, 1000)
    return () => clearInterval(timer)
  }, [deadlineIso])

  const formattedDeadline = (() => {
    try {
      const d = new Date(deadlineIso)
      if (isNaN(d.getTime())) return deadlineIso
      return d.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return deadlineIso
    }
  })()

  return (
    <section className={styles.section} aria-label="Event overview and guidelines">
      <div className={styles.container}>
        {/* Top Info Cards */}
        <div className={styles.stripGrid}>
          {/* Card 1: Event & Round */}
          <div className={styles.infoCard}>
            <div className={styles.iconCircle}>
              <Calendar size={18} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardEyebrow}>{eventTitle}</span>
              <strong className={styles.cardHeading}>{roundTitle}</strong>
              <span className={styles.cardSub}>Date: {eventDate} • Format: Hybrid</span>
            </div>
          </div>

          {/* Card 2: Slide Rule */}
          <div className={`${styles.infoCard} ${styles.infoCardRule}`}>
            <div className={`${styles.iconCircle} ${styles.iconRule}`}>
              <FileText size={18} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardEyebrow}>Evaluation Rule</span>
              <strong className={styles.cardHeading}>8–10 Slides Presentation Required</strong>
              <p className={styles.ruleNotice}>
                Presentations exceeding 10 slides will <strong>not</strong> be considered for evaluation.
              </p>
            </div>
          </div>

          {/* Card 3: Configurable Deadline & Timer */}
          <div className={styles.infoCard}>
            <div className={styles.iconCircle}>
              <Clock size={18} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardEyebrow}>Submission Deadline</span>
              <strong className={styles.cardHeading}>{formattedDeadline}</strong>
              <div className={styles.timerWrap}>
                {timeLeft.isExpired ? (
                  <span className={styles.expiredBadge}>
                    <AlertTriangle size={12} /> Deadline Closed
                  </span>
                ) : (
                  <div className={styles.countdownUnits}>
                    <div className={styles.cUnit}>
                      <span className={styles.cVal}>{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className={styles.cLabel}>Days</span>
                    </div>
                    <span className={styles.cSep}>:</span>
                    <div className={styles.cUnit}>
                      <span className={styles.cVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className={styles.cLabel}>Hours</span>
                    </div>
                    <span className={styles.cSep}>:</span>
                    <div className={styles.cUnit}>
                      <span className={styles.cVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className={styles.cLabel}>Mins</span>
                    </div>
                    <span className={styles.cSep}>:</span>
                    <div className={styles.cUnit}>
                      <span className={styles.cVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className={styles.cLabel}>Secs</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mode advisory notice */}
        {mode === 'demo' && (
          <div className={styles.demoNotice} role="status">
            <Info size={16} className={styles.demoNoticeIcon} />
            <div className={styles.demoNoticeText}>
              <strong>Demo & Integration Mode Active:</strong> You can test validations, drag-and-drop file uploads, review modals, and simulated submissions safely without connecting to a live DSMNRU production database. Toggle to <em>Production Mode</em> in the header or via <code>VITE_APP_MODE=production</code> for real HTTP submission endpoints.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
