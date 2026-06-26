import { Router } from 'express';
import userController from './app/controllers/userController.js';
import loginController from './app/controllers/loginController.js';
import productsController from './app/controllers/productsController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';

const routes = new Router();

const uploud = multer(multerConfig);

routes.post('/users', userController.store);
routes.post('/login', loginController.store);
routes.post('/products', uploud.single('file'),productsController.store);
routes.get('/products/', productsController.index);

export default routes;