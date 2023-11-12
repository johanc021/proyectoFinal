import express from 'express'
import socketServer from '../app.js';
import __dirname from '../utils.js';
import { ChatRepository } from '../daos/repositories/chat.repository.js';
import { createResponse, handleRequestError, logRequestError, logRequestInfo } from '../utils/winston/logger.js';

const chatRepository = new ChatRepository();

const app = express()

app.use(express.json());
app.use(express.static(__dirname + "/public"))

class ChatController {
    async getAllMessages(req, res) {
        try {
            const messages = await chatRepository.getAllMessages();
            if (!messages || messages.length === 0) {
                return handleRequestError(res, 404, { message: "No se encontraron mensajes" });
            }
            logRequestInfo(req)
            createResponse(res, 200, { payload: messages })
        } catch (error) {
            logRequestError(req, error)
            handleRequestError(res, 500, error);
        }
    }

    async saveMessage(req, res) {
        try {
            const { user, message } = req.body;
            if (!user || !message) {
                logRequestDebug(req, { error: "Los parametros no es correcto" });
                return handleRequestError(res, 400, { message: "parametros incorrectos" });
            }
            const result = await chatRepository.saveMessage(user, message);
            socketServer.emit("newMessage", result)
            logRequestInfo(ref)
            createResponse(res, 201, { result, payload: result })
        } catch (error) {
            logRequestError(req, error)
        }
    }
}

export default new ChatController();
