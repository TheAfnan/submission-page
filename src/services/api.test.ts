import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitProject, SubmissionError } from './api'
import type { PortalConfig, SubmissionFormData } from '../types/submission'

const MOCK_CONFIG_DEMO: PortalConfig = {
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

const MOCK_CONFIG_PROD: PortalConfig = {
  ...MOCK_CONFIG_DEMO,
  mode: 'production',
}

const SAMPLE_FORM_DATA: SubmissionFormData = {
  teamName: 'InnovateDSMNRU',
  leaderName: 'Ramakant Yadav',
  leaderEmail: 'ramakant@dsmnru.ac.in',
  leaderMobile: '9876543210',
  collegeName: 'DSMNRU Lucknow',
  cityState: 'Lucknow, UP',
  teamMembers: [
    { id: '1', name: 'Ramakant Yadav', email: 'ramakant@dsmnru.ac.in', isLeader: true },
  ],
  projectTitle: 'SmartCampus Assist',
  theme: 'Assistive Technology',
  problemStatement: 'Long problem statement detailing campus navigation challenges for students.',
  proposedSolution: 'Edge-based spatial audio system with offline computer vision beacons.',
  projectOverview: 'Full project overview detailing system architecture and workflow.',
  keyFeatures: 'Real-time navigation, beacon detection, emergency alerts.',
  targetUsersAndImpact: 'Visually impaired students across DSMNRU campus.',
  techStack: ['Python', 'OpenCV'],
  innovationUniqueness: 'Runs on low power microcontrollers under 2 watts.',
  implementationStatus: 'Working Prototype / MVP',
  presentationFile: new File(['ppt'], 'presentation.pdf', { type: 'application/pdf' }),
  sourceCodeZipFile: new File(['zip'], 'code.zip', { type: 'application/zip' }),
  githubRepoUrl: 'https://github.com/dsmnru/smartcampus',
  liveDemoUrl: 'https://smartcampus.vercel.app',
  demoVideoUrl: '',
  declarationAccuracy: true,
  declarationOriginality: true,
  declarationSlideCount: true,
}

describe('API Service Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('Demo mode should return valid Submission ID with SP3-BTH-2026 prefix', async () => {
    const phases: string[] = []
    const result = await submitProject({
      formData: SAMPLE_FORM_DATA,
      config: MOCK_CONFIG_DEMO,
      onProgress: (phase) => phases.push(phase),
    })

    expect(result).toBeDefined()
    expect(result.submissionId).toMatch(/^SP3-BTH-2026-[A-Z0-9]+$/)
    expect(result.teamName).toBe('InnovateDSMNRU')
    expect(result.projectTitle).toBe('SmartCampus Assist')
    expect(result.status).toBe('RECEIVED')
    expect(phases.length).toBeGreaterThan(0)
  })

  it('Production mode should execute fetch and fail gracefully when API is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Failed to fetch (Network connection refused)'))
    )

    await expect(
      submitProject({
        formData: SAMPLE_FORM_DATA,
        config: MOCK_CONFIG_PROD,
      })
    ).rejects.toThrow(SubmissionError)
  })

  it('Production mode should parse server error response properly', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => ({
          success: false,
          error: {
            code: 'DEADLINE_PASSED',
            message: 'Submission deadline for SPIRIT 3.0 Round 1 has passed.',
          },
        }),
      })
    )

    await expect(
      submitProject({
        formData: SAMPLE_FORM_DATA,
        config: MOCK_CONFIG_PROD,
      })
    ).rejects.toThrow('Submission deadline for SPIRIT 3.0 Round 1 has passed.')
  })

  it('Production mode should succeed and return server data when backend returns 200', async () => {
    const mockServerData = {
      submissionId: 'SP3-BTH-2026-LIVE99',
      submittedAt: new Date().toISOString(),
      teamName: 'InnovateDSMNRU',
      leaderName: 'Ramakant Yadav',
      leaderEmail: 'ramakant@dsmnru.ac.in',
      leaderMobile: '9876543210',
      collegeName: 'DSMNRU Lucknow',
      cityState: 'Lucknow, UP',
      memberCount: 1,
      projectTitle: 'SmartCampus Assist',
      theme: 'Assistive Technology',
      implementationStatus: 'Working Prototype / MVP',
      techStack: ['Python', 'OpenCV'],
      presentationFileName: 'presentation.pdf',
      presentationFileSize: 1024,
      sourceCodeZipFileName: 'code.zip',
      sourceCodeZipFileSize: 2048,
      githubRepoUrl: 'https://github.com/dsmnru/smartcampus',
      liveDemoUrl: 'https://smartcampus.vercel.app',
      status: 'RECEIVED' as const,
      message: 'Official submission recorded.',
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: {
          get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        },
        json: async () => ({
          success: true,
          data: mockServerData,
        }),
      })
    )

    const result = await submitProject({
      formData: SAMPLE_FORM_DATA,
      config: MOCK_CONFIG_PROD,
    })

    expect(result.submissionId).toBe('SP3-BTH-2026-LIVE99')
  })
})
