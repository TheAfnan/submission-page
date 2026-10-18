import React from 'react'
import { Users, UserPlus, Trash2, Mail, Phone, School, MapPin } from 'lucide-react'
import { FormInput } from '../Common/FormInput'
import type { FormErrors, SubmissionFormData, TeamMember } from '../../types/submission'
import styles from './FormSections.module.css'

interface SectionTeamProps {
  data: SubmissionFormData
  errors: FormErrors
  maxTeamSize: number
  minTeamSize: number
  disabled?: boolean
  onChange: <K extends keyof SubmissionFormData>(field: K, value: SubmissionFormData[K]) => void
}

export const SectionTeam: React.FC<SectionTeamProps> = ({
  data,
  errors,
  maxTeamSize,
  minTeamSize,
  disabled,
  onChange,
}) => {
  // Sync leader info with Member #1
  const handleLeaderNameChange = (name: string) => {
    onChange('leaderName', name)
    const updatedMembers = [...data.teamMembers]
    if (updatedMembers[0]) {
      updatedMembers[0] = { ...updatedMembers[0], name }
      onChange('teamMembers', updatedMembers)
    }
  }

  const handleLeaderEmailChange = (email: string) => {
    onChange('leaderEmail', email)
    const updatedMembers = [...data.teamMembers]
    if (updatedMembers[0]) {
      updatedMembers[0] = { ...updatedMembers[0], email }
      onChange('teamMembers', updatedMembers)
    }
  }

  const handleAddMember = () => {
    if (data.teamMembers.length >= maxTeamSize) return
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      isLeader: false,
      role: 'Member',
    }
    onChange('teamMembers', [...data.teamMembers, newMember])
  }

  const handleRemoveMember = (id: string) => {
    if (data.teamMembers.length <= minTeamSize) return
    const updated = data.teamMembers.filter((m) => m.id !== id)
    onChange('teamMembers', updated)
  }

  const handleMemberChange = (id: string, field: 'name' | 'email', value: string) => {
    const updated = data.teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    onChange('teamMembers', updated)
  }

  const canAddMore = data.teamMembers.length < maxTeamSize

  return (
    <section className={styles.sectionCard} aria-labelledby="section-team-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionNumberBadge}>01</div>
        <div className={styles.sectionTitleWrap}>
          <span className={styles.sectionEyebrow}>Participation & Composition</span>
          <h2 id="section-team-heading" className={styles.sectionTitle}>
            Team Details
          </h2>
          <p className={styles.sectionDescription}>
            Provide details of your team and university affiliation. You may include between{' '}
            {minTeamSize} and {maxTeamSize} members.
          </p>
        </div>
      </div>

      <div className={styles.stack}>
        {/* Row 1: Team Name & Institution */}
        <div className={styles.gridTwoCol}>
          <FormInput
            id="teamName"
            name="teamName"
            label="Team Name"
            placeholder="e.g., CyberPulse Innovators"
            required
            disabled={disabled}
            value={data.teamName}
            error={errors.teamName}
            hint="Choose a recognizable team name for evaluation records"
            onChange={(e) => onChange('teamName', e.target.value)}
          />

          <FormInput
            id="collegeName"
            name="collegeName"
            label="College / University Name"
            placeholder="e.g., DSMNRU, Lucknow"
            required
            disabled={disabled}
            value={data.collegeName}
            error={errors.collegeName}
            leftIcon={<School size={16} />}
            onChange={(e) => onChange('collegeName', e.target.value)}
          />
        </div>

        {/* Row 2: Location & Team Size */}
        <div className={styles.gridTwoCol}>
          <FormInput
            id="cityState"
            name="cityState"
            label="City and State"
            placeholder="e.g., Lucknow, Uttar Pradesh"
            required
            disabled={disabled}
            value={data.cityState}
            error={errors.cityState}
            leftIcon={<MapPin size={16} />}
            onChange={(e) => onChange('cityState', e.target.value)}
          />

          <div className={styles.calloutBox}>
            <Users size={18} className={styles.calloutIcon} />
            <div>
              <strong>Team Size: {data.teamMembers.length} Members</strong>
              <div>
                Allowed range: {minTeamSize} to {maxTeamSize} members. All members are listed in the official record.
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Team Leader Details */}
        <div className={styles.gridTwoCol}>
          <FormInput
            id="leaderName"
            name="leaderName"
            label="Team Leader Full Name"
            placeholder="e.g., Aisha Verma"
            required
            disabled={disabled}
            value={data.leaderName}
            error={errors.leaderName}
            onChange={(e) => handleLeaderNameChange(e.target.value)}
          />

          <FormInput
            id="leaderEmail"
            name="leaderEmail"
            type="email"
            label="Team Leader Email Address"
            placeholder="e.g., aisha.verma@example.com"
            required
            disabled={disabled}
            value={data.leaderEmail}
            error={errors.leaderEmail}
            leftIcon={<Mail size={16} />}
            hint="Primary email used for official announcements and shortlists"
            onChange={(e) => handleLeaderEmailChange(e.target.value)}
          />
        </div>

        {/* Row 4: Leader Phone */}
        <div className={styles.gridTwoCol}>
          <FormInput
            id="leaderMobile"
            name="leaderMobile"
            type="tel"
            label="Team Leader Mobile Number"
            placeholder="e.g., 9876543210"
            required
            disabled={disabled}
            value={data.leaderMobile}
            error={errors.leaderMobile}
            leftIcon={<Phone size={16} />}
            hint="10-digit WhatsApp/calling number for urgent hackathon updates"
            onChange={(e) => onChange('leaderMobile', e.target.value)}
          />
        </div>

        {/* Dynamic Members Section */}
        <div className={styles.membersWrap}>
          <div className={styles.membersHeaderRow}>
            <div className={styles.membersSubheading}>
              <span>All Team Members ({data.teamMembers.length})</span>
              <span className={styles.memberCountBadge}>
                {data.teamMembers.length} / {maxTeamSize}
              </span>
            </div>

            <button
              type="button"
              className={styles.addMemberBtn}
              onClick={handleAddMember}
              disabled={disabled || !canAddMore}
              title={canAddMore ? 'Add team member' : `Maximum team size is ${maxTeamSize}`}
            >
              <UserPlus size={15} />
              <span>Add Team Member</span>
            </button>
          </div>

          {errors.teamMembers && (
            <p className={styles.errorMessage} role="alert" style={{ color: '#ff9296' }}>
              {errors.teamMembers}
            </p>
          )}

          {/* Members list */}
          <div className={styles.stack}>
            {data.teamMembers.map((member, idx) => {
              const isLeader = idx === 0
              return (
                <div
                  key={member.id}
                  className={`${styles.memberCard} ${isLeader ? styles.memberCardLeader : ''}`}
                >
                  <div className={styles.memberCardTop}>
                    <div className={styles.memberCardTitle}>
                      <span>Member #{idx + 1}</span>
                      {isLeader && <span className={styles.leaderPill}>Team Leader</span>}
                    </div>

                    {!isLeader && (
                      <button
                        type="button"
                        className={styles.removeMemberBtn}
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={disabled}
                        aria-label={`Remove Member #${idx + 1}`}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className={styles.gridTwoCol}>
                    <FormInput
                      id={`member-${member.id}-name`}
                      label={`Full Name ${isLeader ? '(Leader)' : ''}`}
                      placeholder={isLeader ? data.leaderName || 'Full Name' : 'Member Name'}
                      required
                      disabled={disabled || isLeader}
                      value={isLeader ? data.leaderName : member.name}
                      error={errors[`member_${member.id}_name`]}
                      onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                    />

                    <FormInput
                      id={`member-${member.id}-email`}
                      type="email"
                      label={`Email Address ${isLeader ? '(Required)' : '(Optional)'}`}
                      placeholder={isLeader ? data.leaderEmail || 'email@example.com' : 'Optional member email'}
                      required={isLeader}
                      disabled={disabled || isLeader}
                      value={isLeader ? data.leaderEmail : member.email}
                      error={errors[`member_${member.id}_email`]}
                      onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
