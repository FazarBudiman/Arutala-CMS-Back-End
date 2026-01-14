import { describe, it, expect } from "vitest";
import{ Value } from '@sinclair/typebox/value'
import { MentorCreateModels, MentorUploadModels } from "../model";

const createMockFile = (name: string, type: string) => {
    return new File(
        ['dummy content'],
        name,
        {type}
    )
}


describe('MentorUploadModels', () => {
    it('should reject if missing file', () => {
        const payload = {}

        const isValid = Value.Check(MentorUploadModels, payload)

        expect(isValid).toBe(false)
    })

    it('should reject if type data is not file', () => {
        const payload = {
            profile : 'ini string'
        }

        const isValid = Value.Check(MentorUploadModels, payload)
        expect(isValid).toBe(false)
    })

    it('should reject if format file not an image', () => {
        const payload = {
            profile: createMockFile('document.pdf', 'application/pdf')
        }

        const isValid = Value.Check(MentorUploadModels, payload)
        expect(isValid).toBe(false)
    })

    it('should accept valid payload', () => {
        const payload = {
            profile: createMockFile('avatar.jpg', 'image/jpg')
        }

        const isValid = Value.Check(MentorUploadModels, payload)
        expect(isValid).toBe(true)
    })
})


describe('MentorCreateModels', () => {
    it('should reject if missing value', () => {
        const payload = {
            mentorName: 'John Doe',
            jobTitle: 'Full Stack Developer',
            companyName: 'GoTo',
            profileUrl: 'https://unsplash.com/avatar.png'
        }

        const isValid = Value.Check(MentorCreateModels, payload)
        expect(isValid).toBe(false)
    })
    it('should reject if non-string fields', () => {
        const payload = {
            mentorName: 13132,
            jobTitle: 'Full Stack Developer',
            companyName: true,
            expertise: ['Typescript', 'Golang'],
            profileUrl: 'https://unsplash.com/avatar.png'
        }

        const isValid = Value.Check(MentorCreateModels, payload)

        expect(isValid).toBe(false)

    })
    it('should accept if valid payload', () => {
        const payload = {
            mentorName: 'John Doe',
            jobTitle: 'Full Stack Developer',
            companyName: 'GoTo',
            expertise: ['Typescript', 'Golang'],
            profileUrl: 'https://unsplash.com/avatar.png'
        }

        const isValid = Value.Check(MentorCreateModels, payload)

        expect(isValid).toBe(true)
    })
})