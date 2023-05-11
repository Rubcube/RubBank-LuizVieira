import { PrismaClient } from '@prisma/client';
import { UserAuthIn } from 'dtos/UsersDTO';

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();


export default class UserAuthModel {

  /*create = async (user: UserAuthIn) => {
    const salt = bcrypt.genSaltSync(10);
    return await prisma.user_auth.create({
      data: {
        ...user,
        user_info_id: user.user_info_id,
        password: bcrypt.hashSync(user.password, salt),
      }
    });
  }*/

  getId = async (user: UserAuthIn) => {
    const bdUser =  await prisma.user_auth.findFirst({
      where: {
        cpf: user.cpf
      }
    });
    if(bdUser != null){
      return await bcrypt.compare(user.password, bdUser.password) == true ? bdUser?.id : null;
    }
    return null;

  }
};