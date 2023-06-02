import { Router } from 'express';
import { authentication, suportAuthentication } from 'middlewares/auth';
import SuportController from 'controllers/SuportController';
import { FiltersValidation, PutUserAuthValidation, createSuportValidation } from 'middlewares/validators';

const suportController = new SuportController();

const routes = Router();

routes.post("/", suportAuthentication, createSuportValidation, suportController.create);
routes.post('/login', suportController.login);
routes.post("/ticket/message/", suportAuthentication, suportController.sendMessage);

routes.get('/', suportAuthentication, suportController.get);
routes.get("/user",  suportAuthentication, suportController.getUser);
routes.get('/user/account/transfers', suportAuthentication, FiltersValidation, suportController.getExtrato);
routes.get('/ticket/messages/', suportAuthentication, suportController.getMessages);
routes.get('/tickets/', suportAuthentication, suportController.getTickets);
routes.get('/suports', suportAuthentication, suportController.getSuports)

routes.put('/ticket/status', suportAuthentication, suportController.putTicketStatus);
routes.put('/auth', suportAuthentication, PutUserAuthValidation, suportController.putPassword)

export default routes;