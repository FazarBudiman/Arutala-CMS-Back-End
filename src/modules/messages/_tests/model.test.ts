import { describe, expect, it } from "vitest";
import { Value } from '@sinclair/typebox/value'
import { MessageCreateModels, MessageUpdateModels } from "../model";

describe('MessageCreateModels', () => {
    it('should reject if missing value', () => {
        const payload = {
            senderName: 'Alice',
            senderEmail: 'alice@gmail.com',
            subject: ['Head Hunting'],
            messageBody: 'I would like to know more about your services.'
        }
        const isValid = Value.Check(MessageCreateModels, payload);

        expect(isValid).toBe(false);
    })

    it('should reject if non-string fields', () => {
        const payload = {
            senderName: 'Alice',
            senderEmail: 'alice@gmail.com',
            organizationName: 'Tech Corp',
            senderPhone: '1234567890',
            subject: ['Head Hunting'],
            messageBody: 12345
        }
        const isValid = Value.Check(MessageCreateModels, payload);

        expect(isValid).toBe(false);
    })

    it('should accept valid payload', () => {
        const payload = {
            senderName: 'Alice',
            senderEmail: 'alice@gmail.com',
            organizationName: 'Tech Corp',
            senderPhone: '1234567890',
            subject: ['Head Hunting'],
            messageBody: 'I would like to know more about your services.'
        }
        const isValid = Value.Check(MessageCreateModels, payload);
        expect(isValid).toBe(true);
    })
})

describe('MessageUpdateModels', () => {
    it('should reject if missing value', () => {
        const payload = {}
        const isValid = Value.Check(MessageUpdateModels, payload);

        expect(isValid).toBe(false);
    })
    
    it('should reject if non-enum fields', () => {
        const payload = {
            status: 'invalid_status'
        }
        const isValid = Value.Check(MessageUpdateModels, payload);

        expect(isValid).toBe(false);
    })
    
    it('should accept valid payload', () => {
        const payload = {
            status: 'CONTACTED'
        }
        const isValid = Value.Check(MessageUpdateModels, payload);

        expect(isValid).toBe(true);
    })
})