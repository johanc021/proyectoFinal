import { expect } from 'chai';
import supertest from 'supertest';
import { dropProducts } from '../setup.test.js';
import { cookie } from './sessions.router.test.js';

const requester = supertest('http://localhost:8080');

//producto que se consultara, actualizara y eliminara
const product = '6522e7c29440da5fa4ce3380'

describe('Product Routes', () => {

    /* before(async () => {
        await dropProducts();
    }); */

    it('[GET] /api/product should get all products', async () => {
        const response = await requester.get('/api/product')
            .set('cookie', [`${cookie}`]);
        expect(response.status).to.equal(200);
    });

    it('[POST] /api/product should create a product', async () => {
        const productData = {
            title: 'Producto de prueba',
            description: 'Descripción de prueba',
            code: 'P001',
            price: 100,
            status: true,
            stock: 10,
            category: 'Prueba',
            thumbnail: 'imagen.jpg',
            owner: 'admin'
        };
        const response = await requester.post('/api/product')
            .set('cookie', [`${cookie}`])
            .send(productData);
        expect(response.status).to.equal(200);
    });

    it('[GET] /api/product/:id should get a product by ID', async () => {

        const response = await requester.get(`/api/product/${product}`)
            .set('cookie', [`${cookie}`]);

        expect(response.status).to.equal(200);
    });

    it('[PUT] /api/product/:id should update a product', async () => {
        const updatedProductData = {
            title: 'Producto Actualizado',
            description: 'Descripción actualizada',
            price: 150,
            stock: 20
        };

        const response = await requester.put(`/api/product/${product}`)
            .set('cookie', [`${cookie}`])
            .send(updatedProductData);

        expect(response.status).to.equal(200);
    });


    it('[DELETE] /api/product/:id should delete a product', async () => {

        const response = await requester.delete(`/api/product/${product}`)
            .set('cookie', [`${cookie}`]);

        expect(response.status).to.equal(200);
    });


});
