import { describe, it, expect, vi, beforeEach } from "vitest";
import { MentorService } from "../service";
import { MentorController } from "../controller";
import { ResourceNotFoundError } from "@api/utils/error";

vi.mock("../service", () => ({
  MentorService: {
    uploadProfile: vi.fn(),
    addMentor: vi.fn(),
    getAllMentor: vi.fn(),
    getMentorById: vi.fn(),
    editMentor: vi.fn(),
    deleteMentor: vi.fn(),
  },
}));

vi.mock("@api/utils/uploadStorage", () => ({
  uploadToStorage: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadProfileController", () => {
  it("should return success response with urlProfile", async () => {
    const file = new File(["img"], "avatar.png", {
      type: "image/png",
    });

    vi.mocked(MentorService.uploadProfile).mockResolvedValue("https://cdn.test/avatar.png");

    const result = await MentorController.uploadProfileController({
      profile: file,
    });

    expect(MentorService.uploadProfile).toHaveBeenCalledWith({
      profile: file,
    });

    expect(result).toEqual({
      status: "success",
      data: {
        urlProfile: "https://cdn.test/avatar.png",
      },
    });
  });
});

describe("addMentorController", () => {
  it("should call service and return mentors_id", async () => {
    vi.mocked(MentorService.addMentor).mockResolvedValue({
      mentors_id: "123",
    });

    const payload = {
      mentorName: "John",
      jobTitle: "Engineer",
      companyName: "Google",
      expertise: ["Backend"],
      profileUrl: "url",
    };

    const user = { user_id: "admin-id" };

    const result = await MentorController.addMentorController(payload, user as any);

    expect(MentorService.addMentor).toHaveBeenCalledWith(payload, "admin-id");

    expect(result).toEqual({
      status: "success",
      data: { mentors_id: "123" },
    });
  });
});

describe("getAllMentorController", () => {
  it("should return list of mentors", async () => {
    const mentors = [{ mentors_id: "1" }];

    vi.mocked(MentorService.getAllMentor).mockResolvedValue(mentors);

    const result = await MentorController.getAllMentorController();

    expect(result).toEqual({
      status: "success",
      data: mentors,
    });
  });
});

describe("editMentorController", () => {
  it("should validate mentor exists and update mentor", async () => {
    vi.mocked(MentorService.getMentorById).mockResolvedValue({
      mentors_id: "123",
    });

    vi.mocked(MentorService.editMentor).mockResolvedValue({
      mentors_id: "123",
    });

    const payload = {
      mentorName: "Updated",
      jobTitle: "Lead",
      companyName: "Meta",
      expertise: ["System"],
      profileUrl: "url",
    };

    const user = { user_id: "admin-id" };

    const result = await MentorController.editMentorController(payload, user as any, "123");

    expect(MentorService.getMentorById).toHaveBeenCalledWith("123");
    expect(MentorService.editMentor).toHaveBeenCalledWith(payload, "admin-id", "123");

    expect(result).toEqual({
      status: "success",
      data: { mentors_id: "123" },
    });
  });

  it("should throw error when mentor not found", async () => {
    vi.mocked(MentorService.getMentorById).mockRejectedValue(new ResourceNotFoundError("not found"));

    await expect(MentorController.editMentorController({} as any, { user_id: "admin-id" } as any, "invalid")).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

describe("deleteMentorController", () => {
  it("should validate mentor exists and delete mentor", async () => {
    vi.mocked(MentorService.getMentorById).mockResolvedValue({
      mentors_id: "123",
    });

    vi.mocked(MentorService.deleteMentor).mockResolvedValue({
      mentors_id: "123",
    });

    const result = await MentorController.deleteMentorController("123");

    expect(MentorService.getMentorById).toHaveBeenCalledWith("123");
    expect(MentorService.deleteMentor).toHaveBeenCalledWith("123");

    expect(result).toEqual({
      status: "success",
      data: { mentors_id: "123" },
    });
  });

  it("should throw error when mentor not found", async () => {
    vi.mocked(MentorService.getMentorById).mockRejectedValue(new ResourceNotFoundError("not found"));

    await expect(MentorController.editMentorController({} as any, { user_id: "admin-id" } as any, "invalid")).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
