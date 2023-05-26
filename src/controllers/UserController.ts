import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { UserAuthIn, UserAuthUpdate, UserInfoIn, UserInfoUpdate, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import UserAuthModel from "models/UserAuthModel";
import * as dotenv from 'dotenv'
import { regex, take } from "utils/Constantes";
import CustomError, { InternalErrors } from "utils/ErrorsType";
import { AddressUpdate } from "dtos/AddressDTO";
import AddressModel from "models/AddressModel";
import { messageOut, messages } from "dtos/MessageDTO";
import { params, tickets } from "dtos/SuportDTO";
import { z } from "zod";
import { DateTime } from "luxon";
import { TicketStatus } from "@prisma/client";
dotenv.config()

const userModel = new UserModel();
const userAuthModel = new UserAuthModel();
const addressModel = new AddressModel();

export default class UserController {

  create = async (req: Request, res: Response) => {
    try{

      const userInfo : UserInfoIn = { 
        full_name: req.body.full_name,
        phone: req.body.phone.replace(regex.replace,''),
        email: req.body.email,
        birth: new Date(req.body.birth),
        user_auth: {
          ...req.body.user_auth,
          cpf: req.body.user_auth.cpf.replace(regex.replace,'')
        },
        address: {
          ...req.body.address,
          cep: req.body.address.cep.replace(regex.replace,'')
        },
        account: {
          transaction_password: req.body.account.transaction_password
        }
      };

      const newUser: UserOut = await userModel.create(userInfo);

      res.status(201).json({id: newUser.id, name: newUser.full_name});
    }catch(e){
      
      res.status(500).json({error:[InternalErrors.ONBOARDING_FAILED]});
    }
    
  };

  getByToken = async (req: Request, res: Response) => {
    try {
      const user = await userModel.get(res.locals.token.id);
      if(user?.status !== "ACTIVE") throw new CustomError(InternalErrors.ACCOUNT_STATUS_ERROR);
      res.status(200).json({user: {
        full_name: user.full_name,
        cpf: user.user_auth?.cpf,
        email: user.email,
        phone: user.phone,
        birth: user.birth,
        account: user.account,
        address: user.address,

      }});
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({error: [err.error]});
    }
  };

  login = async (req: Request, res:Response) =>{

    try{

      const user: UserAuthIn = {
        cpf: req.body.cpf.replace(regex.replace,''),
        password: req.body.password
      }

      const userId = await userAuthModel.getId(user)   
      
      if(userId != null){
        if(process.env.JWT_SECRET_KEY != undefined){
          const token = jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {
            expiresIn: 6000
          })
          const accounts = await userModel.getAccounts(userId);
          return res.json({ auth: true, token: token, accounts: accounts});
        }
      }

      return res.status(401).json({error:[InternalErrors.BAD_CREDENTIALS]});

    } catch (err) {
      res.status(404).json({error:[InternalErrors.USER_NOT_FOUND]});
    }
  }

  getAccounts = async (req: Request, res: Response) => {
    try{
      const accounts = await userModel.getAccounts(res.locals.token.id);
      res.status(200).json({accounts: accounts});
    }catch(err:any){
      console.error(err)
      return res.status(500).json({error: [err.error]})
    }
  }

  updateInfo = async (req: Request, res: Response) => {
    try{
      const dataUser: UserInfoUpdate = {
        full_name: req.body.full_name? req.body.full_name: undefined,
        birth: req.body.birth? req.body.birth: undefined,
        email: req.body.email? req.body.email: undefined,
        phone: req.body.phone? req.body.phone: undefined
      }
      
      if(await userModel.userExists(dataUser)) throw new CustomError(InternalErrors.INTERNAL_ERROR);

      await userModel.updateInfo(dataUser, res.locals.token.id);

      return res.status(200).send();
    }catch(err: any){
      console.error(err);
      return res.status(500).json({error: [err.error]});
    }
  }

  updateAuth = async (req: Request, res: Response) => {
    try{
      const dataUser: UserAuthUpdate = {
        ...req.body
      }

      if(!await userAuthModel.verifyPassword(res.locals.token.id, dataUser.oldPassword)) throw new CustomError(InternalErrors.BAD_CREDENTIALS)

      await userAuthModel.updateAuth(dataUser, res.locals.token.id)

      return res.status(200).send();
    }catch(err: any){
      console.error(err);
      return res.status(500).json({error: [err.error]});
    }
  }

  updateAddress = async (req: Request, res: Response) => {
    try{
      if(!req.params.id) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);
      
      if(await addressModel.getAddressByUser(res.locals.token.id, req.params.id as string) === null) 
        throw new CustomError(InternalErrors.ADDRESS_NOT_FOUND);

      const dataUser: AddressUpdate = {
        ...req.body
      }
      await addressModel.update(dataUser, req.params.id as string)

      return res.status(200).send();
    }catch(err: any){
      console.error(err);
      return res.status(500).json({error: [err.error]});
    }
  }

  createTicket = async (req: Request, res: Response) => {
    try{
      const ticket = await userModel.createTicket(req.body.title, req.body.description, res.locals.token.id);
      return res.status(200).json(ticket);
    }catch(err: any){
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
        userId: res.locals.token.id
      }

      const result = await userModel.getTickets(page.data, params);

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
      
      if(!page.success) throw new CustomError(InternalErrors.INVALID_PARAMS);

      if(await userModel.getTicketById(res.locals.token.id, req.query.ticketId as string) === null) 
        throw new CustomError(InternalErrors.TICKET_NOT_FOUND);

      await userModel.createMessage(res.locals.token.id, req.query.ticketId as string, req.body.message);
      const result = await userModel.getMessages(req.query.ticketId as string, page.data);

      let messages: Array<messageOut> = [];

      result.forEach( (message) => {
        messages.push({
          message: message.message,
          direction: message.user_id? "send": "received",
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

  getMessages =async (req: Request, res: Response) => {
    try{
      if(!req.query.ticketId) throw new CustomError(InternalErrors.PARAMS_NOT_DEFINED);
      
      if(await userModel.getTicketById(res.locals.token.id, req.query.ticketId as string) === null) throw new CustomError(InternalErrors.TICKET_NOT_FOUND);

      const page = z.number().safeParse(req.query.page? parseInt(req.query.page as string): 1);
      
      if(!page.success) throw new CustomError(InternalErrors.INVALID_PARAMS)

      const result = await userModel.getMessages(req.query.ticketId as string, page.data);

      let messages: Array<messageOut> = [];

      result.forEach( (message) => {
        messages.push({
          message: message.message,
          direction: message.user_id? "send": "received",
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
}
