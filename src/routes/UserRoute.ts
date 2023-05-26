import { Router } from 'express';
import UserController from 'controllers/UserController';
import { OnboardingValidation, PutAddressValidation, PutUserAuthValidation, PutUserValidation } from 'middlewares/validators';
import { authentication } from 'middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/', OnboardingValidation, userController.create);
routes.post('/login', userController.login);
routes.post('/ticket', authentication, userController.createTicket);
routes.post('/ticket/message/', authentication, userController.sendMessage)

routes.get('/', authentication, userController.getByToken);
routes.get('/accounts', authentication, userController.getAccounts);
routes.get('/tickets', authentication, userController.getTickets);
routes.get('/ticket/messages', authentication, userController.getMessages)

routes.put('/', authentication, PutUserValidation, userController.updateInfo);
routes.put('/address/:id', authentication, PutAddressValidation,userController.updateAddress);
routes.put('/auth', authentication, PutUserAuthValidation, userController.updateAuth);

export default routes;