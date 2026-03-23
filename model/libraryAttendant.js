const { Schema, model, Types } = require('mongoose');

const libraryAttendantSchema = new Schema({
    name: { type: string, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Attendant', libraryAttendantSchema);