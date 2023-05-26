import { Router } from 'express';
import { authentication } from 'middlewares/auth';
import AccountController from 'controllers/AccountController';
import { FiltersValidation, GetAccountParamsValidation, PutUserPassValidation, TransferValidation } from 'middlewares/validators';
const accountController = new AccountController();

const routes = Router();

routes.post('/transfer/', authentication, TransferValidation, accountController.createTransfer);

routes.get('/balance/:accountId', authentication, accountController.getBalance);
routes.get('/transfer/', authentication, accountController.getDetailedTransfer);
routes.get('/transfer/extrato/', authentication, FiltersValidation, accountController.getExtrato);
routes.get('/', authentication, GetAccountParamsValidation, accountController.getAccount);

routes.put('/:id', authentication, PutUserPassValidation, accountController.updatePassword);


export default routes;