import { AccessStatus, Prisma } from "@prisma/client"

export interface AccountIn{
    transaction_password: string
}

export interface AccountOut{
    id: string,
    account_number: number,
    agency: string,
    user_id: string,
    balance: Prisma.Decimal,
    status: AccessStatus,
}

export interface Account{
    id: string,
    account_number: number,
    agency: string,
    user_id: string,
    balance: Prisma.Decimal,
    status: AccessStatus,
    transaction_password: string,
}