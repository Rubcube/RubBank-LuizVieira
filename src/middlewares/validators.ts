import { Request, Response, NextFunction } from 'express';
import { ErrorsMessage } from 'utils/ErrorsType';
import { emailRegex, fullNameRegex, passwordRegex, phoneRegex, replaceRegex, transactionPasswordRegex } from 'utils/regex';
import { z } from 'zod';

export const OnboardingValidation = (req: Request, res:Response, next: NextFunction) => {
  const UserIn = z.object({
    full_name: z.string().trim().regex(fullNameRegex, ErrorsMessage.invalid_string.default),
    phone: z.string().trim().min(11, {message: ErrorsMessage.invalid_length.phone}).regex(phoneRegex),
    birth: z.string().trim().datetime({precision: 3}).nullish(),
    email: z.string().trim().regex(emailRegex, ErrorsMessage.invalid_string.default),

    user_auth: z.object({
      cpf: 
        z.string().min(11, ErrorsMessage.invalid_length.cpf).transform((value) => value.replace(replaceRegex ,''))
         .refine((value) => cpfValidator(value), {message: ErrorsMessage.custom.invalidCPF}),
      password: z.string().trim().regex(passwordRegex, {message: ErrorsMessage.invalid_string.password})
    }),
    
    address: z.object({
      cep: z.string().trim().min(8, {message: ErrorsMessage.invalid_length.cep}),
      type: z.string().trim().nullish(),
      street: z.string().trim().min(2, {message: ErrorsMessage.invalid_length.street}),
      number: z.string().trim(),
      complement: z.string().trim().nullish(),
      city: z.string().trim(),
      state: z.string().trim().length(2, {message: ErrorsMessage.invalid_length.state})
    }),

    account: z.object({
      transaction_password: 
        z.string().trim().regex(transactionPasswordRegex, {message: ErrorsMessage.invalid_string.transaction_password})
         .length(4, {message: ErrorsMessage.invalid_string.transaction_password})
    }),
    
  }) .safeParse(req.body, {
    errorMap: (issue, _ctx) => {
      if(issue.message){return {message: issue.message}};
      switch(issue.code){
        case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
        case 'invalid_type': return {message: ErrorsMessage.invalid_type};
        default: return {message: ErrorsMessage.default};
      }
    }
  });
  
  if(!UserIn.success){
    return res.status(400).send(UserIn.error.issues);
  }
  next();
}

export const cpfValidator = (cpf: string) => {
	if(cpf == '') return false;	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
		return false;		

	let soma = 0;
  let resto;	

	for (let i=0; i < 9; i ++)soma += parseInt(cpf.charAt(i)) * (10 - i);	
  resto = 11 - (soma % 11);	
	if (resto == 10 || resto == 11)resto = 0;	
	if (resto != parseInt(cpf.charAt(9)))return false;		

	soma = 0;	
	for (let i = 0; i < 10; i ++)soma += parseInt(cpf.charAt(i)) * (11 - i);	
	resto = 11 - (soma % 11);	
	if (resto == 10 || resto == 11)resto = 0;	
	if (resto != parseInt(cpf.charAt(10)))return false;		

	return true;   
}

export const transactionValidation = (req: Request, res: Response, next: NextFunction) => {

}