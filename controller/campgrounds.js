const Campground = require('../models/campGround');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 12; 
    const skip = (page - 1) * limit;
    const total = await Campground.countDocuments({});
    const campGrounds = await Campground.find({}).skip(skip).limit(limit);

    const geoJSON = {
        type: "FeatureCollection",
        features: campGrounds.map(cg => ({
            type: "Feature",
            geometry: cg.geometry,
            properties: {
                id: cg._id,
                title: cg.title,
                location: cg.location,
                popUpMarkup: `<a href="/campgrounds/${cg._id}">${cg.title}</a><p>${cg.location}</p>`
            }
        }))
    };
    res.render('campgrounds/index', {
        campGrounds,
        geoJSON,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
    });
}


module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  const campground = new Campground(req.body.campground);
  const rawGeometry = geoData.features[0].geometry;
rawGeometry.type = "Point"; 
campground.geometry = rawGeometry;
  const imgs = req.files.map(f => ({
    url: f.path,
    filename: f.filename
  }));
  campground.image = imgs;
  campground.author = req.user._id;

  // Enforce at least one image
  if (campground.image.length === 0) {
    req.flash('error', 'You must upload at least one image.');
    return res.redirect('/campgrounds/new');
  }

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
  console.log(req.body);  
  const campground = await Campground.findById(id);
campground.set(req.body.campground);
const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
const rawGeometry = geoData.features[0].geometry;
rawGeometry.type = "Point";
campground.geometry = rawGeometry;

  const imgs = req.files.map( f => ({
    url : f.path,
    filename : f.filename
  }));
  campground.image.push(...imgs);
  console.log("Saving campground with geometry.type =", campground.geometry.type);
  await campground.save();
if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    await campground.save();
    if (campground.image.length === 0) {
      req.flash('error', 'A campground must have at least one image.');
      return res.redirect(`/campgrounds/${campground._id}/edit`);
    }
}
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