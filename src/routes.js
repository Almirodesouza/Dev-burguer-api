import { Router } from 'express';
import userController from './app/controllers/userController.js';
import loginController from './app/controllers/loginController.js';
import productsController from './app/controllers/productsController.js';
import categoriesController from './app/controllers/categoriesController.js';
import multer from 'multer';
import multerConfig from './config/multer.cjs';
import authMiddleware from './middlewares/auth.js';
import adminMiddleware from './middlewares/admin.js';

const routes = new Router();

const uploud = multer(multerConfig);

routes.post('/users', userController.store);
routes.post('/login', loginController.store);

routes.use(authMiddleware);
routes.post(
  '/products',
  adminMiddleware,
  uploud.single('file'),
  productsController.store,
);
routes.put(
  '/products/:id',
  adminMiddleware,
  uploud.single('file'),
  productsController.update,
);
routes.get('/products/', productsController.index);

routes.post(
  '/categories',
  uploud.single('file'),
  adminMiddleware,
  categoriesController.store,
);
routes.get('/categories', categoriesController.index);

export default routes;
