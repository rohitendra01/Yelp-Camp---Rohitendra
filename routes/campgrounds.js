const express = require('express');
const router = express.Router();

const campgrounds = require('../controller/campgrounds');

const Review = require('../models/review');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {campgroundSchema} = require('../schema.js');

router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
.get(  catchAsync(campgrounds.showCampgrounds))
.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCAmpground));


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;