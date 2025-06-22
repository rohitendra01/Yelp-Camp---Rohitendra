const Campground = require('../models/campGround');


module.exports.index = async (req, res, next) => {
  const campGrounds = await Campground.find({});
  res.render('campgrounds/index', { campGrounds });
}


module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', "Successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampgrounds = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
  .populate({
    path:'reviews',
    populate : {
      path : 'author'
    }
  }).populate('author');
  // console.log(campground);  
  if (!campground) {
    req.flash('error', "Cannot find that campground");
    return res.redirect('/campgrounds');
  }
  // console.log(campground);  
  res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', "Cannot find that campground");
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated campground');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.destroyCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
    req.flash('error','Not authorised for this service.');
    return    res.redirect(`/campgrounds/${campground._id}`);
  }
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Deleted a Campground');
  res.redirect('/campgrounds');
}