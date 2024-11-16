const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');

router.get('/product/:id', async (req, res) => {
    try {
        const file = await Filemodel.findById(req.params.id);
        const allfiles = await Filemodel.find();
        if (!file && !allfiles)
            return res.status(404).send("Product not found");
        console.log(allfiles)
        res.render('filefull.ejs', { file, allfiles, error:null });
    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
        
    }
});

module.exports = router;
