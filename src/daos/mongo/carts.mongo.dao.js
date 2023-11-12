import { cartModel } from "../schema/carts.schema.js";
import { productModel } from "../schema/products.schema.js";
import { MongoManager } from "../db/mongo.manager.js";
import userModel from "../schema/users.schema.js";

export class CartsMongoDAO {
    constructor() {
        MongoManager.start()
    }

    getAll = async () => {
        let carts = await cartModel.find().populate('products.product').lean();
        return carts;
    };

    getCart = async (cartId) => {
        const cart = await cartModel.findById(cartId).populate('products.product').lean();
        return cart;
    };

    getCartsUser = async (email) => {
        const cart = await userModel.findOne({ email: email }).select('cart').populate('cart').lean();
        return cart
    }

    getCartsWithTotal = async (email) => {
        const user = await userModel.findOne({ email: email }).populate({
            path: 'cart',
            populate: {
                path: 'products.product',
                model: 'products'
            }
        }).lean();

        const cartsWithTotals = user.cart.map(cart => {
            let total = 0;

            const productsWithTotals = cart.products.map(product => {
                const productTotal = product.product.price * product.quantity;
                total += productTotal;

                const productObj = {
                    product: {
                        ...product.product,
                        _id: product.product._id.toString(),
                        // aquí incluyes los campos relevantes del producto que quieres mostrar
                    },
                    quantity: product.quantity,
                    total: productTotal
                };

                return productObj;
            });

            return {
                ...cart,
                products: productsWithTotals,
                cartTotal: total
            };
        });

        return cartsWithTotals;
    }

    /* deleteProductByIdFromCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            // Encuentra el índice del producto en el carrito
            const productIndex = cart.products.findIndex(productItem => productItem.product._id.toString() === productId);

            if (productIndex === -1) {
                console.log('No se encontró el producto en el carrito.');
                return null;
            }

            // Elimina el producto del carrito utilizando el índice encontrado
            cart.products.splice(productIndex, 1);

            await cart.save();

            return cart;
        } catch (error) {
            console.log('Error al eliminar el producto del carrito:', error.message);
            return null;
        }
    }; */

    deleteProductByIdFromCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            const productIndex = cart.products.findIndex(productItem => productItem.product._id.toString() === productId);

            if (productIndex === -1) {
                console.log('No se encontró el producto en el carrito.');
                return null;
            }

            cart.products.splice(productIndex, 1);

            // Si el carrito queda vacío después de eliminar el producto, elimina el carrito
            if (cart.products.length === 0) {
                await cartModel.findByIdAndDelete(cartId);
                return null; // No hay carrito para devolver
            } else {
                await cart.save();
                return cart;
            }
        } catch (error) {
            console.log('Error al eliminar el producto del carrito:', error.message);
            return null;
        }
    };

    saveCart = async (idProduct, idCart, quantity, email) => {
        try {
            // Busca el producto por su ID
            const product = await productModel.findOne({ _id: idProduct });

            if (!product) {
                throw new Error('El producto no existe');
            }

            const user = await userModel.findOne({ email: email });

            if (!user) {
                throw new Error("Usuario no registrado");
            }

            // Crea un nuevo carrito o encuentra uno existente
            let cart;

            if (!idCart) {
                cart = await cartModel.create({ products: [{ product: idProduct, quantity }] });
            } else {
                cart = await cartModel.findById(idCart);

                if (!cart) {
                    throw new Error('El carrito no existe');
                }

                cart.products.push({ product: idProduct, quantity });
                await cart.save();
            }

            // Agrega el ID del carrito al campo 'cart' del usuario
            if (!user.cart.includes(cart._id)) {
                user.cart.push(cart._id);
                await user.save();
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    //actualizar productos de un carrito
    updateCartById = async (cartId, products) => {
        try {
            const cart = await cartModel.findById(cartId);

            console.log(cart)
            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            cart.products = products;

            await cart.save();

            return cart;
        } catch (error) {
            console.log('Error al actualizar el carrito:', error.message);
            return null;
        }
    };

    //Metodo para actualizar la cantidad de un producto en carrito
    updateProductQuantity = async (cartId, productId, quantity) => {

        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                console.log('No existe el carrito con el ID proporcionado.');
                return null;
            }

            const productIndex = cart.products.findIndex(product => product._id.toString() === productId);

            if (productIndex === -1) {
                console.log('No se encontró el producto en el carrito.');
                return null;
            }

            cart.products[productIndex].quantity = quantity;

            await cart.save();
            /* saveJSON(cart) */

            return cart;
        } catch (error) {
            console.log('Error al actualizar la cantidad de ejemplares:', error.message);
            return null;
        }
    };

    deleteCart = async (cartId, user) => {
        try {
            // Elimina el carrito del modelo Cart
            const deletedCart = await cartModel.findOneAndRemove({ _id: cartId });

            // Elimina la referencia al carrito en el modelo User
            await userModel.updateOne(
                { email: user.email },
                { $pull: { cart: cartId } } // Utiliza $pull para eliminar el elemento del array
            );

            if (deletedCart) {
                return { message: "Carrito eliminado correctamente" };
            } else {
                return { message: "El carrito no existe" };
            }
        } catch (error) {
            throw error;
        }
    }


    // Dejar carrito vacio
    deleteAllProductsFromCart = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                return null;
            }

            cart.products = [];
            await cart.save();

            return cart;
        } catch (error) {
            throw new Error('Error al eliminar los productos del carrito');
        }
    };
}