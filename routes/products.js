const express = require('express');
const router = express.Router();
const Filemodel = require('../models/filemodel');

router.get('/product/:id', async (req, res) => {
    try {
        const file = await Filemodel.findById(req.params.id);
        if (!file)
            return res.status(404).send("Product not found");
        const allfiles = await Filemodel.find({ _id: { $ne: req.params.id } });
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

router.get('/item', async (req, res) => {
    res.render('filefull.ejs')
})

router.get('/cars', (req, res)=>{
    res.render('cars.ejs')
})
router.get('/accessories', (req, res)=>{
    res.render('accessories.ejs')
})

router.post('/addCart', async (req, res)=>{
    console.log(req.body)
    try {
        const { productId } = req.body;
        console.log("test:" ,req.body)
        if (!productId) {
            return res.status(400).send("Product ID is required.");
        }

        // Find the product in the database
        const product = await Filemodel.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Initialize the cart in the session if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if the product is already in the cart
        const existingItem = req.session.cart.find(item => item.productId === productId);
        if (existingItem) {
            return res.status(400).send("Product is already in the cart.");
        }

        // Add the product to the cart
        req.session.cart.push({
            productId: product._id,
            name: product.name,
            price: product.price,
        });

        res.status(200).send("Product added to cart successfully.");
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Server Error.");
    }
})
module.exports = router;
