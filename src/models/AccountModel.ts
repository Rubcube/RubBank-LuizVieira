import { PrismaClient, Prisma } from '@prisma/client';
import { TransferIn } from 'dtos/TransferDTO';
import { DateTime } from 'luxon';
import CustomError from 'utils/ErrorsType';
import {InternalErrors} from 'utils/ErrorsType';

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

  createTransaction = async (transfer: TransferIn) => {
    let transaction, receiver, origin;

    const dataAtual = DateTime.now();

    await prisma.$transaction(async (prisma) => {

      // Débito na conta origem
      if (transfer.originBalance >= transfer.value) {
        origin = await prisma.account.update({
          where: {id: transfer.accountId},
          data: {
            balance: {decrement: transfer.value},
            updated_at: dataAtual.toJSDate()
          }
        })
      }else{
        throw new CustomError(InternalErrors.INVALID_BALANCE);
      }

      // Crédito na conta destino
      receiver = await prisma.account.update({
        where: {id: transfer.accountReceiverId},
        data: {
          balance: {increment: transfer.value},
          updated_at: dataAtual.toJSDate()
        }
      })
    

      // Criação da transferência
      transaction = await prisma.transfer.create({
        data: {
          account_id: transfer.accountId,
          account_receiver_id: transfer.accountReceiverId,
          value: transfer.value,
          schedule_date: transfer.scheduleTo.toJSDate(),
          status: transfer.scheduleTo.day === dataAtual.day? "SUCCESSFUL": "INPROGRESS"
        }
      })
    });
      
    return [transaction, origin, receiver];
  }

  getBalance = async(userId: string, accountId: string) =>{
    return await prisma.account.findFirst({
      where: { 
        id: accountId,
        AND: {
          user_id: userId
        }
      },
      select: { balance: true }
    })
  }

  getAccount = async (agency: string, accountNumber: number) => {
      return await prisma.account.findFirst({
        where:{
          account_number: accountNumber,
          AND:{
            agency: agency
          }, 
        }
      })
  }

  getAccountById = async (id: string) => {
    return await prisma.account.findUnique({
      where:{
        id: id,
      }
    })
  }
};