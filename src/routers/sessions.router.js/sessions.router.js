import { Router } from "express";
import SessionsController from '../../controllers/session.controller.js';
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';

class SessionsRouter {
    constructor() {
        this.router = Router();
        this.configureRoutes();
    }

    configureRoutes() {
        this.router.post("/register", SessionsController.register);
        this.router.post("/login", SessionsController.login);
        this.router.post("/sendEmailResetPassword", SessionsController.sendEmailToken);
        this.router.get("/verify-token", SessionsController.verifyToken);
        this.router.post("/resetPassword", SessionsController.resetPassword);
        this.router.post("/logout", authenticate, SessionsController.logout);
        this.router.get("/current", authenticate, SessionsController.current);
    }

    getRouter() {
        return this.router;
    }
}

export default SessionsRouter;
