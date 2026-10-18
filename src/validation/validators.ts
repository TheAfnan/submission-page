import type { FormErrors, SubmissionFormData, PortalConfig } from '../types/submission'

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const PHONE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$|^(\+[1-9]{1}[0-9]{0,2}[\-\s]?)?[0-9]{10,14}$/
export const GITHUB_URL_REGEX = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/
export const HTTPS_URL_REGEX = /^https:\/\/[A-Za-z0-9\-_.]+(\.[A-Za-z0-9\-_]+)+([/?#].*)?$/i

export const ALLOWED_PRESENTATION_EXTENSIONS = ['.pdf', '.ppt', '.pptx']
export const ALLOWED_PRESENTATION_MIMES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

export const ALLOWED_ZIP_EXTENSIONS = ['.zip']
export const ALLOWED_ZIP_MIMES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream', // Windows often sends zip as octet-stream
]

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  return PHONE_REGEX.test(cleaned)
}

export function isValidGithubUrl(url: string): boolean {
  return GITHUB_URL_REGEX.test(url.trim())
}

export function isValidHttpsUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed.startsWith('https://')) return false
  return HTTPS_URL_REGEX.test(trimmed)
}

export function validatePresentationFile(file: File | null, maxSizeBytes: number): string | null {
  if (!file) {
    return 'Presentation file is required (PDF, PPT, or PPTX, 8–10 slides).'
  }

  const name = file.name.toLowerCase()
  const hasValidExt = ALLOWED_PRESENTATION_EXTENSIONS.some((ext) => name.endsWith(ext))
  if (!hasValidExt) {
    return 'Invalid file format. Only PDF, PPT, and PPTX files are accepted.'
  }

  // MIME check if provided by browser
  if (file.type && !ALLOWED_PRESENTATION_MIMES.includes(file.type)) {
    // If extension is valid but mime is weird octet-stream, allow if extension matches
    if (!ALLOWED_PRESENTATION_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      return 'Unsupported presentation file MIME type.'
    }
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024))
    return `Presentation file exceeds the maximum allowed size of ${maxMb}MB.`
  }

  if (file.size === 0) {
    return 'The selected presentation file appears to be empty.'
  }

  return null
}

export function validateZipFile(file: File | null, maxSizeBytes: number): string | null {
  if (!file) {
    return 'Complete project source code ZIP file is required.'
  }

  const name = file.name.toLowerCase()
  const hasValidExt = ALLOWED_ZIP_EXTENSIONS.some((ext) => name.endsWith(ext))
  if (!hasValidExt) {
    return 'Invalid file format. Only .zip archive files are accepted.'
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024))
    return `Source code ZIP exceeds the maximum allowed size of ${maxMb}MB.`
  }

  if (file.size === 0) {
    return 'The selected ZIP file appears to be empty.'
  }

  return null
}

export function validateForm(data: SubmissionFormData, config: PortalConfig): FormErrors {
  const errors: FormErrors = {}

  // 1. Team Details
  if (!data.teamName.trim()) {
    errors.teamName = 'Team name is required.'
  } else if (data.teamName.trim().length < 2) {
    errors.teamName = 'Team name must be at least 2 characters.'
  } else if (data.teamName.trim().length > 60) {
    errors.teamName = 'Team name cannot exceed 60 characters.'
  }

  if (!data.leaderName.trim()) {
    errors.leaderName = "Team leader's full name is required."
  } else if (data.leaderName.trim().length < 2) {
    errors.leaderName = 'Leader name must be at least 2 characters.'
  }

  if (!data.leaderEmail.trim()) {
    errors.leaderEmail = "Team leader's email address is required."
  } else if (!isValidEmail(data.leaderEmail)) {
    errors.leaderEmail = 'Please provide a valid email address (e.g., leader@example.com).'
  }

  if (!data.leaderMobile.trim()) {
    errors.leaderMobile = "Team leader's mobile number is required."
  } else if (!isValidPhone(data.leaderMobile)) {
    errors.leaderMobile = 'Please enter a valid 10-digit mobile number.'
  }

  if (!data.collegeName.trim()) {
    errors.collegeName = 'College or University name is required.'
  } else if (data.collegeName.trim().length < 3) {
    errors.collegeName = 'Please enter a valid institution name.'
  }

  if (!data.cityState.trim()) {
    errors.cityState = 'City and State are required (e.g., Lucknow, Uttar Pradesh).'
  } else if (data.cityState.trim().length < 3) {
    errors.cityState = 'Please enter city and state.'
  }

  // Team members validation
  const totalMembers = data.teamMembers.length
  if (totalMembers < config.minTeamSize) {
    errors.teamMembers = `Team must have at least ${config.minTeamSize} member.`
  } else if (totalMembers > config.maxTeamSize) {
    errors.teamMembers = `Team cannot exceed ${config.maxTeamSize} members.`
  }

  // Check each member
  const seenEmails = new Set<string>()
  if (data.leaderEmail && data.leaderEmail.trim()) {
    seenEmails.add(data.leaderEmail.trim().toLowerCase())
  }
  if (data.teamMembers[0]?.email?.trim()) {
    seenEmails.add(data.teamMembers[0].email.trim().toLowerCase())
  }

  data.teamMembers.forEach((member, index) => {
    if (index === 0) {
      // Leader is always index 0
      return
    }
    if (!member.name.trim()) {
      errors[`member_${member.id}_name`] = `Member #${index + 1} name is required.`
    }
    if (member.email.trim()) {
      if (!isValidEmail(member.email)) {
        errors[`member_${member.id}_email`] = `Member #${index + 1} has an invalid email address.`
      } else {
        const lower = member.email.trim().toLowerCase()
        if (seenEmails.has(lower)) {
          errors[`member_${member.id}_email`] = `Duplicate email detected: ${member.email}`
        }
        seenEmails.add(lower)
      }
    }
  })

  // 2. Project Details
  if (!data.projectTitle.trim()) {
    errors.projectTitle = 'Project title is required.'
  } else if (data.projectTitle.trim().length < 3) {
    errors.projectTitle = 'Project title must be at least 3 characters.'
  } else if (data.projectTitle.trim().length > 100) {
    errors.projectTitle = 'Project title cannot exceed 100 characters.'
  }

  if (!data.theme) {
    errors.theme = 'Please select a competition theme.'
  }

  if (!data.problemStatement.trim()) {
    errors.problemStatement = 'Problem statement is required.'
  } else if (data.problemStatement.trim().length < 40) {
    errors.problemStatement = 'Problem statement is too brief (minimum 40 characters).'
  } else if (data.problemStatement.trim().length > 1200) {
    errors.problemStatement = 'Problem statement cannot exceed 1200 characters.'
  }

  if (!data.proposedSolution.trim()) {
    errors.proposedSolution = 'Proposed solution is required.'
  } else if (data.proposedSolution.trim().length < 40) {
    errors.proposedSolution = 'Proposed solution is too brief (minimum 40 characters).'
  } else if (data.proposedSolution.trim().length > 1200) {
    errors.proposedSolution = 'Proposed solution cannot exceed 1200 characters.'
  }

  if (!data.projectOverview.trim()) {
    errors.projectOverview = 'Project overview is required.'
  } else if (data.projectOverview.trim().length < 50) {
    errors.projectOverview = 'Project overview is too brief (minimum 50 characters).'
  } else if (data.projectOverview.trim().length > 1500) {
    errors.projectOverview = 'Project overview cannot exceed 1500 characters.'
  }

  if (!data.keyFeatures.trim()) {
    errors.keyFeatures = 'Key features and functionality are required.'
  } else if (data.keyFeatures.trim().length < 30) {
    errors.keyFeatures = 'Key features description is too brief (minimum 30 characters).'
  } else if (data.keyFeatures.trim().length > 1500) {
    errors.keyFeatures = 'Key features cannot exceed 1500 characters.'
  }

  if (!data.targetUsersAndImpact.trim()) {
    errors.targetUsersAndImpact = 'Target users and expected impact are required.'
  } else if (data.targetUsersAndImpact.trim().length < 30) {
    errors.targetUsersAndImpact = 'Target users and impact is too brief (minimum 30 characters).'
  } else if (data.targetUsersAndImpact.trim().length > 1200) {
    errors.targetUsersAndImpact = 'Target users and impact cannot exceed 1200 characters.'
  }

  if (!data.techStack || data.techStack.length === 0) {
    errors.techStack = 'Please specify at least one technology, framework, language, or tool.'
  }

  if (!data.innovationUniqueness.trim()) {
    errors.innovationUniqueness = 'Innovation and uniqueness description is required.'
  } else if (data.innovationUniqueness.trim().length < 30) {
    errors.innovationUniqueness = 'Innovation description is too brief (minimum 30 characters).'
  } else if (data.innovationUniqueness.trim().length > 1200) {
    errors.innovationUniqueness = 'Innovation description cannot exceed 1200 characters.'
  }

  if (!data.implementationStatus) {
    errors.implementationStatus = 'Please indicate the current implementation status.'
  }

  // 3. Submissions
  const presentationErr = validatePresentationFile(data.presentationFile, config.maxPresentationSizeBytes)
  if (presentationErr) {
    errors.presentationFile = presentationErr
  }

  const zipErr = validateZipFile(data.sourceCodeZipFile, config.maxZipSizeBytes)
  if (zipErr) {
    errors.sourceCodeZipFile = zipErr
  }

  if (!data.githubRepoUrl.trim()) {
    errors.githubRepoUrl = 'GitHub repository URL is required.'
  } else if (!isValidGithubUrl(data.githubRepoUrl)) {
    errors.githubRepoUrl = 'Please enter a valid HTTPS GitHub repository URL (e.g., https://github.com/username/repo).'
  }

  if (!data.liveDemoUrl.trim()) {
    errors.liveDemoUrl = 'Live demo URL is required.'
  } else if (!isValidHttpsUrl(data.liveDemoUrl)) {
    errors.liveDemoUrl = 'Please enter a valid HTTPS live demo link (e.g., https://my-project.vercel.app).'
  }

  // Demo video URL is OPTIONAL
  if (data.demoVideoUrl && data.demoVideoUrl.trim() !== '') {
    if (!isValidHttpsUrl(data.demoVideoUrl)) {
      errors.demoVideoUrl = 'Please enter a valid HTTPS URL (YouTube, Loom, Google Drive, etc.).'
    }
  }

  // 4. Declarations
  if (!data.declarationAccuracy) {
    errors.declarationAccuracy = 'You must confirm that the provided information and links are accurate.'
  }
  if (!data.declarationOriginality) {
    errors.declarationOriginality = 'You must confirm that the submitted project materials belong to your team or are used with proper permission.'
  }
  if (!data.declarationSlideCount) {
    errors.declarationSlideCount = 'You must acknowledge the 8–10 slide presentation requirement.'
  }

  return errors
}
