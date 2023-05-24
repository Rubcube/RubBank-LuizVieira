import { Account } from "dtos/AccountDTO";
import { TransferIn, resExtrato, transferOut, transfers } from "dtos/TransferDTO";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import AccountModel from "models/AccountModel";
import CustomError, {InternalErrors} from "utils/ErrorsType";
const bcrypt = require('bcrypt');
const accountModel = new AccountModel()

export default class AccountController{

    getAccount = async (req: Request, res: Response) => {
      try{
        const account = await accountModel.getAccount(res.locals.params.data.agency, parseInt(res.locals.params.data.account));
        return res.status(200).json({
          account: {
            id: account?.id,
            agency: account?.agency,
            account_number: account?.account_number,
            user:{
              full_name: account?.user.full_name,
              cpf: account?.user.user_auth?.cpf
            }
          }
        }); 
      }catch(err:any){
        console.error(err);
        return res.status(500).json({error: [err.error]})
      }
    }

    createTransfer = async (req: Request, res: Response) => {
        try{
          const accountReceiver: Account | null = await accountModel.getAccountById(req.body.accountReceiverId);
          const accountOrigin: Account | null  = await accountModel.getAccountById(req.body.accountId);

          if(accountOrigin === null || accountReceiver === null || accountReceiver.status !== "ACTIVE")
            throw new CustomError(InternalErrors.ACCOUNT_NOT_FOUND);

          if(res.locals.token.id !== accountOrigin.user_id)
            throw new CustomError(InternalErrors.ACCESS_DENIED);

          if(accountOrigin.status !== "ACTIVE")
            throw new CustomError(InternalErrors.ACCOUNT_STATUS_ERROR);
          
          if(accountOrigin.id === accountReceiver.id || req.body.value === 0)
            throw new CustomError(InternalErrors.TRANSACTION_DENIED);
          
          if(DateTime.fromJSDate(req.body.scheduleTo).startOf("day") < DateTime.now().startOf("day"))
            throw new CustomError(InternalErrors.INVALID_DATE);

          if(! await bcrypt.compare(req.body.transaction_password, accountOrigin.transaction_password)){
            const count = await accountModel.wrongPass(accountOrigin.id);
            return res.status(401).json([{
              code: InternalErrors.WRONG_PASSWORD.code, 
              message: InternalErrors.WRONG_PASSWORD.message,
              count: count
            }]);
          }
          const transfer: TransferIn = {
            accountId: accountOrigin.id,
            accountReceiverId: accountReceiver.id,
            originBalance: accountOrigin.balance,
            receiverBalance: accountReceiver.balance,
            value: req.body.value,
            scheduleTo: DateTime.fromJSDate(req.body.scheduleTo),
            status: DateTime.fromJSDate(req.body.scheduleTo).startOf("day") > DateTime.now().startOf("day")? "INPROGRESS": "SUCCESSFUL"
          }

          const createdTransfer: any = await accountModel.createTransaction(transfer);
          return res.status(201).json(createdTransfer.id);

        }catch(err: any){
          console.error(err);
          return res.status(400).json({error:[err.error]});
        }
        
    }

    getBalance = async (req: Request, res: Response) => {
        try {
          if(req.params.accountId != undefined){
            const balance = await accountModel.getBalance(res.locals.token.id, req.params.accountId);
    
            if(balance === null) throw new CustomError(InternalErrors.ACCESS_DENIED);
            
            return res.status(200).json(balance);

          }else{
            throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);
          }
        } catch (err: any) {
          return res.status(400).json({error:[err.error]});
        }
    }

    getDetailedTransfer = async (req: Request, res: Response) => {
      try{
        if(req.query.id !== undefined){

          const result = await accountModel.getDetailedTransfer(req.query.id as string);

          if(result){

            if(result?.account.user_id !== res.locals.token.id && result?.account_receiver.user_id !== res.locals.token.id)
              throw new CustomError(InternalErrors.ACCESS_DENIED);

            if(result?.account_receiver.user_id === res.locals.token.id && result.status === "INPROGRESS") 
              throw new CustomError(InternalErrors.ACCESS_DENIED);
              
            const detailedTransfer: transferOut = {
              id: result.id,
              value: result.value,
              created_at: DateTime.fromJSDate(result.created_at),
              schedule_date: DateTime.fromJSDate(result.schedule_date),
              status: result.status,
              type: result.account.user_id === res.locals.token.id? "out": "in",
              account: {
                agency: result.account.agency,
                account_number: result.account.account_number,
                full_name: result.account.user.full_name,
                cpf: result.account.user.user_auth?.cpf,
              },
              account_receiver: {
                agency: result.account_receiver.agency,
                account_number: result.account_receiver.account_number,
                full_name: result.account_receiver.user.full_name,
                cpf: result.account_receiver.user.user_auth?.cpf,
              },
            }
            return res.status(200).json({transfer: detailedTransfer});
          }
          throw new CustomError(InternalErrors.TRANSACTION_NOT_FOUND);

        }
        throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);

      }catch(err: any){
        console.error(err);
        return res.status(400).json({error:[err.error]});
      }
    }

    getExtrato = async (req: Request, res: Response) => {
      try{
        if(!req.query.accountId) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);
        
        const account: Account | null  = await accountModel.getAccountById(req.query.accountId as string);

        if(account === null || res.locals.token.id !== account.user_id) throw new CustomError(InternalErrors.ACCESS_DENIED);

        const page: number = req.query.page? parseInt(req.query.page as string): 1;
        const result = await accountModel.getTransfers(req.query.accountId as string, page, res.locals.params.data);
        
        let transfers: Array<transfers> = [];

        result.result.forEach( (transaction) => {
          transfers.push({
            id: transaction.id,
            schedule_date: transaction.schedule_date,
            value: transaction.value,
            status: transaction.status,
            type: transaction.account_id === req.query.accountId? "out" : "in"
          })
        })

        let extrato: resExtrato = {
          pagination: {
            pages: Math.ceil(result.pages / 10),
            actualPage: page,
            maxPerPage: 10,
          },
          transfers: transfers
        };
        
        return res.status(200).json(extrato);
      }catch(err: any){
        console.error(err);
        return res.status(500).json({error:[err.error]})
      }
      
    }

    updatePassword =async (req: Request, res: Response) => {
      try{
        await accountModel.updatePassword(req.body.transaction_password, res.locals.token.id);
        return res.status(200).send();
      }catch(err: any){
        console.error(err);
        return res.status(500).json({error: [err.error]});
      }
    }
}

