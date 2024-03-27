const Status = require("http-status");
const { ROLE, allowedFields } = require("../utils/User");

const validateUserMiddleware = (req, res, next) => {
    try {
        const filteredData = Object.keys(req.body)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        req.body = filteredData;

        next();
    } catch (error) {
        console.error('User validation error:', error);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
};

module.exports = validateUserMiddleware;
