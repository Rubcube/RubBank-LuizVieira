import { Prisma, TransferStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { UserInfoOut } from "./UsersDTO";

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
}

export interface transfers{
    id: string,
    schedule_date: Date,
    value: Prisma.Decimal,
    type: string,
}

export type resExtrato = {
    pages: number,
    actualPage: number,
    maxPerPage: number,
    transfers?: Array<transfers>
}
