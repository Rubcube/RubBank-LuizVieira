import { Request, Response, NextFunction } from 'express';
import { InternalErrors } from 'utils/ErrorsType';

export const authAdmToken = (req: Request, res:Response, next: NextFunction) => {

  const admToken = req.headers.admtoken;

  if(process.env.ADM_PASSWORD === admToken)next();
  else return res.status(401).json(InternalErrors.ACCESS_DENIED);

}