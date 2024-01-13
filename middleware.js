const {CampgroundSchema, ReviewSchema} = require('./schemas'),
      Campground                       = require('./models/campground'),
      ExpressError                     = require('./utils/ExpressError'),
      Review                           = require('./models/review');

//https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/37454760
module.exports.isLoggedIn = (request, response, next) => {
    if (!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        return response.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (request, response, next) => {
    if (request.session.returnTo) {
        response.locals.returnTo = request.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (request, response, next) => {
    const result = CampgroundSchema.validate(request.body);
    if (result.error) {
        const errorMessage = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(errorMessage, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (request, response, next) => {
    const { id } = request.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(request.user._id)) {
        request.flash('error', 'You do not have permission to do that!');
        return response.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (request, response, next) => {
    const { id, reviewId } = request.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(request.user._id)) {
        request.flash('error', 'You do not have permission to do that!');
        return response.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (request, response, next) => {
    const result = ReviewSchema.validate(request.body);
    if (result.error) {
        const errorMessage = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(errorMessage, 400);
    } else {
        next();
    }
};