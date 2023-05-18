import { Router } from 'express';
import { authentication } from 'middlewares/auth';
import AccountController from 'controllers/AccountController';
const accountController = new AccountController();

const routes = Router();

routes.get('/:accountId/balance/', authentication, accountController.getBalance);
routes.post('/transfer', authentication, accountController.createTransfer);

export default routes;