import * as z from "zod"
import * as imports from "../null"
import { CompleteTicket, RelatedTicketModel, CompleteUser_info, RelatedUser_infoModel, CompleteSuport_info, RelatedSuport_infoModel } from "./index"

export const MessagesModel = z.object({
  id: z.string(),
  message: z.string(),
  ticket_id: z.string(),
  user_id: z.string(),
  suport_id: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
})

export interface CompleteMessages extends z.infer<typeof MessagesModel> {
  ticket: CompleteTicket
  user: CompleteUser_info
  suport: CompleteSuport_info
}

/**
 * RelatedMessagesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMessagesModel: z.ZodSchema<CompleteMessages> = z.lazy(() => MessagesModel.extend({
  ticket: RelatedTicketModel,
  user: RelatedUser_infoModel,
  suport: RelatedSuport_infoModel,
}))
