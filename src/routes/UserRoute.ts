import { Router } from 'express';
import UserController from 'controllers/UserController';
import { OnboardingValidation, PutAddressValidation, PutUserAuthValidation, PutUserValidation } from 'middlewares/validators';
import { authentication } from 'middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/login', userController.login);
routes.post('/', OnboardingValidation, userController.create);

routes.get('/', authentication, userController.getByToken);
routes.get('/accounts', authentication, userController.getAccounts);

routes.put('/address/:id', authentication, PutAddressValidation,userController.updateAddress);
routes.put('/', authentication, PutUserValidation, userController.updateInfo);
routes.put('/auth', authentication, PutUserAuthValidation, userController.updateAuth);

export default routes;