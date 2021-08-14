const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Campground = require('./modules/campground');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const {campgroundSchema} = require('./schemas');


// connecting to mongo on yelp-camp2
mongoose.connect('mongodb://localhost:27017/yelp-camp2', { 
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
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



const validateCampground = (req, res, next)=>{
    

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
};



// Campground routes
app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

app.post('/campgrounds', validateCampground, catchAsync(async(req, res)=>{

    const campground = new Campground(req.body.campground) ;
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${req.params.id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
}));


// If nothing is matched, respond with 404
app.all('*', (req, res, next) => {
    return next(new ExpressError("Page Not Found", 404));
});


// Error handler:
app.use((error, req, res, next)=>{
    const {status=500, message="Internal Server Error"} = error;
    res.status(status).render('error', {error});
});


// creating the server on pot 3000
app.listen(3000, () => console.log('listening on port 3000'));