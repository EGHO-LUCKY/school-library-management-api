const { Schema, model, Types } = require('mongoose');

const studentSchema = new Schema ({
    name: { type: string, required: true },
    email: { type: string, unique: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = model('Student', studentSchema);