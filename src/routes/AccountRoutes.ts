import { Router } from 'express';
import { authentication } from 'middlewares/auth';
import AccountController from 'controllers/AccountController';
import { FiltersValidation, TransferValidation } from 'middlewares/validators';
const accountController = new AccountController();

const routes = Router();

routes.post('/transfer/', authentication, TransferValidation, accountController.createTransfer);
routes.get('/balance/:accountId', authentication, accountController.getBalance);
routes.get('/transfer/', authentication, accountController.getDetailedTransfer);
routes.get('/transfer/extrato/', authentication, FiltersValidation, accountController.getExtrato);

export default routes;