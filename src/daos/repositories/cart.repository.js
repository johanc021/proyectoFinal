import getDAOS from "../daos.factory.js";

const { cartsDAO, usersDAO } = getDAOS();

export class CartRepository {
    constructor() {
        this.cartDAO = cartsDAO;
    }

    async getAllCarts() {
        try {
            const carts = await this.cartDAO.getAll();
            return carts;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCart(cartId) {
        try {
            const cart = await this.cartDAO.getCart(cartId);
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const updatedCart = await this.cartDAO.deleteProductByIdFromCart(cartId, productId);
            return updatedCart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async saveProductToCart(idProduct, idCart, quantity, email) {
        try {
            const cart = await this.cartDAO.saveCart(idProduct, idCart, quantity, email);
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateCart(cartId, products) {
        try {
            const updatedCart = await this.cartDAO.updateCartById(cartId, products);
            return updatedCart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const updatedCart = await this.cartDAO.updateProductQuantity(cartId, productId, quantity);
            return updatedCart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCart(cartId, user) {
        const result = await this.cartDAO.deleteCart(cartId, user);
        return result;
    };

    async deleteAllProductsFromCart(cartId) {
        try {
            const cart = await this.cartDAO.deleteAllProductsFromCart(cartId);
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}