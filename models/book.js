const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
    title: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    status: { type: String, enum: ["IN", "OUT"], default: "IN" },
    borrowedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    returnDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Book', bookSchema);