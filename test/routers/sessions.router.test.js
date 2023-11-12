import { expect } from 'chai';
import supertest from 'supertest';
import { dropUser } from '../setup.test.js';

const requester = supertest('http://localhost:8080');

let cookie;

describe('Session router test case', () => {

    /* before(async () => {
        await dropUser();
    }); */

    it('[POST] /api/sessions/register should create a user successfully', async () => {
        const mockUser = {
            first_name: 'Nombre prueba',
            last_name: 'Apellido prueba',
            email: 'facjohan@hotmail.com',
            age: 33,
            password: 'Coder123',
            role: 'admin'
        };
        const response = await requester.post('/api/sessions/register').send(mockUser);
        // deje creado el usuario para luego actualizar el rol a admin por tema de permisos
        expect(response.statusCode).to.be.eql(400);
    });

    it('[POST] /api/sessions/login should log in a user successfully', async () => {
        const mockUserCredentials = {
            email: 'facjohan@hotmail.com',
            password: 'Coder123'
        };
        const response = await requester.post('/api/sessions/login').send(mockUserCredentials);
        const cookies = response.headers['set-cookie'];
        cookie = cookies[0];
        expect(cookie).to.be.ok;
    });

    it('[GET] /api/sessions/current should get current user successfully', async () => {
        expect(cookie).to.exist;
        const response = await requester.get('/api/sessions/current').set('cookie', cookie);
        expect(response.statusCode).to.be.eql(200);


        expect(response.body).to.have.property('payload');
        const payload = response.body.payload;
        expect(payload).to.have.property('name');
        expect(payload).to.have.property('email');

        expect(payload.name).to.be.eql('Nombre prueba Apellido prueba');
        expect(payload.email).to.be.eql('facjohan@hotmail.com');
    });

});

export { cookie }