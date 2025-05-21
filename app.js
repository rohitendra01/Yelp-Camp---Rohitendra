const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { log } = require('console');
const CampGround = require('./models/campGround');


mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",() => {
    console.log("Database Connected");
})



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) => {
  res.render('index');
});

app.get('/campgrounds', async (req,res) =>{
  const campGrounds = await CampGround.find({});
  res.render('campgrounds/index', { campGrounds });
})

// app.get('/makeCampGround', async(req, res) => {
//     const camp = new CampGround({title: 'My BackYard', description: 'Its a beautifull ground'});
//     await camp.save();
//   res.send(camp);
// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});