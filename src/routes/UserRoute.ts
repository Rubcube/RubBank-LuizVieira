import { Router } from 'express';
import UserController from 'controllers/UserController';
import { OnboardingValidation } from 'middlewares/validators';
import { authentication } from 'middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/login', userController.login);
routes.post('/', OnboardingValidation, userController.create);
routes.get('/', authentication, userController.getByToken);
routes.get('/accounts', authentication, userController.getAccounts);


export default routes;