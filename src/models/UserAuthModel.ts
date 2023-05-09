import { PrismaClient } from '@prisma/client';
import { UserAuthIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserAuthModel {

  create = async (user: UserAuthIn) => {
    return await prisma.user_auth.create({
      data: user,
    });
  }

  /*getAll = async () => {
    return await prisma.user.findMany();
  }

  get = async (id: number) => {
    return await prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.user.delete({
      where: {
        id
      }
    })
  }

  update = async (id: number, user: UserInfoIn) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        ...user
      }
    })
  }*/
};