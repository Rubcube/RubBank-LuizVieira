import { Prisma, TransferStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { pagination } from "./GlobalDTO";

export interface TransferIn{
    accountId: string,
    accountReceiverId: string,
    scheduleTo: DateTime,
    value: Prisma.Decimal,
    originBalance: Prisma.Decimal,
    receiverBalance: Prisma.Decimal,
    status: TransferStatus
}

interface accountData{
    agency: string,
    account_number: number,
    full_name: string,
    cpf : string | undefined
}

export interface transferOut{
    id: string,
    value: Prisma.Decimal,
    created_at: DateTime,
    schedule_date: DateTime,
    status: TransferStatus,
    account: accountData,
    account_receiver: accountData,
    type: string
}

export interface transfers{
    id: string,
    schedule_date: Date,
    value: Prisma.Decimal,
    type: string,
    status: TransferStatus
}

export type resExtrato = {
    pagination: pagination
    transfers?: Array<transfers>
}
