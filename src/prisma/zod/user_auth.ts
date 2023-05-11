import * as z from "zod"
import * as imports from "../null"
import { CompleteUser_info, RelatedUser_infoModel } from "./index"

export const User_authModel = z.object({
  id: z.string(),
  user_info_id: z.string(),
  cpf: z.string(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
})

export interface CompleteUser_auth extends z.infer<typeof User_authModel> {
  user: CompleteUser_info
}

/**
 * RelatedUser_authModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUser_authModel: z.ZodSchema<CompleteUser_auth> = z.lazy(() => User_authModel.extend({
  user: RelatedUser_infoModel,
}))
