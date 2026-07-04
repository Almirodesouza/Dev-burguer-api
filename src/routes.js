import { Router } from 'express';
import userController from './app/controllers/userController.js';
import loginController from './app/controllers/loginController.js';
import productsController from './app/controllers/productsController.js';
import categoriesController from './app/controllers/categoriesController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';
import authmiddleware from './middlewares/auth.js';

const routes = new Router();

const uploud = multer(multerConfig);

routes.post('/users', userController.store);
routes.post('/login', loginController.store);

routes.use(authmiddleware);
routes.post('/products', uploud.single('file'),productsController.store);
routes.get('/products/', productsController.index);

routes.post('/categories', categoriesController.store);
routes.get('/categories', categoriesController.index);

export default routes;