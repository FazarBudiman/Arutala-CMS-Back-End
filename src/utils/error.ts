export class HttpError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public fields?: Record<string, string>
    ) {
        super(message)
    }
}

export class BadRequest extends HttpError {
    constructor(message = 'Bad Request'){
        super(400, 'BAD_REQUEST', message)
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = 'Authentication required') {
        super(401, 'UNAUTHORIZED', message)
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = 'You do not have permission') {
        super(403, 'FORBIDDEN', message)
    }
}

export class ResourceNotFoundError extends HttpError {
    constructor(resource = 'Resource Not Found') {
        super(404, 'RESOURCE_NOT_FOUND', `${resource}`)
    }
}

export class ValidationError extends HttpError {
    constructor(fields: Record<string, string>) {
        super(422, 'VALIDATION_ERROR', 'Invalid request data', fields)
    }
}
