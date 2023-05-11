import * as z from "zod"
import * as imports from "../null"
import { CompleteUser_info, RelatedUser_infoModel } from "./index"

export const AddressModel = z.object({
  id: z.string(),
  user_id: z.string(),
  type: z.string().nullish(),
  cep: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string().nullish(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  user: CompleteUser_info
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  user: RelatedUser_infoModel,
}))
