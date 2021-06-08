const express = require("express");
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require("express-flash")
const { v4: uuidv4 } = require("uuid");
require('dotenv').config()
const connect = require("./models/db")
const userRoutes = require("./routes/userRoutes")
const profileRoutes = require("./routes/profileRoutes")
const postRoutes = require("./routes/postRoutes")
const bookRoutes=require("./routes/routes")
const Adminrouter = require('./routes/adminRouter');


const app = express();
const PORT = process.env.PORT || 9999;
// DB Connnection
connect();
// Express session middleware
const store = new MongoDBStore({
    uri: process.env.DB,
    collection: 'sessions'
})
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 7 * 24 * 60 * 60
    },
    store: store
}))
// Flash middleware 
app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.flash()
    next();
})
// Load static files
app.use(express.static("./views"));
app.use(express.urlencoded({ extended: true })); 



app.use(express.static("./uploads"));
// Set ejs
app.set("view engine", "ejs")
// Routes
app.use(userRoutes)
app.use(profileRoutes)
app.use(postRoutes)
app.use(bookRoutes)
app.use(Adminrouter)

// home route
app.get('/admin', (req, res) =>{
    res.render('admin', { title : "Login System"});
})


// Create server
app.listen(PORT, () => {
    console.log(`Server running on port number: ${PORT}`);
});