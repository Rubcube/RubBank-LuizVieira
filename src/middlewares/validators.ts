import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import emailValidator from "email-validator";
import cpfValidator from "cpf-check";

export const OnboardingValidation = (req: Request, res:Response, next: NextFunction) => {

  const userValidation = z
    .object({

      full_name: z
        .string().min(2)
        .refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value))
        .refine((value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value)),

      phone: z
        .string().min(11)
        .refine((value) => /^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/.test(value)),

      cpf: z.string().min(11),

      password: z
        .string().min(8)
        .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[^\s]).{8,}$/),

      transaction_password: z
        .string().min(4).max(4)
        .refine((value) => /^\d{4}$/),

    })
    .safeParse(req.body);

  if(!userValidation.success){
    return res.status(400).send(userValidation.error.issues);
  }

  if(!emailValidator.validate(req.body.email)){
    return res.status(400).send({'message': 'invalid email'});
  }

  if(!cpfValidator.validate(req.body.cpf)){
    return res.status(400).send({'menssage': 'invalid cpf'});
  }

  next();
}