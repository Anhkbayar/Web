const express = require('express');
const Filemodel = require('../models/filemodel')
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allFiles = await Filemodel.find();
        res.render('index.ejs', { allFiles, error: null });
    } catch (error) {
        res.render('index.ejs', { allFiles: [], error: "Error retrieving files" });
    }
});


router.get('/aboutMe', (req, res) => {
    res.render('aboutMe.ejs')
})
router.get('/terms', (req, res) => {
    res.render('terms.ejs')
})

module.exports = router