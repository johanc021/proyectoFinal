import mailer from 'nodemailer'
import config from '../config/config.js'

/* console.log(config.mailing.PASSWORD)
console.log(config.mailing.SERVICE)
console.log(config.mailing.USER) */

export default class MailingService {

    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.SERVICE,
            port: 587,
            auth: {
                user: config.mailing.USER,
                pass: config.mailing.PASSWORD
            }
        })
    }

    sendResetPasswordMail = async ({ resetToken, to }) => {
        /*  console.log(to) */
        /* console.log(resetToken) */
        const resetUrl = `${config.app.APP_URL}:${config.mongo.PORT}/api/sessions/verify-token?token=${resetToken}`;
        const html = `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">Haga Clic para recuperar su contraseña</a>`;

        const result = await this.client.sendMail({
            from: config.mailing.USER,
            to: to,
            subject: 'Restablecimiento de contraseña',
            html,
        });

        return result;
    }


    sendUserDeleteMail = async ({ to }) => {

        const html = `<p>Su cuenta de usuario ha sido eliminada por inactividad en el sistema.</p>`;

        const result = await this.client.sendMail({
            from: config.mailing.USER,
            to: to,
            subject: 'Usuario eliminado por inactividad',
            html,
        });

        return result;
    }

    sendShopingProductsMail = async ({ to, products }) => {
        const { productsPurchased, totalAmount } = products;

        // Crear un HTML para mostrar los productos y el total
        const productsList = productsPurchased.map(productItem => {
            const { product, quantity } = productItem;
            return `<p>${product.title} - Cantidad: ${quantity}</p>`;
        });

        const html = `
        <p>Gracias por tu compra. Detalles de tu compra:</p>
        ${productsList.join('')}
        <p>Total de la compra: ${totalAmount}</p>
    `;

        const result = await this.client.sendMail({
            from: config.mailing.USER,
            to: to,
            subject: 'Detalles de tu compra',
            html,
        });

        return result;
    }


    /* sendShopingProductsMail = async ({ to, products }) => {

        const html = `<p>Su cuenta de usuario ha sido eliminada por inactividad en el sistema.</p>`;

        const result = await this.client.sendMail({
            from: config.mailing.USER,
            to: to,
            subject: 'Productos comprados',
            html,
        });

        return result;
    } */
}