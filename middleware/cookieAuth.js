const jwt = require('jsonwebtoken')

exports.cookieAuth = (req, res, next) => {
    const token = req.cookies.token;
    try{
        const user = jwt.verify(token, process.env.MYSECRET);
        req.user = user;

        next()
    }
    catch{
        res.clearCookie("token")
        return res.redirect('/');
    }
}