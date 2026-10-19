import React from 'react'
import { Flame } from 'lucide-react'
import styles from './Header.module.css'

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
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
      </div>
    </header>
  )
}
