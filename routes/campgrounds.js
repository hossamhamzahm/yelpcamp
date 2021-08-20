const express = require('express');
const Campground = require('../modules/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({ mergeParams: true });




// Campground routes
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully made a new campground!')
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id, { useFindAndModify:false});
    req.flash('success', 'Successfully deleted campground!')
    res.redirect(`/campgrounds`);
}));


module.exports = router;