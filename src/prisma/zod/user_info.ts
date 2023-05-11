import * as z from "zod"
import * as imports from "../null"
import { AccessStatus } from "@prisma/client"
import { CompleteUser_auth, RelatedUser_authModel, CompleteAddress, RelatedAddressModel, CompleteAccount, RelatedAccountModel, CompleteMessages, RelatedMessagesModel, CompleteTicket, RelatedTicketModel } from "./index"

export const User_infoModel = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string(),
  phone: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
  birth: z.date().nullish(),
  status: z.nativeEnum(AccessStatus).nullish(),
})

export interface CompleteUser_info extends z.infer<typeof User_infoModel> {
  user_auth?: CompleteUser_auth | null
  address: CompleteAddress[]
  account: CompleteAccount[]
  messages: CompleteMessages[]
  ticket: CompleteTicket[]
}

/**
 * RelatedUser_infoModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUser_infoModel: z.ZodSchema<CompleteUser_info> = z.lazy(() => User_infoModel.extend({
  user_auth: RelatedUser_authModel.nullish(),
  address: RelatedAddressModel.array(),
  account: RelatedAccountModel.array(),
  messages: RelatedMessagesModel.array(),
  ticket: RelatedTicketModel.array(),
}))
