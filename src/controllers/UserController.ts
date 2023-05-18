import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { UserAuthIn, UserInfoIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import UserAuthModel from "models/UserAuthModel";
import * as dotenv from 'dotenv'
import { replaceRegex } from "utils/regex";
import { InternalErrors } from "utils/ErrorsType";
import AccountModel from "models/AccountModel";
dotenv.config()

const userModel = new UserModel();
const userAuthModel = new UserAuthModel();
const accountModel = new AccountModel();

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
      
      res.status(500).json(InternalErrors.ONBOARDING_FAILED);
    }
    
  };

  getByToken = async (req: Request, res: Response) => {
    try {
      const user = await userModel.get(req.body.id);
      res.status(200).json(user);
    } catch (e) {
      res.status(404).json(InternalErrors.USER_NOT_FOUND);
    }
  };

  login = async (req: Request, res:Response) =>{

    try{

      const user: UserAuthIn = {
        cpf: req.body.cpf,
        password: req.body.password
      }

      const userId = await userAuthModel.getId(user)   
      
      if(userId != null){
        if(process.env.JWT_SECRET_KEY != undefined){
          const token = jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {
            expiresIn: 300
          })
          return res.json({ auth: true, token: token});
        }
      }

      return res.status(401).json(InternalErrors.BAD_CREDENTIALS);

    } catch (e) {
      res.status(404).json(InternalErrors.USER_NOT_FOUND);
    }
  }
}
