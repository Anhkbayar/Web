const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token; 
    if (!token) {
        // console.error('Token is missing');
        req.user = null;
        return next(); 
    }

    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET); 
        req.user = decoded;
        // console.log('Authenticated user:', decoded);
    } catch (err) {
        console.error('Invalid token:', err.message);
        req.user = null; 
    }
    
    next(); 
}

module.exports = authenticateToken;
