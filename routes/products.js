const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');

router.get('/product/:id', async (req, res) => {
    try {
        const file = await Filemodel.findById(req.params.id);
        const allfiles = await Filemodel.find();
        if (!file && !allfiles)
            return res.status(404).send("Product not found");
        res.render('filefull.ejs', { file, allfiles, error:null });
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
        
    }
});
router.get('/successfull', async (req, res) =>{
    res.render('successfull.ejs')
})

router.get('/checkout', async(req, res)=>{
    const checkfile = await Filemodel.findById(req.params.id);
    if(checkfile.price)
        res.render('cartinfo.ejs')
    res.render('successfull.ejs')
})
module.exports = router;
