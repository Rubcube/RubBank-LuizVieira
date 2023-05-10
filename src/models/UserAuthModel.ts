import { PrismaClient } from '@prisma/client';
import { UserAuthIn } from 'dtos/UsersDTO';

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

export default class UserAuthModel {

  create = async (user: UserAuthIn) => {
    const salt = bcrypt.genSaltSync(10);
    return await prisma.user_auth.create({
      data: {
        ...user,
        password: bcrypt.hashSync(user.password, salt),
      }
    });
  }
};