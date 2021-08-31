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
            author: "611e5b0969bbac3c140fb3a1",
            title: `${pick(places)}, ${pick(descriptors)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`,
            // images: [{
            //     filename: 'yelpCamp/pm1rq0l6zl4todfjdowc',
            //     url:
            //         'https://res.cloudinary.com/testing-arena/image/upload/v1629635495/yelpCamp/pm1rq0l6zl4todfjdowc.jpg'
            // },
            // {
            //     filename: 'yelpCamp/tk0n8oxwwcsjrinmpwtg',
            //     url:
            //         'https://res.cloudinary.com/testing-arena/image/upload/v1629635495/yelpCamp/tk0n8oxwwcsjrinmpwtg.jpg'
            // }],
            geometry: { 
                type: "Point", 
                coordinates: [31.17139, 27.18694] 
            },
            images: [{
                url: 'https://res.cloudinary.com/testing-arena/image/upload/v1629653242/yelpCamp/byhtq86aups8caw9ls17.jpg',
                filename: 'yelpCamp/byhtq86aups8caw9ls17'
            },
            {
                url: 'https://res.cloudinary.com/testing-arena/image/upload/v1629653241/yelpCamp/w3r3sf96dfdc94eozn9o.jpg',
                filename: 'yelpCamp/w3r3sf96dfdc94eozn9o'
            }],
            price: Math.floor(Math.random()*10)+1,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae voluptatem nemo, reiciendis sequi totam omnis. Quae similique cupiditate autem deleniti iure libero! Amet beatae tenetur quisquam facere, ab totam dolore!',
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



seed();