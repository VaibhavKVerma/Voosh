const Status = require("http-status");
const User = require("../models/UserSchema");
const { decodeJWT } = require("../utils/jsonWebTokenUtil");

const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) return res.status(Status.BAD_REQUEST).json({ message: "Invalid authorization header" });

        const token = authorizationHeader.split(" ")[1];
        const { id: userId, exp } = await decodeJWT(token);
        if (!userId) return res.status(Status.BAD_REQUEST).json({ message: "Incorrect JSON Token" });

        if (Date.now() / 1000 > exp) return res.status(Status.BAD_REQUEST).json({ message: "JSON Token Expired" });

        const user = await User.findById(userId);
        if (!user) return res.status(Status.NOT_FOUND).json({ message: "User Not Found" });

        if (user.email !== req.body.email) return res.status(Status.UNAUTHORIZED).json({ message: "User not Authorized" });

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};

module.exports = authMiddleware;
