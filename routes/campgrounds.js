const express = require('express');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');


// Campground routes
router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;