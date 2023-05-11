import { Router } from 'express';
import UserController from 'controllers/UserController';
import { OnboardingValidation } from 'middlewares/validators';
import { authentication } from 'middlewares/auth';

const routes = Router();
const userController = new UserController();

routes.post('/', OnboardingValidation, userController.create);
routes.post('/login', userController.login);

routes.get('/', authentication, userController.getAll);
/*routes.get('/:id', userController.get);
routes.put('/:id', userController.update);
routes.delete('/:id', userController.delete);*/

export default routes;