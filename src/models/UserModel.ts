import { PrismaClient } from '@prisma/client';
import { UserInfoIn } from 'dtos/UsersDTO';
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

    return await prisma.user_info.findFirst({
      where: {
        user_auth:{
          id: userId
        }
      },
      include:{
        account: true,
        address: true,
        user_auth: true
      }
    });

  }

};