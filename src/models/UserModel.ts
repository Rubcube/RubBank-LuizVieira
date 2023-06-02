import { PrismaClient } from '@prisma/client';
import { params } from 'dtos/SuportDTO';
import { UserAuthUpdate, UserInfoIn, UserInfoUpdate } from 'dtos/UsersDTO';
import { take } from 'utils/Constantes';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserInfoIn) => {
    const salt = bcrypt.genSaltSync(10);
    return await prisma.user_info.create({
      data: {
        ...user,
        status: 'ACTIVE',
        user_auth:{
          create: {
            ...user.user_auth,
            password: bcrypt.hashSync(user.user_auth.password, salt)
          }
        },
        address:{
          create: {
            ...user.address
          }
        },
        account:{
          create:{
            balance: 0,
            transaction_password: bcrypt.hashSync(user.account.transaction_password, salt),
            status: 'ACTIVE'
          }
        }
      }
      
    });
  }

  get = async (userId: string) => {

    return await prisma.user_info.findUnique({
      where: {
        id: userId
      },
      include:{
        account: {
          select:{
            id: true,
            account_number: true,
            agency: true,
            balance: true,
          }
        },
        address: {
          select:{
            id: true,
            cep: true,
            street: true,
            number: true,
            neighborhood: true,
            complement: true,
            city: true,          
            state: true, 
            type: true
          }
        },
        user_auth: {
          select: {
            cpf: true
          }
        }
      }
    });

  }

  getAccounts = async(userId: string) => {
    return await prisma.account.findMany({
      where: {
        user_id: userId
      },
      select: {
        id: true,
        agency: true,
        account_number: true
      }
    });
  }

  updateInfo = async (data: UserInfoUpdate, userId: string) => {
    return await prisma.user_info.update({
      where:{id: userId},
      data:{
        ...data,
        updated_at: new Date()
      }
    })
  }

  userExists = async (data: UserInfoUpdate) => {
    return await prisma.user_info.findFirst({
      where: 
        data.email? {
          email: data.email
        }:
        data.phone? {
          phone: data.phone
        }: undefined
    })
  }

  createTicket = async (title: string, description: string, userId: string) => {
    return await prisma.ticket.create({
      data:{
        title: title,
        description: description,
        status: "INREVIEW",
        user_info_id: userId
      }
    });
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

  getTicketById = async (userId: string, ticketId: string) => {
    return await prisma.ticket.findFirst({
      where:{
        id: ticketId,
        user_info_id: userId
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

  createMessage = async (userId: string, ticketId: string, message: string) => {
    return await prisma.messages.create({
      data:{
        message: message,
        ticket_id: ticketId,
        user_id: userId,
      }
    })
  }

  getSuportName = async (suportId:string) => {
    return await prisma.suport_info.findUnique({
      where: {id: suportId},
      select: {name: true}
    })
  }
};