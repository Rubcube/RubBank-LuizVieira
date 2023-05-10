import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

export default class AccountModel {

  create = async (password: string, user: string) => {
    const salt = bcrypt.genSaltSync(10);
    return await prisma.account.create({
      data: {
        user_id: user,
        balance: 0,
        transaction_password: bcrypt.hashSync(password, salt),
        status: "ACTIVE"
      }
    });
  }
};