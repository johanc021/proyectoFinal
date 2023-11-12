import { CartRepository } from '../daos/repositories/cart.repository.js';
import { STATUS } from '../utils/constantes.js'
import ticketModel from '../daos/schema/tickets.schema.js';
import { generateTicketCode } from '../utils.js';
import { ProductRepository } from '../daos/repositories/product.repository.js';
import { createResponse, handleRequestError, logRequestError, logRequestInfo } from '../utils/winston/logger.js';
import MailingService from '../services/mailing.js';

const cartRepository = new CartRepository()
const productRepository = new ProductRepository();

class CartController {
    constructor() {
        this.getAllCarts = this.getAllCarts.bind(this);
        this.getCart = this.getCart.bind(this);
        this.deleteProductFromCart = this.deleteProductFromCart.bind(this);
        this.saveProductToCart = this.saveProductToCart.bind(this);
        this.updateCart = this.updateCart.bind(this);
        this.updateProductQuantity = this.updateProductQuantity.bind(this);
        this.deleteAllProductsFromCart = this.deleteAllProductsFromCart.bind(this);
        this.purchaseCart = this.purchaseCart.bind(this);
    }

    async getAllCarts(req, res) {
        try {
            const carts = await cartRepository.getAllCarts();
            if (!carts) return handleRequestError(res, 404, { message: "Error al encontrar carritos" });

            if (carts.length === 0) return handleRequestError(res, 200, { message: "No hay carritos creados" });
            logRequestInfo(req)
            createResponse(res, 200, { carts })
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
        }
    }

    async getCart(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await cartRepository.getCart(cartId);
            if (!cart) {
                return handleRequestError(res, 404, { message: "No se pueden encontrar el carrito" });
            }
            logRequestInfo(req)
            createResponse(res, 200, { cart })
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cartId, productId } = req.params;
            if (!cartId || !productId) {
                return handleRequestError(res, 400, { message: "Datos incorrectos" });
            }
            const updatedCart = await cartRepository.deleteProductFromCart(cartId, productId);
            logRequestInfo(req)
            createResponse(res, 200, { cart: updatedCart })
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
        }
    }

    async saveProductToCart(req, res) {
        try {
            const { idProduct, idCart, quantity } = req.body;
            const email = req.user.email

            if (!idProduct || !quantity) {
                return handleRequestError(res, 400, { message: "Los datos no son correctos" });
            }

            // Comprueba si se proporciona idCart y si el carrito existe
            let cart;
            if (idCart) {
                const cartExists = await cartRepository.getCart(idCart);
                if (!cartExists) {
                    return handleRequestError(res, 404, { message: "El carrito no existe" });
                }

                // Verifica si el producto ya está en el carrito
                const existingProduct = cartExists.products.find(productItem => productItem.product._id.toString() === idProduct);
                if (existingProduct) {
                    //Id del producto en el carrito
                    idProductInCart = existingProduct._id.toString()
                    // El producto ya está en el carrito, suma la cantidad
                    const newQuantity = existingProduct.quantity += quantity;
                    /* console.log(newQuantity) */
                    await cartRepository.updateProductQuantity(idCart, idProductInCart, newQuantity)
                } else {
                    // Agrega el producto al carrito existente
                    cart = await cartRepository.saveProductToCart(idProduct, idCart, quantity, email);
                }

                // Actualiza el carrito después de realizar cambios
                if (!cart) {
                    cart = await cartRepository.getCart(idCart);
                }
            } else {
                // Continúa sin manipular el carrito
                cart = await cartRepository.saveProductToCart(idProduct, null, quantity, email);
            }

            const product = await productRepository.getProductById(idProduct);

            if (req.user.role === 'premium' && product.owner === req.user.email) {
                return handleRequestError(res, 403, { message: "No puede agregar productos suyos al carrito" });
            }

            logRequestInfo(req);
            createResponse(res, 200, { cart })
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
        }
    }

    async updateCart(req, res) {
        try {
            const { cartId } = req.params;
            const { products } = req.body;

            if (!cartId || !products) return handleRequestError(res, 400, { message: "Los datos no son correctos" });

            const updatedCart = await cartRepository.updateCart(cartId, products);
            logRequestInfo(req)
            createResponse(res, 200, { cart: updatedCart })
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cartId, productId } = req.params;
            const { quantity } = req.body;
            if (!cartId || !productId || !quantity) {
                return handleRequestError(res, 400, { message: "Datos incorrectos" });
            }
            const updatedCart = await cartRepository.updateProductQuantity(cartId, productId, quantity);
            logRequestInfo(req)
            createResponse(res, 200, { cart: updatedCart })
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const { cartId } = req.params;
            if (!cartId) {
                return handleRequestError(res, 400, { data: cartId, message: "Dato incorrecto" });
            }
            const cart = await cartRepository.deleteAllProductsFromCart(cartId);
            logRequestInfo(req)
            createResponse(res, 200, { cart })
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const { user } = req;
            if (!cid || !user) {
                return handleRequestError(res, 400, { data: { cid, user }, message: "Dato incorrecto" });
            }

            // Obtener el carrito y usuario autorizado
            const cart = await cartRepository.getCart(cid);

            if (!cart) {
                return handleRequestError(res, 404, { message: "El carrito no existe" });
            }

            // Inicializar arreglos para productos comprados y no comprados
            const productsNotPurchased = [];
            const productsPurchased = [];

            let totalAmount = 0; // Inicializar el monto total en 0

            for (const productItem of cart.products) {
                const { product, quantity } = productItem;
                const availableProduct = await productRepository.getProductById(product);

                if (availableProduct && availableProduct.stock >= quantity) {
                    // Restar la cantidad comprada del stock del producto
                    const newStock = availableProduct.stock - quantity;
                    await productRepository.updateProductStock(product, newStock);
                    // Calcular el precio total para este producto y agregarlo al monto total
                    totalAmount += availableProduct.price * quantity;
                    productsPurchased.push(productItem); // Agregar al arreglo de productos comprados
                } else {
                    productsNotPurchased.push(productItem);
                }
            }

            // Crear el ticket con los productos comprados y el monto total
            const ticket = await ticketModel.create({
                code: generateTicketCode(),
                purchase_datetime: new Date(),
                amount: Number(totalAmount),
                purchaser: user.email,
                products: productsPurchased
            });

            for (const productItem of productsPurchased) {
                const { product } = productItem;
                const productId = product._id.toString();
                await cartRepository.deleteProductFromCart(cid, productId);
            }

            if (productsNotPurchased.length === 0) {
                // Si no quedan productos en el carrito, elimina el carrito
                await cartRepository.deleteCart(cid, user);
            }

            const mailer = new MailingService()
            await mailer.sendShopingProductsMail({
                to: user.email,
                products: { productsPurchased, totalAmount }
            })

            console.log("Productos no comprados " + productsNotPurchased);
            logRequestInfo(req);
            createResponse(res, 200, { products: productsPurchased })
        } catch (error) {
            logRequestError(req, error);
            handleRequestError(res, 500, error);
        }
    }

}

export default new CartController();
