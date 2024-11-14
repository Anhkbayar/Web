const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');

router.get('/product/:id', async (req, res) => {
    try {
        const file = await Filemodel.findById(req.params.id);
        if (!file)
            return res.status(404).send("Product not found");
        const allFiles = await Filemodel.find(req.params.id).limit(5);

        res.render('filefull.ejs', { file });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
