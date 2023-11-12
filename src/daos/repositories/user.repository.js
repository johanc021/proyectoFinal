import getDAOS from "../daos.factory.js";
import { SaveUserDTO } from '../dto/users.dto.js'

const { usersDAO } = getDAOS();

export class UserRepository {
    constructor() {
        this.dao = usersDAO;
    }

    async getAllUsers() {
        try {
            return await this.dao.getAll()
        } catch (error) {
            throw new Error(error)
        }
    }

    async createUser(payload) {
        try {
            const userPayload = new SaveUserDTO(payload)
            return await this.dao.saveUser(userPayload)
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserById(userId) {
        try {
            return await this.dao.getUserById(userId)
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateUser(userId, updatedUserData) {
        try {
            const result = await this.dao.updateUser(userId, updatedUserData);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getIdUserByEmail(email) {
        try {
            const result = await this.dao.getIdUserByEmail(email)
            return result
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserByEmail(email) {

        try {
            const result = await this.dao.getUserByEmail(email)
            return result
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createDocument(userId, documentData) {
        try {
            // Obtén el usuario por su ID
            const user = await this.dao.getUserById(userId);

            if (!user) {
                throw new Error("Usuario no encontrado");
            }

            // Agrega el documento al array de documentos del usuario
            user.documents.push(documentData);

            // Guarda los cambios en la base de datos
            await user.save();

            // Retorna el usuario actualizado si es necesario
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async deleteUser(userId) {
        try {
            const result = await this.dao.removeUser(userId);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async cleanInactiveUsers() {
        try {
            const result = await this.dao.cleanInactiveUsers();
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

}