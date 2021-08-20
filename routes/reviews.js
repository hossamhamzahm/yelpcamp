const express = require('express');
const Campground = require('../modules/campground');
const Review = require('../modules/reviews');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');




router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    review.author = req.user.id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created a new review!');
    res.redirect(`/campgrounds/${req.params.id}`);
}));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, body) => {
    await Review.findByIdAndDelete(req.params.reviewId, { useFindAndModify: false });
    await Campground.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } }, { useFindAndModify: false })
    // const campground = await Campground.findById(req.params.id);
    // const idx = campground.reviews.indexOf(req.params.reviewId);
    // campground.reviews.splice(idx, 1);
    // await campground.save();
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${req.params.id}`)
}));


module.exports = router;