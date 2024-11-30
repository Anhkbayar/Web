const express = require('express')
const router = express.Router()
const userModel = require('../models/usermodel')
const fileModel = require('../models/filemodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const authenticateToken = require('../middleware/authenticateToken')
const setUsername = require('../middleware/setUsername')

router.use(cookieParser());
router.use(authenticateToken)
router.use(setUsername)

router.get('/login', (req, res) => {
    res.render('login/login.ejs');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ // Use status 401 for "Unauthorized"
                message: "Wrong password",
            });
        }

        // Authentication successful
        const token = jwt.sign(
            { id: user._id, name: user.username, email: user.email },
            process.env.MY_SECRET,
            { expiresIn: "1h" })

        res.cookie("token", token)
        return res.redirect('/')

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
});

router.get('/register', (req, res) => {
    res.render('login/register.ejs');
});

router.post('/register', async (req, res) => {
    const { username, email, pass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(pass, salt);
        const user = await userModel.create({
            username,
            email,
            password,
        });
        console.log(user)
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/register');
    }
});

router.get('/profile', (req, res) => {
    const email = req.user.email
    const password = req.user.password
    res.render('user/accountDetails.ejs', { email, password })
})

router.get('/downloads', (req, res) => {

    res.render('user/userDownloads.ejs')
})

router.post('/add-to-cart', (req, res) => {
    const { productId } = req.body;
    console.log(productId)
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    // Initialize cart in session if not exists
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Check if product already exists
    const existingItem = req.session.cart.find(item => item.productId === productId);
    if (existingItem) {
        return res.status(400).json({ message: 'This item is already in your cart.' });
    }

    // Add product to cart
    req.session.cart.push({ productId });

    console.log(req.session.cart)

    res.json({ message: 'Item added to cart successfully.', cart: req.session.cart });
});

router.get('/cart', async (req, res) => {
    const cart = req.session.cart;
    if (cart && cart.length > 0) {
        // Extract product IDs from the cart
        const productIds = cart.map(item => item.productId);

        try {
            // Query the database for all products in the cart
            const products = await fileModel.find({ '_id': { $in: productIds } });

            // Render the cart view with the fetched products
            res.render('cart.ejs', { products });
        } catch (error) {
            console.error('Error fetching cart products:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.render('cart.ejs', { products: [] }); // Empty cart
    }
});


router.get('/resetPassword', async (req, res) => {
    const { email, password, newpassword, matchpassword } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (newpassword && newpassword !== matchpassword) {
        return res.status(400).json({ message: "New passwords do not match" });
    }

    try {
        //useriig email eer ni haigaad
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check current password if provided
        if (password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        }

        // Update password if a new password is provided
        if (newpassword) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});


module.exports = router