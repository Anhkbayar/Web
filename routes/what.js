const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const Filemodel = require('../models/filemodel')
const UserModel = require('../models/usermodel')
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        const allFiles = await Filemodel.find();
        res.render('index.ejs', { allFiles, username: user.username, error: null });
    } catch (error) {
        res.render('index.ejs', { allFiles: [], error: "Error retrieving files" });
    }
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