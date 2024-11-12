const express = require('express');
const router = express.Router();

router.get('/aboutMe', (req,res)=>{
    res.render('aboutMe.ejs')
})
router.get('/terms', (req,res)=>{
    res.render('terms.ejs')
})

module.exports = router