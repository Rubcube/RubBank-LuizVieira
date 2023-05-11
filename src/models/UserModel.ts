import { AccessStatus, PrismaClient } from '@prisma/client';
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
            ...user.userAuth,
            password: bcrypt.hashSync(user.userAuth.password, salt)
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

  updateStatus = async (id: string, status: AccessStatus) => {
    return await prisma.user_info.update({
      where: {id: id},
      data: {status: status}
    })
  }
};