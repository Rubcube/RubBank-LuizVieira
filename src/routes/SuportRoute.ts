import { Router } from 'express';
import { authAdmToken } from 'middlewares/admAuth';
import { authentication, suportAuthentication } from 'middlewares/auth';
import SuportController from 'controllers/SuportController';
import { createSuportValidation } from 'middlewares/validators';

const suportController = new SuportController();

const routes = Router();

routes.post("/", authAdmToken, createSuportValidation, suportController.create);
routes.post('/login', suportController.login);
routes.post("/ticket/message/", suportAuthentication, suportController.sendMessage);

routes.get('/', suportAuthentication, suportController.get);
routes.get("/user",  suportAuthentication, suportController.getUser);
routes.get('/user/account/transfers', suportAuthentication, suportController.)
routes.get('/ticket/messages/', suportAuthentication, suportController.getMessages);
routes.get('/tickets/', suportAuthentication, suportController.getTickets);

routes.put('/ticket/status', suportAuthentication, suportController.putTicketStatus);

export default routes;