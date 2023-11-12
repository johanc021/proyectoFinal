import MailingService from '../../services/mailing.js';
import { MongoManager } from '../db/mongo.manager.js'
import userModel from '../schema/users.schema.js';

export class UsersMongoDAO {
    constructor() {
        MongoManager.start()
    }

    getAll = async () => {
        try {
            let users = await userModel.find().select('_id first_name email role').lean();
            return users
        } catch (error) {
            throw new Error('Error al obtener la lista de usuarios');
        }
    }

    saveUser = async (user) => {
        // Verificar si el email ya existe en la base de datos
        const existingUser = await userModel.findOne({ email: user.email });

        if (existingUser) {
            throw new Error('El email ya existe en la base de datos');
        }

        // Si el email no existe, guardar el usuario en la base de datos
        let result = await userModel.create(user);
        return result;
    }

    getUserById = async (param) => {
        try {
            let result = await userModel.findById(param);
            return result;
        } catch (error) {
            throw new Error('Error al obtener el usuario por ID');
        }
    }

    updateUser = async (id, user) => {
        try {
            delete user._id;
            let result = await userModel.updateOne({ _id: id }, { $set: user });
            return result;
        } catch (error) {
            throw new Error('Error al actualizar el usuario');
        }
    }
    /* getIdUserByEmail = async (email) => {
        try {
            let result = await userModel.findOne({ email: email }).select('_id');
            return result;
        } catch (error) {
            throw new Error('Error al obtener el id del usuario por Email');
        }
    } */

    getUserByEmail = async (email) => {
        try {
            let result = await userModel.findOne({ email: email }).select('_id email')
            return result
        } catch (error) {
            throw new Error('Error al obtener el usuario por Email');
        }
    }

    removeUser = async (userId) => {
        try {
            const result = await userModel.findByIdAndRemove(userId);
            if (!result) {
                throw new Error('El usuario no existe');
            }
            return userId;
        } catch (error) {
            throw new Error('Error al eliminar el usuario');
        }
    }

    cleanInactiveUsers = async () => {
        try {
            const twoDaysAgo = new Date();
            //Resta 2 días de la fecha actual
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            // Encuentra los usuarios que no hayan iniciado sesión durante los últimos 2 días
            const inactiveUsers = await userModel.find({ last_connection: { $lt: twoDaysAgo } });

            if (inactiveUsers.length > 0) {

                // Enviar un correo electrónico a cada usuario inactiva.
                for (const user of inactiveUsers) {

                    const mailer = new MailingService()
                    await mailer.sendUserDeleteMail({
                        to: user.email
                    })
                    // Eliminar los usuarios inactiva
                    await userModel.findByIdAndRemove(user._id);
                }
            } else {
                throw new Error('No se encontraron usuarios inactivas para eliminar.');
            }
        } catch (error) {
            throw new Error('Error al limpiar usuarios inactivos.');
        }
    };
}
