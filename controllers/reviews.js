const Review = require('./../models/review');

module.exports.createReview = async(request, response, error, next) => {
    const campground = await Campground.findById(request.params.id),
          review     = new Review(request.body.review);
    review.author = request.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();
    request.flash('success', 'Successfully created review!');
    response.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async(request, response) => {
    await Review.findByIdAndDelete(request.params.reviewId),
    await Campground.findByIdAndUpdate(request.params.reviewId, {$pull: {reviews: request.params.reviewId}}); //https://www.mongodb.com/docs/manual/reference/operator/update/pull/
    request.flash('success', 'Successfully deleted review!');
    response.redirect(`/campgrounds/${request.params.id}`);
};