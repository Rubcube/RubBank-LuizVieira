import * as z from "zod"
import * as imports from "../null"
import { Decimal } from "decimal.js"
import { AccessStatus } from "@prisma/client"
import { CompleteUser_info, RelatedUser_infoModel, CompleteTransfer, RelatedTransferModel } from "./index"

// Helper schema for Decimal fields
z
  .instanceof(Decimal)
  .or(z.string())
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value)
    } catch (error) {
      return false
    }
  })
  .transform((value) => new Decimal(value))

export const AccountModel = z.object({
  id: z.string(),
  account_number: z.number().int(),
  agency: z.string(),
  user_id: z.string(),
  balance: z.number(),
  transaction_password: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
  status: z.nativeEnum(AccessStatus),
})

export interface CompleteAccount extends z.infer<typeof AccountModel> {
  user: CompleteUser_info
  transfer_from: CompleteTransfer[]
  transfer_to: CompleteTransfer[]
}

/**
 * RelatedAccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAccountModel: z.ZodSchema<CompleteAccount> = z.lazy(() => AccountModel.extend({
  user: RelatedUser_infoModel,
  transfer_from: RelatedTransferModel.array(),
  transfer_to: RelatedTransferModel.array(),
}))
