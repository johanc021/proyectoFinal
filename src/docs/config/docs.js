import swaggerjsdoc from 'swagger-jsdoc'
import __dirname from '../../utils.js'

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: 'Documentación de las APIs',
            description: 'Información de las End Points del proyecto ecommerce',
            version: '1.0.1',
            contact: {
                name: 'Johan Castellanos',
                url: 'https://www.linkedin.com/in/johanmcc'
            }
        }
    },
    // buenas practicas
    apis: [`${__dirname}/docs/**/*.yaml`],
    //apis: [`${process.cwd()}/src/docs/*.yaml`],

    // no tan buenas
    //apis: [`./docs/**/*.yaml`],
    /* apis: ['../carts/*.yaml', '../products/*.yaml'] */
}

export const spec = swaggerjsdoc(swaggerOptions)