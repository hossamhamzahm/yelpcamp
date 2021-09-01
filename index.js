if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
} 

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./modules/users');
const userRouter = require('./routes/users');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require('helmet');
const MongoStore = new require("connect-mongo");


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp2';


// connecting to mongo on yelp-camp2
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.log("Error", err));
mongoose.connection.once('open', ()=>console.log("Connected to Mongo successfully"));



// middlewares
const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize())
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/testing-arena/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600,
});
store.on('error', (e)=> console.log("Session Error:", e));


const sessionConfig = {
    // name: 'blah',
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}


app.use(session(sessionConfig));
app.use(flash());


// using passport for authentication
// remember, u have to use session before start using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// user routes
app.use('/', userRouter)
// campground routes
app.use('/campgrounds', campgroundRouter);
// review routes
app.use('/campgrounds/:id/reviews', reviewRouter);


app.get('/', (req, res)=> res.render('home'));

// If nothing is matched, respond with 404
app.all('*', (req, res, next) => {
    return next(new ExpressError("Page Not Found", 404));
});


// Error handler:
app.use((error, req, res, next)=>{
    const {status=500, message="Internal Server Error"} = error;
    res.status(status).render('error', {error});
});


// creating the server on port 3000
app.listen(3000, () => console.log('listening on port 3000'));