const express = require('express');
const User = require('../modules/users');
const mongoose = require('mongoose');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Schema = mongoose.Schema;
const router = express.Router();


router.get('/register', catchAsync(async(req, res)=>{
    res.render('users/register')
}));


router.post('/register', catchAsync(async (req, res) => {
    try{
        const { username, email, password } = req.body.user;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) next(err)
        });
        req.flash('success', "Successfully registered a new user!");
        res.redirect('/campgrounds')
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || "campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged out successfully!');
    res.redirect('/campgrounds');
})

module.exports = router;