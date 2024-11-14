if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

//routes
const userRouter = require('./routes/user');
const fileRouter = require('./routes/files');
const headerRouter = require('./routes/what');
const productRouter = require('./routes/products');

const connect = require('./db');


connect();  // Connect to MongoDB

app.set('view-engine', 'ejs');

app.use(express.urlencoded({ extended: true })); // Parses form data as URL-encoded data
app.use(express.json())
app.use( express.static( "public" ) );
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(methodOverride('_method'));
app.use('/', userRouter);
app.use('/', fileRouter);
app.use('/', headerRouter);
app.use('/', productRouter);

app.listen(3000);
