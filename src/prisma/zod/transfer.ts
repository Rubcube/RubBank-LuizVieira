import * as z from "zod"
import * as imports from "../null"
import { Decimal } from "decimal.js"
import { TransferStatus } from "@prisma/client"
import { CompleteAccount, RelatedAccountModel } from "./index"

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

export const TransferModel = z.object({
  id: z.string(),
  account_id: z.string(),
  account_receiver_id: z.string(),
  schedule_date: z.date(),
  created_at: z.date(),
  updated_at: z.date().nullish(),
  value: z.number(),
  status: z.nativeEnum(TransferStatus),
})

export interface CompleteTransfer extends z.infer<typeof TransferModel> {
  account: CompleteAccount
  account_receiver: CompleteAccount
}

/**
 * RelatedTransferModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTransferModel: z.ZodSchema<CompleteTransfer> = z.lazy(() => TransferModel.extend({
  account: RelatedAccountModel,
  account_receiver: RelatedAccountModel,
}))
