import { TicketStatus } from "@prisma/client";
import { SuportAuth, SuportInfo, params, tickets } from "dtos/SuportDTO";
import { Request, Response } from "express";
import { DateTime } from "luxon";
import SuportModel from "models/SuportModel";
import CustomError, {InternalErrors} from "utils/ErrorsType";
import { regex, take } from "utils/Constantes";
import { z } from "zod";
import { messageOut, messages } from "dtos/MessageDTO";
import  jwt from "jsonwebtoken";

const suportModel = new SuportModel();

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

    getMessages =async (req: Request, res: Response) => {
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
}

