import { describe, it, expect, vi, beforeEach } from 'vitest'

import { uploadToStorage } from '@api/utils/uploadStorage'
import { pool } from '@api/db/pool'
import { BadRequest, ResourceNotFoundError } from '@api/utils/error'
import { MentorService } from '../service'


vi.mock('@api/utils/uploadStorage', () => ({
  uploadToStorage: vi.fn()
}))


vi.mock('@api/db/pool', () => ({
  pool: {
    query: vi.fn()
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('uploadProfile', () => {
  it('should upload profile and return url', async () => {
    const mockFile = new File(['img'], 'avatar.png', {
      type: 'image/png'
    })

    vi.mocked(uploadToStorage).mockResolvedValue(
      'https://cdn.test/mentor/avatar.png'
    )

    const result = await MentorService.uploadProfile({
      profile: mockFile
    })

    expect(uploadToStorage).toHaveBeenCalledWith(
      mockFile,
      'mentor'
    )
    expect(result).toBe('https://cdn.test/mentor/avatar.png')
  })
})

describe('addMentor', () => {
  it('should insert mentor and return mentor id', async () => {
    vi.mocked(pool.query).mockResolvedValue({
      rows: [{ mentors_id: 'uuid-123' }]
    } as any)

    const payload = {
      mentorName: 'John',
      jobTitle: 'Engineer',
      companyName: 'Google',
      expertise: ['Backend'],
      profileUrl: 'url'
    }

    const result = await MentorService.addMentor(payload, 'admin-id')

    expect(pool.query).toHaveBeenCalled()
    expect(result).toEqual({ mentors_id: 'uuid-123' })
  })
})

describe('getAllMentor', () => {
  it('should return list of mentors', async () => {
    const mockRows = [
      { mentors_id: '1', mentors_name: 'A' }
    ]

    vi.mocked(pool.query).mockResolvedValue({
      rows: mockRows
    } as any)

    const result = await MentorService.getAllMentor()

    expect(result).toEqual(mockRows)
  })
})

describe('getMentorById', () => {
    it('should return mentor when found', async () => {
  vi.mocked(pool.query).mockResolvedValue({
    rows: [{ mentors_id: '123' }]
  } as any)

  const result = await MentorService.getMentorById('123')

  expect(result).toEqual({ mentors_id: '123' })
})
it('should throw BadRequest when id format invalid', async () => {
  vi.mocked(pool.query).mockRejectedValue(new Error())

  await expect(
    MentorService.getMentorById('invalid')
  ).rejects.toBeInstanceOf(BadRequest)
})
it('should throw ResourceNotFoundError when mentor not found', async () => {
  vi.mocked(pool.query).mockResolvedValue({
    rows: []
  } as any)

  await expect(
    MentorService.getMentorById('123')
  ).rejects.toBeInstanceOf(ResourceNotFoundError)
})
})

describe('editMentor', () => {
  it('should update mentor and return mentor id', async () => {
    vi.mocked(pool.query).mockResolvedValue({
      rows: [{ mentors_id: '123' }]
    } as any)

    const payload = {
      mentorName: 'Updated',
      jobTitle: 'Lead',
      companyName: 'Meta',
      expertise: ['System'],
      profileUrl: 'url'
    }

    const result = await MentorService.editMentor(
      payload,
      'admin-id',
      '123'
    )

    expect(result).toEqual({ mentors_id: '123' })
  })
})

describe('deleteMentor', () => {
  it('should soft delete mentor', async () => {
    vi.mocked(pool.query).mockResolvedValue({
      rows: [{ mentors_id: '123' }]
    } as any)

    const result = await MentorService.deleteMentor('123')

    expect(result).toEqual({ mentors_id: '123' })
  })
})
