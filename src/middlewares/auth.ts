import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"

export const authentication = (req: Request, res:Response, next: NextFunction) => {

  const token = req.headers.token?.toString();

  if (process.env.JWT_SECRET_KEY != undefined && token != undefined) {
    console.log(jwt.verify(token, process.env.JWT_SECRET_KEY));
    next();
  }
  else return res.status(401).json({ auth: false, message: 'No token provided.' });

}