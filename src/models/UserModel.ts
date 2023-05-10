import { PrismaClient } from '@prisma/client';
import { UserInfoIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserInfoIn) => {
    return await prisma.user_info.create({
      data: {
        ...user,
        status: "INCOMPLETE"
      }
    });
  }
};