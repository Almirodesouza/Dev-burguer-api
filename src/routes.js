import { Router } from 'express';
import multer from 'multer';
import categoriesController from './app/controllers/categoriesController.js';
import loginController from './app/controllers/loginController.js';
import orderController from './app/controllers/orderController.js';
import productsController from './app/controllers/productsController.js';
import userController from './app/controllers/userController.js';
import adminMiddleware from './app/middlewares/admin.js';
import authMiddleware from './app/middlewares/auth.js';
import multerConfig from './config/multer.cjs';

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
routes.get('/products', productsController.index);

routes.post(
  '/categories',
  uploud.single('file'),
  adminMiddleware,
  categoriesController.store,
);

routes.put(
  '/categories/:id',
  uploud.single('file'),
  adminMiddleware,
  categoriesController.update,
);

routes.get('/categories', categoriesController.index);

routes.post('/orders', orderController.store);
routes.get('/orders', orderController.index);
routes.put('/orders/:id', adminMiddleware, orderController.update);

export default routes;
