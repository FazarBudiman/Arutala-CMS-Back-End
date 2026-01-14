import { describe, it, expect, vi, beforeEach } from "vitest";
import Elysia from "elysia";
import { mentors } from "../route";
import { MentorController } from "../controller";

// mock auth guard
vi.mock("@api/guards/authGuard", () => ({
  authGuard: new Elysia().derive(() => ({
    user: { user_id: "admin-id", role: "ADMIN" },
  })),
}));

// mock role guard
vi.mock("@api/guards/roleGuard", () => ({
  requireAdmin: new Elysia(),
}));

vi.mock("../controller", () => ({
  MentorController: {
    uploadProfileController: vi.fn(),
    addMentorController: vi.fn(),
    getAllMentorController: vi.fn(),
    editMentorController: vi.fn(),
    deleteMentorController: vi.fn(),
  },
}));

const app = new Elysia().use(mentors);

describe("POST /mentors/upload (unit route test, no file)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call uploadProfileController and return success", async () => {
    const spy = vi.spyOn(MentorController, "uploadProfileController").mockResolvedValue({
      status: "success",
      data: { urlProfile: "mock-url" },
    });

    const testApp = new Elysia().post("/mentors/upload", async () => {
      return MentorController.uploadProfileController({
        profile: {} as File,
      });
    });

    const res = await testApp.handle(
      new Request("http://localhost/mentors/upload", {
        method: "POST",
      })
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("success");
    expect(json.data.urlProfile).toBe("mock-url");

    expect(spy).toHaveBeenCalledOnce();
  });
});

describe("POST /mentors", () => {
  it("should create mentor", async () => {
    (MentorController.addMentorController as any).mockResolvedValue({
      status: "success",
      data: { mentors_id: "123" },
    });

    const res = await app.handle(
      new Request("http://localhost/mentors", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mentorName: "John",
          jobTitle: "Engineer",
          companyName: "Google",
          expertise: ["Backend"],
          profileUrl: "url",
        }),
      })
    );

    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.mentors_id).toBe("123");
  });
});

describe("GET /mentors", () => {
  it("should return mentors list", async () => {
    (MentorController.getAllMentorController as any).mockResolvedValue({
      status: "success",
      data: [],
    });

    const res = await app.handle(new Request("http://localhost/mentors"));

    expect(res.status).toBe(200);
  });
});

describe("PUT /mentors/:id", () => {
  it("should update mentor", async () => {
    (MentorController.editMentorController as any).mockResolvedValue({
      status: "success",
      data: { mentors_id: "123" },
    });

    const res = await app.handle(
      new Request("http://localhost/mentors/123", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mentorName: "Updated",
          jobTitle: "Lead",
          companyName: "Meta",
          expertise: ["System"],
          profileUrl: "url",
        }),
      })
    );

    expect(res.status).toBe(200);
  });
});

describe("DELETE /mentors/:id", () => {
  it("should delete mentor", async () => {
    (MentorController.deleteMentorController as any).mockResolvedValue({
      status: "success",
      data: { mentors_id: "123" },
    });

    const res = await app.handle(
      new Request("http://localhost/mentors/123", {
        method: "DELETE",
      })
    );

    expect(res.status).toBe(200);
  });
});
