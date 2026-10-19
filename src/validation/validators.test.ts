import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidPhone,
  isValidGithubUrl,
  isValidHttpsUrl,
  validatePresentationFile,
  validateZipFile,
  validateForm,
} from './validators'
import type { PortalConfig, SubmissionFormData } from '../types/submission'

const TEST_CONFIG: PortalConfig = {
  mode: 'demo',
  apiBaseUrl: 'https://api.example.com',
  submissionDeadline: '2026-10-24T23:59:59+05:30',
  maxTeamSize: 4,
  minTeamSize: 1,
  maxPresentationSizeBytes: 25 * 1024 * 1024,
  maxZipSizeBytes: 50 * 1024 * 1024,
  eventTitle: 'SPIRIT 3.0 – Buildathon',
  roundTitle: 'Round 1 – Idea Screening & PPT Submission',
  eventDate: '24 October 2026',
  backToEventUrl: 'https://spirit-dsmnru.vercel.app/events/spirit-3-0-buildathon',
}

const VALID_FORM_DATA: SubmissionFormData = {
  teamName: 'NeuralCrafters',
  leaderName: 'Aman Yadav',
  leaderEmail: 'aman.yadav@example.com',
  leaderMobile: '9876543210',
  collegeName: 'Dr. Shakuntala Misra National Rehabilitation University, Lucknow',
  cityState: 'Lucknow, Uttar Pradesh',
  teamMembers: [
    {
      id: '1',
      name: 'Aman Yadav',
      email: 'aman.yadav@example.com',
      isLeader: true,
      role: 'Team Leader',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      isLeader: false,
      role: 'Member',
    },
  ],
  projectTitle: 'VoiceVision: Assistive Navigation for the Visually Impaired',
  theme: 'Assistive Technology',
  projectDescription: 'A low-cost spatial audio edge wearable that processes real-time LiDAR and camera streams to deliver tactile and 3D binaural directional sound cues for visually impaired students.',
  targetUsersAndImpact:
    'Targeting over 12,000 university students with low vision in India, providing 94% obstacle clearance confidence and eliminating dependency on human guides.',
  techStack: ['Python', 'OpenCV', 'PyTorch', 'React', 'FastAPI'],
  innovationUniqueness:
    'Unlike expensive commercial smart glasses costing over $2,000, VoiceVision runs on accessible commodity hardware with custom quantization, reducing BOM to under $40.',
  implementationStatus: 'Working Prototype / MVP',
  presentationFile: new File(['mock presentation content'], 'voicevision-presentation.pdf', {
    type: 'application/pdf',
  }),
  sourceCodeZipFile: new File(['mock zip content'], 'voicevision-source.zip', {
    type: 'application/zip',
  }),
  githubRepoUrl: 'https://github.com/neuralcrafters/voicevision',
  liveDemoUrl: 'https://voicevision-dsmnru.vercel.app',
  demoVideoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  declarationAccuracy: true,
  declarationOriginality: true,
  declarationSlideCount: true,
}

describe('Validators Unit Tests', () => {
  describe('Email validation', () => {
    it('should accept valid email addresses', () => {
      expect(isValidEmail('test@dsmnru.ac.in')).toBe(true)
      expect(isValidEmail('leader.student@gmail.com')).toBe(true)
      expect(isValidEmail('user+tag@domain.co')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('spaces in@email.com')).toBe(false)
    })
  })

  describe('Phone number validation', () => {
    it('should accept valid 10-digit Indian and international mobile numbers', () => {
      expect(isValidPhone('9876543210')).toBe(true)
      expect(isValidPhone('+919876543210')).toBe(true)
      expect(isValidPhone('+91 9876543210')).toBe(true)
      expect(isValidPhone('7890123456')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('12345')).toBe(false)
      expect(isValidPhone('abcdefghij')).toBe(false)
      expect(isValidPhone('')).toBe(false)
    })
  })

  describe('GitHub URL validation', () => {
    it('should accept valid HTTPS GitHub URLs', () => {
      expect(isValidGithubUrl('https://github.com/facebook/react')).toBe(true)
      expect(isValidGithubUrl('https://github.com/user/spirit-3-project/')).toBe(true)
      expect(isValidGithubUrl('https://www.github.com/dsmnru/buildathon')).toBe(true)
    })

    it('should reject non-GitHub or non-HTTPS URLs', () => {
      expect(isValidGithubUrl('http://github.com/user/repo')).toBe(false)
      expect(isValidGithubUrl('https://gitlab.com/user/repo')).toBe(false)
      expect(isValidGithubUrl('https://github.com/justusername')).toBe(false)
      expect(isValidGithubUrl('github.com/user/repo')).toBe(false)
    })
  })

  describe('Live Demo URL validation', () => {
    it('should accept valid HTTPS URLs', () => {
      expect(isValidHttpsUrl('https://my-app.vercel.app')).toBe(true)
      expect(isValidHttpsUrl('https://demo.project.org/app')).toBe(true)
    })

    it('should reject HTTP and plain text', () => {
      expect(isValidHttpsUrl('http://my-app.vercel.app')).toBe(false)
      expect(isValidHttpsUrl('my-app.vercel.app')).toBe(false)
    })
  })

  describe('Presentation file validation', () => {
    it('should accept PDF, PPT, and PPTX within size limits', () => {
      const pdf = new File(['content'], 'slides.pdf', { type: 'application/pdf' })
      const ppt = new File(['content'], 'deck.ppt', { type: 'application/vnd.ms-powerpoint' })
      const pptx = new File(['content'], 'deck.pptx', {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      })

      expect(validatePresentationFile(pdf, 25 * 1024 * 1024)).toBeNull()
      expect(validatePresentationFile(ppt, 25 * 1024 * 1024)).toBeNull()
      expect(validatePresentationFile(pptx, 25 * 1024 * 1024)).toBeNull()
    })

    it('should reject non-presentation file formats', () => {
      const txt = new File(['content'], 'notes.txt', { type: 'text/plain' })
      const jpg = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })

      expect(validatePresentationFile(txt, 25 * 1024 * 1024)).toContain('Invalid file format')
      expect(validatePresentationFile(jpg, 25 * 1024 * 1024)).toContain('Invalid file format')
    })

    it('should reject oversized presentations', () => {
      const bigFile = new File(['x'.repeat(100)], 'deck.pdf', { type: 'application/pdf' })
      // Test limit of 50 bytes
      expect(validatePresentationFile(bigFile, 50)).toContain('exceeds the maximum allowed size')
    })
  })

  describe('Source Code ZIP validation', () => {
    it('should accept valid .zip archives', () => {
      const zip = new File(['archive'], 'source.zip', { type: 'application/zip' })
      expect(validateZipFile(zip, 50 * 1024 * 1024)).toBeNull()
    })

    it('should reject non-zip archives like tar, rar, exe', () => {
      const tar = new File(['archive'], 'source.tar.gz', { type: 'application/gzip' })
      const exe = new File(['code'], 'source.exe', { type: 'application/x-msdownload' })

      expect(validateZipFile(tar, 50 * 1024 * 1024)).toContain('Only .zip archive files are accepted')
      expect(validateZipFile(exe, 50 * 1024 * 1024)).toContain('Only .zip archive files are accepted')
    })
  })

  describe('Form validation integration', () => {
    it('should pass cleanly with valid form data', () => {
      const errors = validateForm(VALID_FORM_DATA, TEST_CONFIG)
      expect(Object.keys(errors).length).toBe(0)
    })

    it('should require all mandatory fields when form is empty', () => {
      const emptyForm: SubmissionFormData = {
        teamName: '',
        leaderName: '',
        leaderEmail: '',
        leaderMobile: '',
        collegeName: '',
        cityState: '',
        teamMembers: [],
        projectTitle: '',
        theme: '',
        projectDescription: '',
        techStack: [],
        presentationFile: null,
        sourceCodeZipFile: null,
        githubRepoUrl: '',
        liveDemoUrl: '',
        demoVideoUrl: '',
        declarationAccuracy: false,
        declarationOriginality: false,
        declarationSlideCount: false,
      }

      const errors = validateForm(emptyForm, TEST_CONFIG)
      expect(errors.teamName).toBeDefined()
      expect(errors.leaderName).toBeDefined()
      expect(errors.leaderEmail).toBeDefined()
      expect(errors.leaderMobile).toBeDefined()
      expect(errors.collegeName).toBeDefined()
      expect(errors.projectTitle).toBeDefined()
      expect(errors.theme).toBeDefined()
      expect(errors.projectDescription).toBeDefined()
      expect(errors.techStack).toBeDefined()
      expect(errors.presentationFile).toBeDefined()
      expect(errors.sourceCodeZipFile).toBeDefined()
      expect(errors.githubRepoUrl).toBeDefined()
      expect(errors.liveDemoUrl).toBeDefined()
      expect(errors.declarationAccuracy).toBeDefined()
      expect(errors.declarationOriginality).toBeDefined()
      expect(errors.declarationSlideCount).toBeDefined()
      // Demo video URL is OPTIONAL - should NOT have error when empty!
      expect(errors.demoVideoUrl).toBeUndefined()
    })

    it('should not block submission if demo video URL is empty', () => {
      const formWithoutVideo = { ...VALID_FORM_DATA, demoVideoUrl: '' }
      const errors = validateForm(formWithoutVideo, TEST_CONFIG)
      expect(errors.demoVideoUrl).toBeUndefined()
      expect(Object.keys(errors).length).toBe(0)
    })

    it('should reject form if declaration checkboxes are not checked', () => {
      const formUnchecked = { ...VALID_FORM_DATA, declarationSlideCount: false }
      const errors = validateForm(formUnchecked, TEST_CONFIG)
      expect(errors.declarationSlideCount).toBeDefined()
    })

    it('should reject duplicate emails among team members', () => {
      const duplicateEmailForm: SubmissionFormData = {
        ...VALID_FORM_DATA,
        leaderEmail: 'same@example.com',
        teamMembers: [
          { id: '1', name: 'Leader', email: 'same@example.com', isLeader: true },
          { id: '2', name: 'Member 2', email: 'same@example.com', isLeader: false },
        ],
      }
      const errors = validateForm(duplicateEmailForm, TEST_CONFIG)
      expect(errors['member_2_email']).toContain('Duplicate email detected')
    })
  })
})
