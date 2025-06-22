const express = require('express');
const router = express.Router({mergeParams: true});

const reviews = require('../controller/review');

const {reviewSchema} = require('../schema.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const review = require('../models/review.js');




router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId',isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;
