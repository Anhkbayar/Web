const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Extract the token from cookies
    if (!token) {
        console.error('Token is missing');
        req.user = null; // Explicitly set `req.user` to null if token is not present
        return next(); // Continue without redirecting
    }

    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded token to the request
        console.log('Authenticated user:', decoded);
    } catch (err) {
        console.error('Invalid token:', err.message);
        req.user = null; // If token verification fails, set `req.user` to null
    }
    
    next(); // Proceed to the next middleware or route handler
}

module.exports = authenticateToken;
