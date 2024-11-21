function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token
    }

    try {
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        req.user = decoded; // Attach decoded token data to the request
        next();
    } catch (err) {
        console.error(err);
        res.clearCookie('token'); // Clear invalid token
        return res.redirect('/login');
    }
}