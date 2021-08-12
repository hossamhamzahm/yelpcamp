const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./modules/campground');
const methodOverride = require('method-override');



// connecting to mongo on yelp-camp2
mongoose.connect('mongodb://localhost:27017/yelp-camp2', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.log("Error", err));
mongoose.connection.once('open', ()=>console.log("Connected to Mongo successfully"));



// middlewares
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// creating the server on pot 3000
app.listen(3000, ()=>console.log('listening on port 3000'));


// Campground routes
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.post('/campgrounds', async(req, res)=>{
    const campground = new Campground({
        title : req.body.campground.title,
        location : req.body.campground.location
    }) ;
    await campground.save();
    res.redirect('/campgrounds');
})

app.put('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${req.params.id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
})

app.get('*', (req, res) => res.render('home'));
