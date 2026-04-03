const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema ({
    userId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { 
        type: String, 
        required: true, 
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    role: { type: String, enum: ["admin", "attendant", "student"], default: "student" }
}, { timestamps: true })

function getPrefix(role) {
    const map = {
        student: "STU",
        admin: "ADM",
        attendant: "ATT"
    };

    return map[role];
}

userSchema.pre("save", function () {
    const prefix = getPrefix(this.role);
    if (!prefix) return new Error("Invalid role");

    const uniquePart = Date.now().toString().slice(-6);

    this.userId = `${prefix}${uniquePart}`;
});

userSchema.pre("save", async function () {
    try {
        const passwordHash = await bcrypt.hash(this.password, 10);
        this.password = passwordHash;

    } catch (err) {
        console.log("Password Hashing failed");
    }
});


module.exports = model('User', userSchema);