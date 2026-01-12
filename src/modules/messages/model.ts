import { Static, t } from "elysia";

export const MessageCreateModels = t.Object({
    senderName: t.String(),
    senderEmail: t.String(),
    organizationName: t.String(),
    senderPhone: t.String(),
    subject: t.Array(t.String()),
    messageBody: t.String()
})

export type MessageCreateProps = Static<typeof MessageCreateModels>

export const MessageUpdateModels = t.Object({
  status: t.Union([
    t.Literal("NEW"),
    t.Literal("CONTACTED"),
    t.Literal("QUALIFIED"),
    t.Literal("PROPOSAL_SENT"),
    t.Literal("NEGOTIATION"),
    t.Literal("VERBAL_COMMITMENT"),
    t.Literal("CLOSED_WON"),
    t.Literal("CLOSED_LOSS"),
    t.Literal("ON_HOLD"),
  ])
})

export type MessageUpdateProps = Static<typeof MessageUpdateModels>

