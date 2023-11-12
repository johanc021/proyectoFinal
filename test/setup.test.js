import mongoose from "mongoose";
import { productModel } from "../src/daos/schema/products.schema.js";
import { cartModel } from "../src/daos/schema/carts.schema.js";
import userModel from "../src/daos/schema/users.schema.js";

before(async () => {
    await mongoose.connect(`mongodb+srv://Aruzuhed:Coder123@testing.4q254eb.mongodb.net/?retryWrites=true&w=majority`);
})

after(async () => {
    mongoose.connection.close()
})

export const dropProducts = async () => {
    try {
        await productModel.collection.drop();
    } catch (error) {
        console.error("Error dropping products collection:", error);
    }
}

export const dropCart = async () => {
    try {
        await cartModel.collection.drop();
    } catch (error) {
        console.error("Error dropping carts collection:", error);
    }
}

export const dropUser = async () => {
    try {
        await userModel.collection.drop();
    } catch (error) {
        console.error("Error dropping users collection:", error);
    }
}
