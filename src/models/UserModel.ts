import { PrismaClient } from '@prisma/client';
import { UserAuthUpdate, UserInfoIn, UserInfoUpdate } from 'dtos/UsersDTO';
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
            agency: true
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
};