const User = require('../modules/users');

module.exports.renderRegister = async (req, res) => {
    res.render('users/register')
};

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body.user;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) next(err)
        });
        req.flash('success', "Successfully registered a new user!");
        res.redirect('/campgrounds')
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || "campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged out successfully!');
    res.redirect('/campgrounds');
};