const express = require('express');
const router = express.Router();

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});



const campgrounds = require('../controller/campgrounds');


const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {campgroundSchema} = require('../schema.js');

router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
.get(  catchAsync(campgrounds.showCampgrounds))
.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroyCampground));


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;