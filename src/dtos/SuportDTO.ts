import { Ticket, TicketStatus } from '@prisma/client';
import { pagination } from './GlobalDTO';

export interface SuportAuth{
    cpf: string,
    password: string,
}

export interface SuportInfo{
    name: string,
    email: string,
    role: string,
    suport_auth: SuportAuth
}

export interface params {
    status?: TicketStatus | undefined
    userId?: string
    startDate?: Date
    endDate?: Date
}

export interface tickets {
    pagination: pagination
    tickets: Array<Ticket>
}
