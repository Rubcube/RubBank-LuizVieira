import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

export const authentication = (req: Request, res:Response, next: NextFunction) => {

  const token = req.headers.token?.toString();

  if (process.env.JWT_SECRET_KEY != undefined && token != undefined) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
      if (err) return res.status(500).json({ code: 'token_error', auth: false, message: 'Failed to authenticate token.' });
      req.body = jwt.decode(token);
      next();
    });
  }
  else return res.status(401).json({ code: 'token_error',auth: false, message: 'No token provided.' });

}