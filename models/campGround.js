const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };


const ImageSchema = new Schema({
    url : String,
    filename : String
});

ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200');
});


const campGroundSchema = new Schema({
    title : String,
    image : [ImageSchema],
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    price : Number,
    description : String,
    location : String,
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews: [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }]
});


campGroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

campGroundSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        });
    }
});


campGroundSchema.set('toObject', { virtuals: true });
campGroundSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campground', campGroundSchema);