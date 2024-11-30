const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');
const path = require('path')
const fs = require('fs')
const { coverImageBasePath, stlFileBasePath, chassisImageBasePath } = require('../models/filemodel')

router.get('/product/:id', async (req, res) => {
    try {
        const file = await Filemodel.findById(req.params.id);
        if (!file)
            return res.status(404).send("Product not found");
        const allfiles = await Filemodel.find({ _id: { $ne: req.params.id } });
        res.render('filefull.ejs', { file, allfiles, error: null });

    } catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
    }
});

router.post('/deleteItem', async (req, res)=>{
    try {
        const { productId } = req.body; // Extract file ID from the request body
        console.log(req.body)
        const file = await Filemodel.findByIdAndDelete(productId);

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const deleteFiles = (filePaths, basePath) => {
            filePaths.forEach((fileName) => {
                const filePath = path.join(basePath, fileName);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete file: ${filePath}`, err);
                    } else {
                        console.log(`File deleted: ${filePath}`);
                    }
                });
            });
        };

        deleteFiles(file.coverImageNames, coverImageBasePath);

        deleteFiles(file.stlFileNames, stlFileBasePath);

        deleteFiles(file.chassisImageNames, chassisImageBasePath);

        await models.findByIdAndDelete(productId);

        res.status(200).json({ message: "File deleted" });

    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/successfull', async (req, res) => {
    res.render('successfull.ejs')
})

// router.get('/checkout', async (req, res) => {
//     const cart = req.session.cart;
//     console.log(cart)
//     if (cart && cart.length > 0) {
//         const products = await Filemodel.findById(req.params.id);
//         res.render('cartinfo.ejs', {products})
//     }
// })

router.get('/item', async (req, res) => {
    res.render('filefull.ejs')
})

router.get('/cars', (req, res) => {
    res.render('cars.ejs')
})
router.get('/accessories', (req, res) => {
    res.render('accessories.ejs')
})
module.exports = router;
