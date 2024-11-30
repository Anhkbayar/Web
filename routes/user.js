const express = require('express')
const router = express.Router()
const userModel = require('../models/usermodel')
const fileModel = require('../models/filemodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const authenticateToken = require('../middleware/authenticateToken')
const setUsername = require('../middleware/setUsername')

router.use(cookieParser());
router.use(authenticateToken)
router.use(setUsername)

router.get('/login', (req, res) => {
    res.render('login/login.ejs', {message: null});
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            req.flash('error', 'Email or password is incorrect');
            return res.redirect('/login');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Email or password is incorrect');
            return res.redirect('/login');
        }


        // Authentication successful
        const token = jwt.sign(
            { id: user._id, name: user.username, email: user.email },
            process.env.MY_SECRET
        )

        res.cookie("token", token)
        return res.redirect('/')

    } catch (error) {
        console.error(error);
        return res.status(500).render('login', {
            message: "Email or password is incorrect",
        });
    }
});

router.get('/register', (req, res) => {
    res.render('login/register.ejs');
});

router.post('/register', async (req, res) => {
    const { username, email, pass } = req.body;
    try {
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(pass, salt);
        const user = await userModel.create({
            username,
            email,
            password,
        });
        console.log(user)
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/register');
    }
});

router.get('/profile', (req, res) => {
    const email = req.user.email
    const password = req.user.password
    res.render('user/accountDetails.ejs', { email, password })
})

router.get('/downloads', (req, res) => {

    res.render('user/userDownloads.ejs')
})

router.post('/add-to-cart', (req, res) => {
    const { productId } = req.body;
    // console.log(productId)
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    // hooson baival hoosniig uusgene
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // baigaa esehiig shalgana
    const existingItem = req.session.cart.find(item => item.productId === productId);
    if (existingItem) {
        return res.status(400).json({ message: 'This item is already in your cart.' });
    }

    // product iig session ruu nemne
    req.session.cart.push({ productId });

    // console.log(req.session.cart)

    res.json({ message: 'Item added to cart successfully.', cart: req.session.cart });
});

router.get('/cart', async (req, res) => {
    const cart = req.session.cart;
    if (cart && cart.length > 0) {
        // cartaas product idnuudiig salgaj avna
        const productIds = cart.map(item => item.productId);

        try {
            // cart dotor baigaa buh idnuudiig db ees haina
            const products = await fileModel.find({ '_id': { $in: productIds } });

            // barij avsnaa cart deer gargana
            res.render('cart.ejs', { products });
        } catch (error) {
            console.error('Error fetching cart products:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.render('cart.ejs', { products: [] });
    }
});

router.post('/remove', async (req, res) => {
    // console.log("remove");
    // console.log("Body:", req.body);

    const { removeID } = req.body;
    const carts = req.session.cart || [];
    // console.log("Current cart:", carts);

    const updatedCart = carts.filter(item => item.productId !== removeID);

    if (updatedCart.length !== carts.length) {
        req.session.cart = updatedCart
        console.log("Updated cart:", updatedCart)
        return res.status(200).json({ message: "Item removed successfully" })
    }

    console.log("Item not found in cart");
    return res.status(404).json({ message: "Item not found in the cart" });
});

router.post('/resetPassword', async (req, res) => {
    const { email, password, newpassword, matchpassword } = req.body;

    if (!email) {
        req.flash('fail', 'Email is required')
        return res.redirect('/profile')
    }

    if(!password){
        req.flash('fail', 'Current password is required')
        return res.redirect('/profile')
    }

    if (newpassword !== matchpassword) {
        req.flash('fail', 'New passwords do not match')
        return res.redirect('/profile')
    }

    try {
        //useriig email eer ni haigaad
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check current password if provided
        if (password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                req.flash('fail', 'Current password is incorrect')
                return res.redirect('/profile')
            }
        }

        // Update password if a new password is provided
        if (newpassword) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            user.password = hashedPassword;
        }

        await user.save();
        req.flash('fail', 'Password updated successfully')
        return res.redirect('/profile')
    } catch (error) {
        console.error(error);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});


module.exports = router