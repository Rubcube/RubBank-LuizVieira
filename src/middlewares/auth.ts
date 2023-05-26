import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { InternalErrors } from 'utils/ErrorsType';

export const authentication = (req: Request, res:Response, next: NextFunction) => {

  const token = req.headers.token?.toString();

  if (process.env.JWT_SECRET_KEY != undefined && token != undefined) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
      if (err) return res.status(500).json(InternalErrors.TOKEN_ERROR);
      res.locals.token = jwt.decode(token);
      next();
    });
  }
  else return res.status(401).json(InternalErrors.TOKEN_ERROR);

}

export const suportAuthentication = (req: Request, res:Response, next: NextFunction) => {

  const token = req.headers.token?.toString();

  if (process.env.ADM_PASSWORD != undefined && token != undefined) {
    jwt.verify(token, process.env.ADM_PASSWORD, function(err, decoded) {
      if (err) return res.status(500).json(InternalErrors.TOKEN_ERROR);
      res.locals.token = jwt.decode(token);
      next();
    });
  }
  else return res.status(401).json(InternalErrors.TOKEN_ERROR);

}