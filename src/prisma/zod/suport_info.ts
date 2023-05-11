import * as z from "zod"
import * as imports from "../null"
import { CompleteMessages, RelatedMessagesModel, CompleteSuport_auth, RelatedSuport_authModel } from "./index"

export const Suport_infoModel = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
})

export interface CompleteSuport_info extends z.infer<typeof Suport_infoModel> {
  messages: CompleteMessages[]
  suport_auth?: CompleteSuport_auth | null
}

/**
 * RelatedSuport_infoModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSuport_infoModel: z.ZodSchema<CompleteSuport_info> = z.lazy(() => Suport_infoModel.extend({
  messages: RelatedMessagesModel.array(),
  suport_auth: RelatedSuport_authModel.nullish(),
}))
