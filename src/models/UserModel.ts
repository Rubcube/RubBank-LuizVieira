import { PrismaClient } from '@prisma/client';
import { UserInfoIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UserInfoIn) => {
    return await prisma.user_info.create({
      data: {
        ...user,
        status: "ACTIVE"
      }
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