const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    const rolesArray = ['admin', 'attendant', 'student'];
    if (role && !rolesArray.includes(role)) return res.status(400)
        .json({ message: "Invalid role" });

    if (!name || !email || !password) return res.status(400)
        .json({message: "Missing field(s)"});

    if (!validator.isEmail(email)) return res.status(400)
        .json({message: "Invalid Email"});

    if (password.length < 6) return res.status(400)
        .json({ message: "Password must be at least 6 characters long" }); 

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400)
            .json({ message: "Email already exist."});

        
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        return res.status(201).json({
            message: "User Created successfully",
            user: {
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "userId": user.userId,
                "_id": user._id,
                "createdAt": user.createdAt,
                "updatedAt": user.updatedAt
            }
        });
        
    } catch(err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to create student. Please try again" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400)
        .json({ message: "Missing field(s)" });

    try {
        const user = await User.findOne({email}).select("+password");
        if (!user) return res.status(401)
            .json({ message: "Invalid Credentials" });
    
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401)
            .json({ message: "Invalid Credentials" });
    
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )
    
        return res.json({
            message: "Login successful",
            user: {
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "userId": user.userId,
                "_id": user._id,
                "createdAt": user.createdAt,
                "updatedAt": user.updatedAt
            },
            token
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Unable to log in. Please try again" });
    }
}

const getUsers = (role) => {
    return async (req, res) => {
        try {
            const users = await User.find({ role: role });
            if (users.length === 0) return res.status(404)
                .json({ message: `No ${role} found.`});

            res.json({ users });

        } catch(err) {
            console.log(err.message);
            return res.status(500).json({ message: `Unable to retrieve ${role}s record. Please try again` });
        }
    }
}

const getUserById = (role) => {
    return async (req, res) => {
        const id = req.params.id

        try {
            const user = await User.findById(id);
        
            if (!user || (user.role !== role)) return res.status(404)
                .json({message: `${role.toUpperCase()} with ID: ${id} not found`});

            return res.json({ user });

        } catch(err) {
            console.log(err.message);
            return res.status(500).json({ message: `Unable to retrieve ${role} record. Please try again` });
        }
    }
}

module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUserById
}