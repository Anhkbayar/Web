const express = require('express')
const router = express.Router()
const userModel = require('../models/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    res.render('index.ejs');
});



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
        const token = jwt.sign(user.toObject(), process.env.MY_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
        })

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

router.delete('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

module.exports = router