import mongoose from "mongoose";
import config from "../../config/config.js";

export class MongoManager {
    static #instance

    constructor() {
        mongoose.connect(config.mongo.MONGO_URI)
            .then(() => {
                console.log("Conectado a MongoDB")
            }).catch((error) => {
                console.log('Error conect DB')
            })
    }

    static start() {
        if (!this.#instance) {
            this.#instance = new MongoManager();
        }
        return this.#instance;
    }
}