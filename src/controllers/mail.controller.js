import { ProductRepository } from '../daos/repositories/product.repository.js';
import { transpor } from '../config/Email/transportEmail.js';
import { STATUS } from '../utils/constantes.js'
import { logRequestError, logRequestInfo, logRequestDebug, handleRequestError, createResponse } from '../utils/winston/logger.js';

class MailController {

    async sendEmail(req, res) {
        try {
            const mailParams = {
                from: "facjohan@gmail.com",
                to: "facjohan@hotmail.com",
                subject: "Prueba de envio de correo electronico",
                html: `<div> <h1>Cuerpo del correo electronico</h1>
        </div>`,
                /* attachments: [{
                    filename: 'perrito.jpg',

                    path: process.cwd() + '/public/perrito.jpg',
                    cid: 'perrito'
                }] */

            };
            const result = await transpor.sendMail(mailParams)
            logRequestInfo(req)
            createResponse(res, 200, { message: "Mail enviado" })
        } catch (error) {
            logRequestError(req, error)
            logRequestDebug(req, error)
            handleRequestError(res, 500, error);
        }
    }
}

export default new MailController();
