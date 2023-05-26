import { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { ErrorsMessage } from 'utils/ErrorsType';
import { regex } from 'utils/Constantes';
import { z } from 'zod';

export const OnboardingValidation = (req: Request, res:Response, next: NextFunction) => {
  if(req.body.birth) req.body.birth = DateTime.fromISO(req.body.birth).toJSDate();
  const UserIn = z.object({
    full_name: z.string().trim().regex(regex.fullName, ErrorsMessage.invalid_string.default),
    phone: z.string().trim().min(11, {message: ErrorsMessage.invalid_length.phone}).regex(regex.phone),
    birth: z.date().nullish(),
    email: z.string().trim().regex(regex.email, ErrorsMessage.invalid_string.default),

    user_auth: z.object({
      cpf: 
        z.string().min(11, ErrorsMessage.invalid_length.cpf).transform((value) => value.replace(regex.replace ,''))
         .refine((value) => cpfValidator(value), {message: ErrorsMessage.custom.invalidCPF}),
      password: z.string().trim().regex(regex.password, {message: ErrorsMessage.invalid_string.password})
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
        z.string().trim().regex(regex.transactionPassword, {message: ErrorsMessage.invalid_string.transaction_password})
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
    return res.status(400).send({error: UserIn.error.issues});
  }
  next();
}

export const TransferValidation = (req: Request, res: Response, next: NextFunction) => {
  req.body.scheduleTo = DateTime.fromISO(req.body.scheduleTo).toJSDate();
  const TransferIn = z.object({
    accountId: z.string().trim().uuid(),
    accountReceiverId: z.string().trim().uuid(),
    scheduleTo: z.date(),
    value: z.number().min(0.05, ErrorsMessage.invalid_length.value),
    transaction_password: z.string().trim().regex(regex.transactionPassword, ErrorsMessage.invalid_string.transaction_password),
  }).safeParse(req.body, {
    errorMap: (issue, _ctx) => {
      if(issue.message){return {message: issue.message}};
      switch(issue.code){
        case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
        case 'invalid_type': return {message: ErrorsMessage.invalid_type};
        default: return {message: ErrorsMessage.default};
      }
    }
  });

  if(!TransferIn.success){
    return res.status(400).send({error: TransferIn.error.issues});
  }
  next();
}

export const FiltersValidation = (req: Request, res: Response, next: NextFunction) => {
  let startDate = null;
  let endDate = null;

  if(req.query.startDate) { startDate = DateTime.fromISO(req.query.startDate as string).toJSDate(); }
  if(req.query.endDate) { endDate = DateTime.fromISO(req.query.endDate as string).toJSDate(); }

  const params = z.object({
    accountId: z.string().trim().uuid(),
    startDate: z.date().nullish(),
    endDate: z.date().nullish(),
    schedule: z.string().nullish(),
    type: z.string().nullish()
  })
    .safeParse({
      accountId: req.query.accountId,
      startDate: startDate,
      endDate: endDate,
      schedule: req.query.schedule,
      type: req.query.type
    }, {
      errorMap: (issue, _ctx) => {
        if(issue.message){return {message: issue.message}};
        switch(issue.code){
          case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
          case 'invalid_type': return {message: ErrorsMessage.invalid_type};
          default: return {message: ErrorsMessage.default};
        }
      }
    });
    if(!params.success) return res.status(400).send({error: params.error.issues});
    
  res.locals.params = params;
  next();
}

export const GetAccountParamsValidation = (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({
    agency: z.string().trim().length(4, ErrorsMessage.default),
    account: z.string().trim()
  })
    .safeParse({
      agency: req.query.agency,
      account: req.query.account,
    }, {
      errorMap: (issue, _ctx) => {
        if(issue.message){return {message: issue.message}};
        switch(issue.code){
          case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
          case 'invalid_type': return {message: ErrorsMessage.invalid_type};
          default: return {message: ErrorsMessage.default};
        }
      }
    });
    if(!params.success) return res.status(400).send({error: params.error.issues});
    
  res.locals.params = params;
  next();
}

export const PutAddressValidation = (req: Request, res: Response, next: NextFunction) => {

  const address = z.object({
    cep: z.string().trim().min(8, {message: ErrorsMessage.invalid_length.cep}).nullish(),
    type: z.string().trim().nullish(),
    street: z.string().trim().min(2, {message: ErrorsMessage.invalid_length.street}).nullish(),
    number: z.string().trim().nullish(),
    complement: z.string().trim().nullish(),
    city: z.string().trim().nullish(),
    state: z.string().trim().length(2, {message: ErrorsMessage.invalid_length.state}).nullish()
  }).safeParse({...req.body}, {
    errorMap: (issue, _ctx) => {
      if(issue.message){return {message: issue.message}};
      switch(issue.code){
        case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
        case 'invalid_type': return {message: ErrorsMessage.invalid_type};
        default: return {message: ErrorsMessage.default};
      }
    }
  });

  if(!address.success){
    return res.status(400).send({error: address.error.issues});
  }
  next();
}

export const PutUserValidation = (req: Request, res: Response, next: NextFunction) => {

  const user = z.object({
    full_name: z.string().trim().regex(regex.fullName, ErrorsMessage.invalid_string.default).nullish(),
    phone: z.string().trim().min(11, {message: ErrorsMessage.invalid_length.phone}).regex(regex.phone).nullish(),
    birth: z.date().nullish(),
    email: z.string().trim().regex(regex.email, ErrorsMessage.invalid_string.default).nullish()
  }).safeParse({...req.body}, {
    errorMap: (issue, _ctx) => {
      if(issue.message){return {message: issue.message}};
      switch(issue.code){
        case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
        case 'invalid_type': return {message: ErrorsMessage.invalid_type};
        default: return {message: ErrorsMessage.default};
      }
    }
  });

  if(!user.success){
    return res.status(400).send({error: user.error.issues});
  }
  next();
}

export const PutUserAuthValidation = (req: Request, res: Response, next: NextFunction) => {

  const user = z.object({
    oldPassword: z.string().trim().regex(regex.password, {message: ErrorsMessage.invalid_string.password}),
    newPassword: z.string().trim().regex(regex.password, {message: ErrorsMessage.invalid_string.password})
  }).safeParse({...req.body}, {
    errorMap: (issue, _ctx) => {
      if(issue.message){return {message: issue.message}};
      switch(issue.code){
        case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
        case 'invalid_type': return {message: ErrorsMessage.invalid_type};
        default: return {message: ErrorsMessage.default};
      }
    }
  });

  if(!user.success){
    return res.status(400).send({error: user.error.issues});
  }
  next();
}

export const PutUserPassValidation = (req: Request, res: Response, next: NextFunction) => {

  const pass = z.object({
    new_transaction_password: 
    z.string().trim().regex(regex.transactionPassword, {message: ErrorsMessage.invalid_string.transaction_password}),
    old_transaction_password: 
    z.string().trim().regex(regex.transactionPassword, {message: ErrorsMessage.invalid_string.transaction_password})
  }).safeParse({...req.body}, {
    errorMap: (issue, _ctx) => {
      if(issue.message){return {message: issue.message}};
      switch(issue.code){
        case 'invalid_string': return {message: ErrorsMessage.invalid_string.default};
        case 'invalid_type': return {message: ErrorsMessage.invalid_type};
        default: return {message: ErrorsMessage.default};
      }
    }
  });

  if(!pass.success){
    return res.status(400).send({error: pass.error.issues});
  }
  next();
}

export const createSuportValidation = (req: Request, res:Response, next: NextFunction) => {
  const SuportIn = z.object({
    name: z.string().trim().regex(regex.fullName, ErrorsMessage.invalid_string.default),
    email: z.string().trim().regex(regex.email, ErrorsMessage.invalid_string.default),
    role: z.string().trim(),
    suport_auth: z.object({
      cpf: 
        z.string().min(11, ErrorsMessage.invalid_length.cpf).transform((value) => value.replace(regex.replace ,''))
         .refine((value) => cpfValidator(value), {message: ErrorsMessage.custom.invalidCPF}),
      password: z.string().trim().regex(regex.password, {message: ErrorsMessage.invalid_string.password})
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
  
  if(!SuportIn.success){
    return res.status(400).send({error: SuportIn.error.issues});
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