import { ViewRepository } from '../daos/repositories/view.repository.js';
import { generateProducts } from '../utils/mocksProducts.js';
import { handleRequestError, logRequestDebug } from '../utils/winston/logger.js';

const viewRepository = new ViewRepository()

class ViewsController {

    async getHome(req, res) {
        res.render('home')
    }
    async getRegister(req, res) {
        res.render('register');
    }

    async getLogin(req, res) {
        res.render('login');
    }

    async getResetPasswordMail(req, res) {
        res.render('resetPasswordMail');
    }

    async getProfile(req, res) {
        res.render('profile', { user: req.user });
    }

    async getProducts(req, res) {

        const { page = 1 } = req.query;
        const email = req.user.email;

        try {
            const carts = await viewRepository.getCartsUser(email)
            const result = await viewRepository.getAllProducts(page);
            if (!result) {
                logRequestDebug(req, { error: "No se obtuvieron los productos" });
                return handleRequestError(res, 404, { message: "error al encontrar productos" })
            }
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

            res.render('products', {
                products: docs,
                carts: carts.cart,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            });
        } catch (error) {
            handleRequestError(res, 500, error);
        }
    }

    async getCarts(req, res) {
        try {
            const carts = await viewRepository.getAllCarts();
            res.render('carts', { carts });
        } catch (error) {
            handleRequestError(res, 500, error);
        }
    }

    async getCartsWithTotal(req, res) {
        try {

            const email = req.user.email
            const carts = await viewRepository.getCartsWithTotal(email);
            res.render('carts', { carts });
        } catch (error) {
            handleRequestError(res, 500, error);
        }
    }

    async getChat(req, res) {
        try {
            const messages = await viewRepository.getAllmessages();
            res.render('chat', { messages });
        } catch (error) {
            handleRequestError(res, 500, error);
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await viewRepository.getCartById(cartId);
            res.render('cart', { cart });
        } catch (error) {
            handleRequestError(res, 404, error);
            /* res.status(404).json({ error: error.message }); */
        }
    }

    async changeUserRole(req, res) {
        try {
            const currentUseremail = req.user.email;
            const users = await viewRepository.getAllUsers();

            // Filtra la lista de usuarios para excluir al usuario actual
            const filteredUsers = users.filter(user => user.email !== currentUseremail);

            res.render('changeRole', { users: filteredUsers });
        } catch (error) {
            handleRequestError(res, 404, { error: error.message });
        }
    }

    async createMokingProducts(req, res) {
        try {
            const total = +req.query.total || 500
            const products = Array.from({ length: total }, () => generateProducts())
            await viewRepository.generateUsers(products)
            res.json({ success: true, payload: products })
        } catch (error) {
            throw new Error(error)
        }
    }


}

export default new ViewsController();
