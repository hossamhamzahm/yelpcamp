const mongoose = require('mongoose');
const Campground = require('../modules/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');


const pick  = arr => arr[Math.floor(Math.random()*arr.length)];


const seed = async () => {
    await Campground.deleteMany({});
    
    for(let i=0; i<50; i++){
        const rand = Math.floor(Math.random() * 50);
        const camp = new Campground({
            title: `${pick(places)}, ${pick(descriptors)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`
        });
        await camp.save();
    }
}

// connecting to mongo on yelp-camp2
mongoose.connect('mongodb://localhost:27017/yelp-camp2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.log("Error", err));
mongoose.connection.once('open', () => console.log("Connected to Mongo successfully"));



// seed();