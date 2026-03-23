const { Schema, model } = require('mongoose');

const authorSchema = new Schema ({
    name: { type: String, required: true },
    bio: { type: String }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Author', authorSchema);