const { campgroundSchema, reviewSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./modules/campground');
const Review = require('./modules/reviews');


module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.isAuthor = catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (toString(campground.author) !== toString(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${campground.id}`);
    }
    next();
});

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (toString(review.author) !== toString(req.user._id)) {
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
});


