import { Account, TicketStatus } from "@prisma/client";
import { SuportAuth, SuportInfo, params, tickets } from "dtos/SuportDTO";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import SuportModel from "models/SuportModel";
import CustomError, {InternalErrors} from "utils/ErrorsType";
import { regex, take } from "utils/Constantes";
import { z } from "zod";
import { messageOut, messages } from "dtos/MessageDTO";
import  jwt from "jsonwebtoken";
import UserModel from "models/UserModel";
import AccountModel from "models/AccountModel";

const suportModel = new SuportModel();
const userModel = new UserModel();
const accountModel = new AccountModel();

export default class SuportController{
    create = async (req: Request, res: Response) => {
        try{

            const suportInfo : SuportInfo = { 
              name: req.body.name,
              email: req.body.email,
              role: req.body.role,
              suport_auth: {
                cpf: req.body.suport_auth.cpf.replace(regex.replace,''),
                password: req.body.suport_auth.password
              }
            };
      
            const newSuport = await suportModel.create(suportInfo);
      
            res.status(201).json(newSuport);
        }catch(err){
            console.error(err);
            res.status(500).json({error:[InternalErrors.INTERNAL_ERROR]});
        }
    }

    get = async (req: Request, res: Response) => {
      try {
        const suport = await suportModel.get(res.locals.token.id);
        //if(suport?.status !== "ACTIVE") throw new CustomError(InternalErrors.ACCOUNT_STATUS_ERROR);
        res.status(200).json({user: suport});
      } catch (err: any) {
        console.error(err);
        return res.status(500).json({error: [err.error]});
      }
    }

    getTickets = async (req: Request, res: Response) => {
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;

      try{
        const page = z.number().safeParse(req.query.page? parseInt(req.query.page as string): 1);
        
        if(!page.success) throw new CustomError(InternalErrors.INVALID_PARAMS)
        
        if(req.query.status
          && req.query.status !== TicketStatus.DOING 
          && req.query.status !== TicketStatus.DONE
          && req.query.status !== TicketStatus.TODO) 
          throw new CustomError(InternalErrors.INTERNAL_ERROR);

        if(req.query.startDate){
          startDate = DateTime.fromISO(req.query.startDate as string).toJSDate();
          const parse = z.date().safeParse(startDate);
          if(!parse.success) throw new CustomError(InternalErrors.INVALID_DATE);
        }

        if(req.query.endDate){
          endDate = DateTime.fromISO(req.query.endDate as string).toJSDate();
          const parse = z.date().safeParse(endDate);
          if(!parse.success) throw new CustomError(InternalErrors.INVALID_DATE)
        }

        const params: params = {
          status: req.query.status? req.query.status as TicketStatus: undefined,
          startDate: startDate,
          endDate: endDate,
          userId: req.query.userId? req.query.userId as string: undefined
        }

        const result = await suportModel.getTickets(page.data, params);

        const tickets: tickets = {
          pagination: {
            actualPage: page.data,
            maxPerPage: take,
            pages: Math.ceil(result.pages / take),
          },
          tickets: result.tickets
        };
        return res.status(200).json(tickets);
      }catch(err:any){
        console.error(err)
        return res.status(500).json({error: [err.error]})
      }
    }

    sendMessage = async (req: Request, res: Response) => {
      try{
        if(!req.query.ticketId) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);

        const page = z.number().safeParse(req.query.page? parseInt(req.query.page as string): 1);
        
        if(!page.success) throw new CustomError(InternalErrors.INVALID_PARAMS)
        
        if(await suportModel.getTicketById(req.query.ticketId as string) === null) 
          throw new CustomError(InternalErrors.TICKET_NOT_FOUND);
  
        await suportModel.createMessage(res.locals.token.id, req.query.ticketId as string, req.body.message);
        const result = await suportModel.getMessages(req.query.ticketId as string, page.data);
  
        let messages: Array<messageOut> = [];

        result.forEach( (message) => {
          messages.push({
            message: message.message,
            direction: message.user_id? "received": "send",
            created_at: message.created_at
          })
        });

        const resObject: messages = {
          pagination:{
            actualPage: page.data,
            maxPerPage: take
          },
          messages: messages
        };
  
          
        return res.status(200).json(resObject);
      }catch(err:any){
        console.error(err)
        return res.status(500).json({error: [err.error]})
      }
    }

    getMessages = async (req: Request, res: Response) => {
      try{
        if(!req.query.ticketId) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);
        
        const page = z.number().safeParse(req.query.page? parseInt(req.query.page as string): 1);
        
        if(!page.success) throw new CustomError(InternalErrors.INVALID_PARAMS)

        if(await suportModel.getTicketById(req.query.ticketId as string) === null) 
          throw new CustomError(InternalErrors.TICKET_NOT_FOUND);
  
        const result = await suportModel.getMessages(req.query.ticketId as string, page.data);

        let messages: Array<messageOut> = [];

        result.forEach( (message) => {
          messages.push({
            message: message.message,
            direction: message.user_id? "received": "send",
            created_at: message.created_at
          })
        })

        const resObject: messages = {
          pagination:{
            actualPage: page.data,
            maxPerPage: take
          },
          messages: messages
        };
  
          
        return res.status(200).json(resObject);
      }catch(err:any){
        console.error(err)
        return res.status(500).json({error: [err.error]})
      }
    }

    login = async (req: Request, res:Response) =>{

      try{
  
        const suport: SuportAuth = {
          cpf: req.body.cpf.replace(regex.replace,''),
          password: req.body.password
        }
  
        const suportId = await suportModel.getId(suport)   
        
        if(suportId != null){
          if(process.env.ADM_PASSWORD != undefined){
            const token = jwt.sign({id: suportId}, process.env.ADM_PASSWORD, {
              expiresIn: 6000
            })
            return res.json({ auth: true, token: token});
          }
        }
  
        return res.status(401).json({error:[InternalErrors.BAD_CREDENTIALS]});
  
      } catch (err) {
        res.status(404).json({error:[InternalErrors.USER_NOT_FOUND]});
      }
    }

    getUser = async (req: Request, res:Response) => {
      try{
        const user = await userModel.get(req.query.userId as string);
        res.status(200).json({user: user});
      }catch(err:any){
        console.error(err)
        return res.status(500).json({error: [err.error]})
      }
    }

    putTicketStatus = async (req: Request, res:Response) => {
      try{   
        if(req.query.status
          && req.query.status !== TicketStatus.DOING 
          && req.query.status !== TicketStatus.DONE
          && req.query.status !== TicketStatus.TODO) 
          throw new CustomError(InternalErrors.INTERNAL_ERROR);

        if(!req.query.ticketId) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED)

        const result = await suportModel.putTicketStatus(req.query.ticketId as string, req.query.status as TicketStatus);

        return res.status(200).json(result);
      }catch(err:any){
        console.error(err)
        return res.status(500).json({error: [err.error]})
      }
    }

    /*getExtrato = async (req: Request, res: Response) => {
      try{
        if(!req.query.accountId) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);
        
        const account: Account | null  = await accountModel.getAccountById(req.query.accountId as string);

        if(account === null || res.locals.token.id !== account.user_id) throw new CustomError(InternalErrors.ACCESS_DENIED);

        const page = z.number().safeParse(req.query.page? parseInt(req.query.page as string): 1);
        if(!page.success) throw new CustomError(InternalErrors.INVALID_PARAMS)

        const result = await accountModel.getTransfers(req.query.accountId as string, page.data, res.locals.params.data);
        
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
            pages: Math.ceil(result.pages / take),
            actualPage: page.data,
            maxPerPage: take,
          },
          transfers: transfers
        };
        
        return res.status(200).json(extrato);
      }catch(err: any){
        console.error(err);
        return res.status(500).json({error:[err.error]})
      }
      
    }*/
}

