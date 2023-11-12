import mongoose from "mongoose";

const ticketCollection = 'Tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Hace referencia al modelo de productos
    }]
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;