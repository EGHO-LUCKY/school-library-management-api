const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401)
        .json({ message: "Unauthorized, no token found." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.status(401)
            .json({ message: `Access denied for role: ${req.user.role}` });

        next();
    }
}

module.exports = {
    authenticate,
    authorizeRole
}

