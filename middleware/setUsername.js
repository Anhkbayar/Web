const UserModel = require('../models/usermodel');

const setUsername = async (req, res, next) => {
    if (req.user) {
        try {
            const user = await UserModel.findById(req.user.id);
            res.locals.username = user ? user.username : null;
        } catch (err) {
            console.error("Error fetching user:", err);
            res.locals.username = null;
        }
    } else {
        res.locals.username = null;
    }
    next();
};

module.exports = setUsername;
