const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const Filemodel = require('../models/filemodel')
const UserModel = require('../models/usermodel')
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const allFiles = await Filemodel.find();

    if (req.user) {
        const user = await UserModel.findById(req.user.id);
        res.render('index.ejs', { allFiles, username: user.username, error: null });
    }
    else {
        res.render('index.ejs', { allFiles, username: null, error: null });
    }
});

router.get('/aboutMe', (req, res) => {
    res.render('aboutMe.ejs')
})

router.get('/terms', (req, res) => {
    res.render('terms.ejs')
})


module.exports = router