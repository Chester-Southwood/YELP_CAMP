const User = require('./../models/user');

module.exports.renderRegister = (request, response) => {
    response.render('users/register')
};

module.exports.register = async(request, response, next) => {
    try {
        const {username, email, password} = request.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        
        request.login(registeredUser, (error) => {
            if (error) {
                return next(error);
            }
            request.flash('success', 'Welcome to Yelp Camp!');
            response.redirect('/campgrounds');
        });
    } catch (error) {
        request.flash('error', error.message);
        response.redirect('register');
    }
};

module.exports.renderLogin = (request, response) => {
    response.render('users/login')
};

module.exports.login = async(request, response) => {
    request.flash('success', 'Welcome back to Yelp Camp!');
    const redirectUrl = response.locals.returnTo || '/campgrounds';
    response.redirect(redirectUrl);
};

module.exports.logout = (request, response) => {
    request.logout((error) => {
        if (error) {
            return next(err);
        }
        request.flash('success', 'Successfully Logged Out!');
        response.redirect('/campgrounds');
    });
};