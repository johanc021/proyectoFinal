import { expect } from 'chai';
import supertest from 'supertest';
import { cookie } from './sessions.router.test.js';

const requester = supertest('http://localhost:8080');

//id del carrito a consultar
const cartId = "65240fecbe28a707f53c95ba"

//id del producto a eliminar
const productId = "6522e7c29440da5fa4ce32ee"

describe('Cart Routes', () => {

    it('[GET] /api/cart should get all carts', async () => {
        const response = await requester.get('/api/cart')
            .set('cookie', [`${cookie}`]);
        expect(response.status).to.equal(200);
    });

    it('[GET] /api/cart/:cartId should get a cart by ID', async () => {
        const response = await requester.get(`/api/cart/${cartId}`)
            .set('cookie', [`${cookie}`]);
        expect(response.status).to.equal(200);
    });

    it('[POST] /api/cart should create a product in cart', async () => {
        const productToCart = {
            idCart: "65240fecbe28a707f53c95ba",
            idProduct: "6522e7c29440da5fa4ce32ee",
            quantity: 20
        };

        const response = await requester.post('/api/cart')
            .set('cookie', `${cookie}`)
            .send(productToCart);

        expect(response.status).to.equal(201);
    });

    it('[PUT] /api/cart/:cid should update products in the cart', async () => {
        const cartId = "652412cb76956a449323b123";
        const productData = [
            { product: "6522e7c29440da5fa4ce32e5", quantity: 19 },
            { product: "6522e7c29440da5fa4ce32e7", quantity: 25 }
        ];

        const requestBody = {
            products: productData
        };

        const response = await requester.put(`/api/cart/${cartId}`)
            .set('cookie', `${cookie}`)
            .send(requestBody);

        expect(response.status).to.equal(200);
    });

    it('[PUT] /api/cart/:cartId/products/:productId should update product quantity in the cart', async () => {
        const cartId = "652412cb76956a449323b123";
        const productId = "6522e7c29440da5fa4ce32f0";
        const newQuantity = 155;

        const requestBody = {
            quantity: newQuantity
        };

        const response = await requester.put(`/api/cart/${cartId}/products/${productId}`)
            .set('cookie', `${cookie}`)
            .send(requestBody);

        expect(response.status).to.equal(200);
    });


    it('[DELETE] /api/cart/:cartId/products/:productId should delete a product to cart', async () => {

        const response = await requester.delete(`/api/cart/${cartId}/products/${productId}`)
            .set('cookie', [`${cookie}`]);

        expect(response.status).to.equal(200);
    })

    it('[DELETE] /api/cart/:cid should delete all products from the cart', async () => {
        const cartId = "65240fecbe28a707f53c95ba";

        const response = await requester.delete(`/api/cart/${cartId}`)
            .set('cookie', `${cookie}`);

        expect(response.status).to.equal(200);
    });

    it('[POST] /api/cart/:cid/purchase should process a purchase for the cart', async () => {
        const cartId = "652412cb76956a449323b123";

        const response = await requester.post(`/api/cart/${cartId}/purchase`)
            .set('cookie', `${cookie}`);

        expect(response.status).to.equal(200);
    });

})