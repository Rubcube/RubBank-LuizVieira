import * as z from "zod"
import * as imports from "../null"
import { CompleteSuport_info, RelatedSuport_infoModel } from "./index"

export const Suport_authModel = z.object({
  id: z.string(),
  suport_info_id: z.string(),
  email: z.string(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
})

export interface CompleteSuport_auth extends z.infer<typeof Suport_authModel> {
  suport: CompleteSuport_info
}

/**
 * RelatedSuport_authModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSuport_authModel: z.ZodSchema<CompleteSuport_auth> = z.lazy(() => Suport_authModel.extend({
  suport: RelatedSuport_infoModel,
}))
