import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import emailValidator from "email-validator";
import cpfValidator from "cpf-check";
import { UserInfoIn } from 'dtos/UsersDTO';

export const OnboardingValidation = (req: Request, res:Response, next: NextFunction) => {

  const UserIn = z.object({
    full_name: z.string().min(2)
                .regex( /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/)
                .regex(/^[a-zA-Z]+\s+[a-zA-Z]+$/),
      
    phone:     z.string().min(11)
                .regex(/^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/),
  
    cpf:       z.string().min(11).refine((value) => cpfValidator),
    birth:     z.string().datetime({precision: 3}).nullish(),
  }) .safeParse(req.body);
  
  if(!UserIn.success){
    return res.status(400).send(UserIn.error.issues);
  }
  

  next();
}