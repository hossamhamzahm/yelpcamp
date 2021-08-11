const express = require('express');
const path = require('path');
const mongoose = require('mongoose');





// connecting to mongo on yelp-camp2
mongoose.connect('mongodb://localhost:27017/yelp-camp2', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.log("Error", err));
mongoose.connection.once('open', ()=>console.log("Connected to Mongo successfully"));



// middlewares
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));



// creating the server on pot 3000
app.listen(3000, ()=>console.log('listening on port 3000'));


// testing the app
app.get('*', (req, res)=> res.render('home'));
