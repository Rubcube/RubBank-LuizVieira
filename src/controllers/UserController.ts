import { Request, Response } from "express";
import { UserAuthIn, UserInfoIn, UserOut } from "dtos/UsersDTO";
import UserModel from "models/UserModel";
import UserAuthModel from "models/UserAuthModel";
import AdressModel from "models/AdressModel";
import { AddressIn } from "dtos/AddressDTO";
import AccountModel from "models/AccountModel";

const userModel = new UserModel();
const userAuthModel = new UserAuthModel();
const adressModel = new AdressModel();
const accountModel = new AccountModel();

export default class UserController {

  create = async (req: Request, res: Response) => {
    try{

      const userInfo : UserInfoIn = { 
        full_name: req.body.full_name,
        phone: req.body.phone,
        cpf: req.body.cpf,
        birth: new Date(req.body.birth)
      };

      const newUser: UserOut = await userModel.create(userInfo);

      const userAuth : UserAuthIn = {
        user_info_id: newUser.id,
        email: req.body.email,
        password: req.body.password,
      } 

      const adress: AddressIn = {
        user_id: newUser.id,
        cep: req.body.cep,
        type: req.body.type,
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        state: req.body.state
      };

      await userAuthModel.create(userAuth);
      await adressModel.create(adress);
      await accountModel.create(req.body.transaction_password, newUser.id);

      
      res.status(201).json({id: newUser.id, name: newUser.full_name});
    }catch(e){
      console.log("Failed to create user", e);
      res.status(500).send({
        error: "USR-01",
        message: "Failed to create user",
      });
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

  getAll = async (req: Request, res: Response) => {
    try {
      res.status(201).json();
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
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
}
