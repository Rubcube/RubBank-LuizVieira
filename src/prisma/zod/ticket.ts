import * as z from "zod"
import * as imports from "../null"
import { CompleteUser_info, RelatedUser_infoModel, CompleteMessages, RelatedMessagesModel } from "./index"

export const TicketModel = z.object({
  id: z.string(),
  user_info_id: z.string(),
  title: z.string(),
  description: z.string(),
  is_solved: z.boolean(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
})

export interface CompleteTicket extends z.infer<typeof TicketModel> {
  user: CompleteUser_info
  messages: CompleteMessages[]
}

/**
 * RelatedTicketModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketModel: z.ZodSchema<CompleteTicket> = z.lazy(() => TicketModel.extend({
  user: RelatedUser_infoModel,
  messages: RelatedMessagesModel.array(),
}))
