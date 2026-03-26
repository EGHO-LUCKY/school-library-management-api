const { Schema, model, Types } = require('mongoose');

const studentSchema = new Schema ({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = model('Student', studentSchema);