const express = require('express');
const router = express.Router();

const Campground = require('../models/campGround');
const Review = require('../models/review');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {campgroundSchema} = require('../schema.js');




const validateCampground = (req, res, next) => {  
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}



router.get('/', catchAsync(async (req, res, next) => {
  const campGrounds = await Campground.find({});
  res.render('campgrounds/index', { campGrounds });
}));

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) {
  //   throw new ExpressError('Invalid Campground Data', 400);
  // }
  // const campgroundSchema = Joi.object({
  //   campground: Joi.object({
  //     title: Joi.string().required(),
  //     price: Joi.number().required().min(0),
  //     image: Joi.string().required(),
  //     location: Joi.string().required(),
  //     description: Joi.string().required()
  //   }).required()

  // });
  // const {error} = campgroundSchema.validate(req.body);
  // if (error) {
  //   const msg = error.details.map(el => el.message).join(',');
  //   throw new ExpressError(msg, 400);
  // }
  // console.log(result);  
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id',  catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  // console.log(campground);  
  res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

// router.get('/makeCampground', async(req, res) => {
//     const camp = new Campground({title: 'My BackYard', description: 'Its a beautifull ground'});
//     await camp.save();
//   res.send(camp);
// });




module.exports = router;