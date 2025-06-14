const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Joi= require('joi');

const { log } = require('console');
const {campgroundSchema, reviewSchema} = require('./schema.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const Campground = require('./models/campGround');
const Review = require('./models/review');

const app = express();
const path = require('path');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {  
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
const validateReview = (req,res,next) =>{
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }  
}



mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/campgrounds', catchAsync(async (req, res, next) => {
  const campGrounds = await Campground.find({});
  res.render('campgrounds/index', { campGrounds });
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
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

app.get('/campgrounds/:id',  catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  // console.log(campground);  
  res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

// app.get('/makeCampground', async(req, res) => {
//     const camp = new Campground({title: 'My BackYard', description: 'Its a beautifull ground'});
//     await camp.save();
//   res.send(camp);
// });

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) =>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req,res) =>{
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
}))






























































































app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
  // res.status(statusCode).send(message);
  // res.send("oh something went wrong!");
  // console.log(statusCode, message);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



