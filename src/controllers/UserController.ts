import { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { UserAuthIn, UserInfoIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import UserAuthModel from "models/UserAuthModel";
import * as dotenv from 'dotenv'
dotenv.config()

const userModel = new UserModel();
const userAuthModel = new UserAuthModel();

export default class UserController {

  create = async (req: Request, res: Response) => {
    try{

      const userInfo : UserInfoIn = { 
        full_name: req.body.full_name,
        phone: req.body.phone.replace(/[^\d]+/g,''),
        email: req.body.email,
        birth: new Date(req.body.birth),
        user_auth: {
          ...req.body.user_auth,
          cpf: req.body.user_auth.cpf.replace(/[^\d]+/g,'')
        },
        address: {
          ...req.body.address,
          cep: req.body.address.cep.replace(/[^\d]+/g,'')
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

  get = async (req: Request, res: Response) => {
    try {
      
      res.status(201).json();
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Failed to get user",
      });
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

  update = async (req: Request, res: Response) => {
    try {
      
    } catch (e) {
      console.log("Failed to update user", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update user",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      
    } catch (e) {
      console.log("Failed to delete user", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete user",
      });
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
