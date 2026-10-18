export type ProjectTheme =
  | 'Assistive Technology'
  | 'Fintech & Security'
  | 'Open Innovation'

export type ImplementationStatus =
  | 'Architecture & Ideation'
  | 'Working Prototype / MVP'
  | 'Functional Alpha'
  | 'Production Ready / Deployed'

export interface TeamMember {
  id: string
  name: string
  email: string
  isLeader: boolean
  role?: string
}

export interface SubmissionFormData {
  // Section 1: Team Details
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderMobile: string
  collegeName: string
  cityState: string
  teamMembers: TeamMember[]

  // Section 2: Project Details
  projectTitle: string
  theme: ProjectTheme | ''
  problemStatement: string
  proposedSolution: string
  projectOverview: string
  keyFeatures: string
  targetUsersAndImpact: string
  techStack: string[]
  innovationUniqueness: string
  implementationStatus: ImplementationStatus | ''

  // Section 3: Submissions
  presentationFile: File | null
  sourceCodeZipFile: File | null
  githubRepoUrl: string
  liveDemoUrl: string
  demoVideoUrl: string

  // Section 4: Declarations
  declarationAccuracy: boolean
  declarationOriginality: boolean
  declarationSlideCount: boolean
}

export interface FormErrors {
  [key: string]: string | undefined
}

export interface SubmissionResult {
  submissionId: string
  submittedAt: string
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderMobile: string
  collegeName: string
  cityState: string
  memberCount: number
  projectTitle: string
  theme: string
  implementationStatus: string
  techStack: string[]
  presentationFileName: string
  presentationFileSize: number
  sourceCodeZipFileName: string
  sourceCodeZipFileSize: number
  githubRepoUrl: string
  liveDemoUrl: string
  demoVideoUrl?: string
  status: 'RECEIVED' | 'UNDER_REVIEW' | 'ACCEPTED'
  message: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

export interface PortalConfig {
  mode: 'demo' | 'production'
  apiBaseUrl: string
  submissionDeadline: string // ISO date string
  maxTeamSize: number
  minTeamSize: number
  maxPresentationSizeBytes: number // Default: 25MB
  maxZipSizeBytes: number // Default: 50MB
  eventTitle: string
  roundTitle: string
  eventDate: string
  backToEventUrl: string
}
