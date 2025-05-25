const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { log } = require('console');


const Campground = require('./models/campGround');


const app = express();
const path = require('path');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));








mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",() => {
    console.log("Database Connected");
})







app.get('/', (req, res) => {
  res.render('index');
});

app.get('/campgrounds', async (req,res) =>{
  const campGrounds = await Campground.find({});
  res.render('campgrounds/index', { campGrounds });
})

app.get('/campgrounds/new', async (req,res) =>{
  res.render('campgrounds/new');
})

app.post('/campgrounds', async(req,res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
  // res.send(req.body);
})

app.get('/campgrounds/:id', async (req,res) =>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show',{campground});
})

app.get('/campgrounds/:id/edit', async (req,res) =>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit',{campground});
})

app.put('/campgrounds/:id', async (req,res) =>{
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async (req,res) =>{
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})


// app.get('/makeCampground', async(req, res) => {
//     const camp = new Campground({title: 'My BackYard', description: 'Its a beautifull ground'});
//     await camp.save();
//   res.send(camp);
// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});