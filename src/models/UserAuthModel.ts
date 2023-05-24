import { PrismaClient } from '@prisma/client';
import { UserAuthIn, UserAuthUpdate } from 'dtos/UsersDTO';

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();


export default class UserAuthModel {

  getId = async (user: UserAuthIn) => {
    const bdUser =  await prisma.user_auth.findUnique({
      where: {
        cpf: user.cpf
      }
    });
    if(bdUser != null){
      return await bcrypt.compare(user.password, bdUser.password) == true ? bdUser?.user_info_id : null;
    }
    return null;

  }

  updateAuth = async (data: UserAuthUpdate, userId: string) => {
    const salt = bcrypt.genSaltSync(10);
    return await prisma.user_auth.update({
      where:{user_info_id: userId},
      data:{
        password: bcrypt.hashSync(data.password, salt),
        updated_at: new Date()
      }
    })
  }
};