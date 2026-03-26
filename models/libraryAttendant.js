const { Schema, model, Types, trusted } = require('mongoose');

const libraryAttendantSchema = new Schema({
    name: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Attendant', libraryAttendantSchema);