const { Schema, model, Types } = require('mongoose');

const bookSchema = new Schema({
    title: { type: String, required: true },
    isbn: { type: String, unique: true },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    status: { type: String, enum: ["IN", "OUT"], default: "IN" },
    borrowedBy: { type: Schema.Types.ObjectId, ref: "Student", default: null },
    issuedBy: { type: Schema.Types.ObjectId, ref: "Attendant", default: null },
    returnDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Book', bookSchema);