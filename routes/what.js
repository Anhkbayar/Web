const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const Filemodel = require('../models/filemodel')
const router = express.Router();

router.get('/', authenticateTokens, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        const allFiles = await Filemodel.find();
        console.log(authenticateToken);
        res.render('index.ejs', { allFiles, username: user.username, error: null });
    } catch (error) {
        res.render('index.ejs', { allFiles: [], error: "Error retrieving files" });
    }
});

router.get('/profile', authenticateToken, (req, res) => {
    res.render('profile', { user: req.user });
});

router.get('/cart', async (req, res) => {
    res.render('cart.ejs')
})
router.get('/aboutMe', (req, res) => {
    res.render('aboutMe.ejs')
})
router.get('/terms', (req, res) => {
    res.render('terms.ejs')
})

module.exports = router