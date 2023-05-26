import { PrismaClient, TicketStatus } from '@prisma/client';
import { SuportAuth, SuportInfo, params } from 'dtos/SuportDTO';
import { take } from 'utils/Constantes';

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

export default class SuportModel {  
    create = async (suportData: SuportInfo) => {
        const salt = bcrypt.genSaltSync(10);
        return await prisma.suport_info.create({
            data:{
                name: suportData.name,
                role: suportData.role,
                email: suportData.email,
                suport_auth: {
                    create: { 
                        cpf: suportData.suport_auth.cpf,
                        password: bcrypt.hashSync(suportData.suport_auth.password, salt)
                    }
                }
            }
        })
    }

    get = async (id:string) => {
        return await prisma.suport_info.findUnique({
            where:{
                id: id
            },
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                suport_auth: {
                    select: {
                        cpf: true
                    }
                }
            }
        })
    }

    getId = async (suport: SuportAuth) => {
        const bdSuport =  await prisma.suport_auth.findUnique({
          where: {
            cpf: suport.cpf
          }
        });
        if(bdSuport != null){
          return await bcrypt.compare(suport.password, bdSuport.password) == true ? bdSuport?.suport_info_id : null;
        }
        return null;
    
      }

    getTickets = async (page: number, params: params) => {
        const tickets = await prisma.ticket.findMany({
            orderBy:{
                created_at: "asc"
            },
            where:{
                created_at:{
                    gte: params.startDate,
                    lte: params.endDate
                },
                status: params.status,
                user_info_id: params.userId
            },
            skip: (page - 1) * take,
            take: take,
        });

        const pages = await prisma.ticket.count({
            orderBy:{
                created_at: "asc"
            },
            where:{
                created_at:{
                    gte: params.startDate,
                    lte: params.endDate
                },
                status: params.status,
                user_info_id: params.userId
            },
            skip: (page - 1) * take,
            take: take,
        });

        return {tickets, pages};
    }

    createMessage = async (suportId: string, ticketId: string, message: string) => {
        return await prisma.messages.create({
          data:{
            message: message,
            ticket_id: ticketId,
            suport_id: suportId,
          }
        })
    }

    getTicketById = async (ticketId: string) => {
        return await prisma.ticket.findUnique({
            where:{
                id: ticketId
            }
        })
    }

    getMessages = async (ticketId: string, page: number) => {
        return await prisma.messages.findMany({
          where: {ticket_id: ticketId},
          orderBy: {created_at: "asc"},
          skip: (page - 1) * take,
          take: take
        })
    }

    putTicketStatus = async (ticketId:string, status:TicketStatus) => {
        return await prisma.ticket.update({
            where:{id: ticketId},
            data:{
                status: status,
                updated_at: new Date()
            }
        })
    }

};