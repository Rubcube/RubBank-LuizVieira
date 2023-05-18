import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { UserInfoOut } from "./UsersDTO";

export interface TransferIn{
    accountId: string,
    accountReceiverId: string,
    scheduleTo: DateTime,
    value: Prisma.Decimal,
    originBalance: Prisma.Decimal,
    receiverBalance: Prisma.Decimal
}

export interface TransferOut{
    id: string,
    userOrigin: UserInfoOut,
    value: Prisma.Decimal,
    createdAt: DateTime,
    scheduleTo: DateTime,
}