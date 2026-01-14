import { Static, t } from "elysia";

export const MentorUploadModels = t.Object({
  profile: t.File({
    type: "image/*",
  }),
});

export type MentorUploadProps = Static<typeof MentorUploadModels>;

export const MentorCreateModels = t.Object({
  mentorName: t.String(),
  jobTitle: t.String(),
  companyName: t.String(),
  expertise: t.Array(t.String()),
  profileUrl: t.Optional(t.String()),
});

export type MentorCreateProps = Static<typeof MentorCreateModels>;
