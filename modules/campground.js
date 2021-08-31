const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_400');
});

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    description: String,
    location: String,
    reviews:[{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});


CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
});


module.exports = new mongoose.model("Campground", CampgroundSchema);