import { describe, it, expect } from "vitest";
import {
  HttpError,
  BadRequest,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ResourceNotFoundError
} from "../error";

describe("HttpError base class", () => {
  it("should create HttpError with correct properties", () => {
    const error = new HttpError(
      500,
      "INTERNAL_ERROR",
      "Something went wrong",
      { field: "invalid" }
    );

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(500);
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.message).toBe("Something went wrong");
    expect(error.fields).toEqual({ field: "invalid" });
  });
});

describe("BadRequest", () => {
  it("should use default message", () => {
    const error = new BadRequest();

    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(400);
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.message).toBe("Bad Request");
  });

  it("should accept custom message", () => {
    const error = new BadRequest("Username salah");

    expect(error.message).toBe("Username salah");
  });
});

describe("UnauthorizedError", () => {
  it("should have correct defaults", () => {
    const error = new UnauthorizedError();

    expect(error.status).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toBe("Authentication required");
  });
});

describe("ForbiddenError", () => {
  it("should have correct defaults", () => {
    const error = new ForbiddenError();

    expect(error.status).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
    expect(error.message).toBe("You do not have permission");
  });
});

describe("NotFoundError", () => {
  it("should format resource name", () => {
    const error = new ResourceNotFoundError("User not found");

    expect(error.status).toBe(404);
    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.message).toBe("User not found");
  });

  it("should use default resource name", () => {
    const error = new ResourceNotFoundError();

    expect(error.message).toBe("Resource Not Found");
  });
});

describe("ValidationError", () => {
  it("should include validation fields", () => {
    const fields = {
      username: "Required",
      password: "Too short"
    };

    const error = new ValidationError(fields);

    expect(error.status).toBe(422);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Invalid request data");
    expect(error.fields).toEqual(fields);
  });
});
