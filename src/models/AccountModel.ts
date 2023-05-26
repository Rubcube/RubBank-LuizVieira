import { PrismaClient,  TransferStatus, Transfer } from '@prisma/client';
import { TransferIn } from 'dtos/TransferDTO';
import { DateTime } from 'luxon';
import CustomError from 'utils/ErrorsType';
import {InternalErrors} from 'utils/ErrorsType';
import { take } from 'utils/Constantes';

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

type filters = {
  startDate?: Date
  endDate?: Date
  schedule?: string
  type?: string
}


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

  getAccount = async (agency: string, accountNumber: number) => {
    return await prisma.account.findFirst({
      where:{
        account_number: accountNumber,
        AND:{
          agency: agency
        }, 
      },
      include:{
        user: {select:{
          full_name: true,
          user_auth: {select:{
            cpf: true
          }}
        }}
        
      }
    })
  }

  createTransaction = async (transfer: TransferIn) => {
    let transaction, receiver, origin;

    const dataAtual = DateTime.now();

    await prisma.$transaction(async (prisma) => {

      if(transfer.status === "SUCCESSFUL"){

        if (transfer.originBalance >= transfer.value) {
          origin = await prisma.account.update({
            where: {id: transfer.accountId},
            data: {
              balance: {decrement: transfer.value},
              wrong_pass: 0,
              updated_at: dataAtual.toJSDate()
            }
          })
        }else{
          throw new CustomError(InternalErrors.INVALID_BALANCE);
        }

        receiver = await prisma.account.update({
          where: {id: transfer.accountReceiverId},
          data: {
            balance: {increment: transfer.value},
            updated_at: dataAtual.toJSDate()
          }
        })

      }

      transaction = await prisma.transfer.create({
        data: {
          account_id: transfer.accountId,
          account_receiver_id: transfer.accountReceiverId,
          value: transfer.value,
          schedule_date: transfer.scheduleTo.toJSDate(),
          status: transfer.status
        }
      })
    });
      
    return transaction;
  }

  getBalance = async(userId: string, accountId: string) =>{
    return await prisma.account.findFirst({
      where: {
        id: accountId, 
        AND: {
          user_id: userId,
          status: "ACTIVE"
        }
      },
      select: { balance: true }
    })
  }

  getAccountById = async (id: string) => {
    return await prisma.account.findUnique({
      where:{
        id: id,
      }
    })
  }

  getDetailedTransfer = async (id:string) => {
    return await prisma.transfer.findUnique({
      where: {id: id},
      include: {
        account: {
          include: {
            user: {
              include:{ user_auth:{select: {cpf: true}}}
            }
          }
        },
        account_receiver: { 
          include: {
            user: {
              include: { user_auth: {select: { cpf: true}}}
            }
          }
        }
      }
    });

  }

  wrongPass = async (id:string) => {
    const count = await prisma.account.findUnique({
      where:{id: id},
      select: {wrong_pass: true}
    });
    if(count){
      if(count.wrong_pass+1 === 3){
        await prisma.account.update({
          where: {id: id},
          data: {
            status: "BLOCKED",  
          }
        });
      }
      await prisma.account.update({
        where: {id: id},
        data: {
          wrong_pass: {increment: 1},
          updated_at: DateTime.now().toJSDate()
        }
      });

      return count.wrong_pass+1;
    }
    
    return null;
  }

  getTransfers = async (accountId: string, page: number, params?: filters) => {
    let status : TransferStatus;
    let pages: number = 0;
    let result: Array<Transfer> = [];

    if((!!params?.endDate && !!params?.startDate) && (params?.endDate < params?.startDate)) throw new CustomError(InternalErrors.INVALID_DATE);

    if(params?.schedule === "true") status = "INPROGRESS";
    else status = "SUCCESSFUL";

    await prisma.$transaction(async (prisma) => {

      result = await prisma.transfer.findMany({
        orderBy: {
          created_at: 'desc'
        },
        where: {
          OR: 
          params?.type === "in"? [
            {account_receiver_id: accountId}
          ] : 
          params?.type === "out"? [
            {account_id: accountId}
          ] :
          [
            {account_id: accountId},
            status === "SUCCESSFUL"?{account_receiver_id: accountId}: {account_receiver_id: undefined}
          ],
          AND: params?[
            { 
              schedule_date:{
                gte: params.startDate? params.startDate: DateTime.now().minus({days: 15}).toJSDate(),
                lte: params.endDate? params.endDate: DateTime.now().toJSDate()
              }
            },
            {
              status: status
            }
          ]: undefined,
        },
        skip: (page - 1) * take,
        take: take,
      });
  
      pages = await prisma.transfer.count({
        where: {
          OR: 
          params?.type === "in"? [
            {account_receiver_id: accountId}
          ] : 
          params?.type === "out"? [
            {account_id: accountId}
          ] :
          [
            {account_id: accountId},
            {account_receiver_id: accountId}
          ],
          AND: params?[
            { 
              schedule_date:{
                gte: params.startDate? params.startDate: undefined,
                lte: params.endDate? params.endDate: undefined
              }
            },
            {
              status: status
            }
          ]: undefined,
        },
      })

    })
    

    return {result: result, pages: pages}
  }

  verifyPassword = async (accountId: string, password: string) => {
    const account = await prisma.account.findUnique({
      where: {id: accountId}
    })

    return account? await bcrypt.compare( password, account.transaction_password)? true: false: false;
  }

  verifyAccount = async (accountId: string, userId: string) => {
    const account = await prisma.account.findFirst({
      where: {id: accountId, user_id: userId}
    })

    return account? true: false;
  }

  updatePassword =async (password: string ,accountId: string) => {
    const salt = bcrypt.genSaltSync(10);
    return await prisma.account.update({
      where: { id: accountId},
      data: {
        transaction_password: bcrypt.hashSync(password, salt),
        updated_at: new Date()
      }
    }) 
  }
};