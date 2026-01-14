import { authGuard } from "@api/guards/authGuard";
import { requireAdmin } from "@api/guards/roleGuard";
import Elysia from "elysia";
import { MentorController } from "./controller";
import { MentorCreateModels, MentorUploadModels } from "./model";

export const mentors = new Elysia().group("/mentors", (app) =>
  app
    .use(authGuard)
    .use(requireAdmin)
    .post(
      "/upload",
      async (ctx) => {
        const { body } = ctx;

        const res = await MentorController.uploadProfileController(body);
        return res;
      },
      {
        body: MentorUploadModels,
      }
    )

    .post(
      "/",
      async (ctx) => {
        const { body, set, user } = ctx as any;
        const res = await MentorController.addMentorController(body, user);
        set.status = 201;
        return res;
      },
      {
        body: MentorCreateModels,
      }
    )

    .get("/", async () => {
      const res = await MentorController.getAllMentorController();
      return res;
    })

    .put(
      "/:id",
      async (ctx) => {
        const { body, params, user } = ctx as any;
        const res = await MentorController.editMentorController(body, user, params.id);
        return res;
      },
      {
        body: MentorCreateModels,
      }
    )

    .delete("/:id", async (ctx) => {
      const { params } = ctx;
      const res = await MentorController.deleteMentorController(params.id);
      return res;
    })
);
