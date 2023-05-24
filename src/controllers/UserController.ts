import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { UserAuthIn, UserAuthUpdate, UserInfoIn, UserInfoUpdate, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import UserAuthModel from "models/UserAuthModel";
import * as dotenv from 'dotenv'
import { replaceRegex } from "utils/regex";
import CustomError, { InternalErrors } from "utils/ErrorsType";
import AccountModel from "models/AccountModel";
import { AddressUpdate } from "dtos/AddressDTO";
import AddressModel from "models/AddressModel";
dotenv.config()

const userModel = new UserModel();
const userAuthModel = new UserAuthModel();
const addressModel = new AddressModel();

export default class UserController {

  create = async (req: Request, res: Response) => {
    try{

      const userInfo : UserInfoIn = { 
        full_name: req.body.full_name,
        phone: req.body.phone.replace(replaceRegex,''),
        email: req.body.email,
        birth: new Date(req.body.birth),
        user_auth: {
          ...req.body.user_auth,
          cpf: req.body.user_auth.cpf.replace(replaceRegex,'')
        },
        address: {
          ...req.body.address,
          cep: req.body.address.cep.replace(replaceRegex,'')
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
        cpf: req.body.cpf.replace(replaceRegex,''),
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
}
