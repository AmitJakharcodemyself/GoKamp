const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews=require('../controllers/reviews');

const { reviewSchema } = require('../validateSchemas.js');

const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');



//Don't authorize while creating Review
router.post('/',isLoggedIn ,validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;