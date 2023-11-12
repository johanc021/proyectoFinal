import { Router } from 'express';
import viewsController from '../../controllers/views.controller.js';
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';
import { policyRoles } from '../../config/middlewareAuth/authRole/forRole.js';

class ViewsRouter {
    constructor() {
        this.router = Router();
        this.router.get('/', viewsController.getHome)
        this.router.get('/register', viewsController.getRegister);
        this.router.get('/login', viewsController.getLogin);
        this.router.get('/userRole', authenticate, policyRoles(['admin']), viewsController.changeUserRole);
        this.router.get('/resetPassword', viewsController.getResetPasswordMail);
        this.router.get('/profile', authenticate, viewsController.getProfile);
        this.router.get('/products', authenticate, viewsController.getProducts);
        this.router.get('/carts', authenticate, viewsController.getCartsWithTotal);
        this.router.get('/chat', authenticate, viewsController.getChat);
        this.router.get('/carts/:cid', authenticate, viewsController.getCartById);
        this.router.get('/mockingproducts', authenticate, viewsController.createMokingProducts)
    }

    getRouter() {
        return this.router;
    }
}

export default ViewsRouter;
