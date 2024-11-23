const express = require('express')
const router = express.Router()
const userModel = require('../models/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

router.use(cookieParser());

router.get('/login', (req, res) => {
    res.render('login/login.ejs', { username: null });
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
            { id: user._id, name: user.username },
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
    res.render('user/accountDetails.ejs')
})

router.get('/downloads', (req, res) => {
    res.render('user/userDownloads.ejs')
})

router.get('/cart', async (req, res) => {
    res.render('cart.ejs')
})

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});


module.exports = router