import { Account, AccountOut } from "dtos/AccountDTO";
import { TransferIn } from "dtos/TransferDTO";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import AccountModel from "models/AccountModel";
import {InternalErrors} from "utils/ErrorsType";
const bcrypt = require('bcrypt');
const accountModel = new AccountModel()

export default class AccountController{
    createTransfer = async (req: Request, res: Response) => {
        try{
          const accountReceiver: Account | null = await accountModel.getAccount(req.body.receiver.agency, req.body.receiver.accountNumber);
          const accountOrigin: Account | null  = await accountModel.getAccountById(req.body.accountId);

          if(accountOrigin === null || accountReceiver === null || accountReceiver.status !== "ACTIVE"){
            return res.status(404).json(InternalErrors.ACCOUNT_NOT_FOUND);
          }

          if(res.locals.token.id !== accountOrigin.user_id){
            return res.status(401).json(InternalErrors.ACCESS_DENIED);
          }

          if(accountOrigin.id === accountReceiver.id){
            return res.status(400).json(InternalErrors.TRANSACTION_DENIED)
          }

          if(! await bcrypt.compare(req.body.transaction_password, accountOrigin.transaction_password)){
            return res.status(401).json(InternalErrors.WRONG_PASSWORD);
          }

          if(accountOrigin.status !== "ACTIVE"){
            return res.status(401).json(InternalErrors.ACCOUNT_STATUS_ERROR);
          }

          if(DateTime.fromISO(req.body.scheduleTo).day < DateTime.now().day){
            return res.status(400).json(InternalErrors.INVALID_DATE);
          }

          const transfer: TransferIn = {
            accountId: accountOrigin.id,
            accountReceiverId: accountReceiver.id,
            originBalance: accountOrigin.balance,
            receiverBalance: accountReceiver.balance,
            value: req.body.value,
            scheduleTo: DateTime.fromISO(req.body.scheduleTo)
          }

          const createdTransfer = await accountModel.createTransaction(transfer);
          return res.status(201).json(createdTransfer);

        }catch(err: any){

          if(err.error === InternalErrors.INVALID_BALANCE){
            return res.status(400).json(err.error);
          }

          console.error(err);
          return res.status(500).json(InternalErrors.TRANSACTION_FAILED);
        }
        
    }

    getBalance = async (req: Request, res: Response) => {
        try {
          if(req.params.accountId != undefined){
            const balance = await accountModel.getBalance(res.locals.token.id, req.params.accountId);
    
            if(balance === null){
              return res.status(200).json(InternalErrors.ACCESS_DENIED);
            }
    
            return res.status(200).json(balance);
          }else{
            return res.status(400).json(InternalErrors.PARAMS_NOT_DEFINED);
          }
        } catch (e) {
          return res.status(404).json(InternalErrors.ACCOUNT_NOT_FOUND);
        }
    }

}

