const express = require('express')
const authenticateToken = require('../middleware/authenticateToken')
const Filemodel = require('../models/filemodel')
const UserModel = require('../models/usermodel')
const setUsername = require('../middleware/setUsername')
const router = express.Router()

router.use(authenticateToken)
router.use(setUsername)

router.get('/', async (req, res) => {
    const allFiles = await Filemodel.find();
    res.render('index.ejs', { allFiles, error: null });
});

router.get('/aboutMe', (req, res) => {
    res.render('aboutMe.ejs')
})

router.get('/terms', (req, res) => {
    res.render('terms.ejs')
})

router.get('/sorry', (req,res)=>{
    res.render('sorry.ejs')
})


module.exports = router