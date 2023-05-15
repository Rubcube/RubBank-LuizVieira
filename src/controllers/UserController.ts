import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { UserAuthIn, UserInfoIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import UserAuthModel from "models/UserAuthModel";
import * as dotenv from 'dotenv'
import { replaceRegex } from "utils/regex";
dotenv.config()

const userModel = new UserModel();
const userAuthModel = new UserAuthModel();

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
      
      res.status(500).json({code: "user_not_created", message: "Failed to create a user"});
    }
    
  };

  getByToken = async (req: Request, res: Response) => {

    try {
      const user = await userModel.get(req.body.id);
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({code: "user_not_find",message: "Failed to find user"});
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
            expiresIn: 30
          })
          return res.json({ auth: true, token: token});
        }
      }

      return res.status(401).json({code: 'bad_credentials', messsage: 'credentials must be valid'});

    } catch (e) {
      console.log("Failed to find user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to find user",
      });
    }
  }
}
