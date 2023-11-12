import { Router } from 'express'
import userController from '../../controllers/user.controller.js'
import { authenticate } from '../../config/middlewareAuth/authAuthenticate/authenticate.js';
import { policyRoles } from '../../config/middlewareAuth/authRole/forRole.js';
import uploader from '../../services/uploader.js';

class userRouter {
    constructor() {
        this.inicioUser = Router();
        this.inicioUser.get('/', authenticate, userController.getAllUsers)
        this.inicioUser.get('/byEmail/:email', authenticate, userController.getUserByEmail)
        this.inicioUser.get('/:uid', authenticate, userController.getUserById)
        this.inicioUser.post('/', authenticate, userController.createUser)
        this.inicioUser.put('/:uid', authenticate, userController.updateUser)
        this.inicioUser.post('/premium/:uid', authenticate, policyRoles(['admin']), userController.changeRole)
        this.inicioUser.delete('/clean', authenticate, policyRoles(['admin']), userController.cleanInactiveUsers)
        this.inicioUser.delete('/:uid', authenticate, userController.deleteUser)
        this.inicioUser.post('/:uid/documents', authenticate, uploader.fields([
            { name: 'imageProfile', maxCount: 1 },
            { name: 'imageProduct', maxCount: 1 },
            { name: 'document', maxCount: 1 },
        ]), userController.uploadDocuments);

        //this.getRouter = this.getRouter.bind(this)
    }

    getRouter() {
        return this.inicioUser
    }
}

export default userRouter

