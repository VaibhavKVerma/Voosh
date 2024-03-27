const jsonwebtoken = require("jsonwebtoken")

const createJWT = async (id) => {
    try {
        const token = await jsonwebtoken.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        return token;
    } catch (error) {
        return null;
    }
}

const decodeJWT = async (token) => {
    try {
        const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return {};
    }
}

module.exports = {
    createJWT,
    decodeJWT
}