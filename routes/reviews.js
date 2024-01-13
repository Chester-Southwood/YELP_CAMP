const express                                      = require('express'),
      router                                       = express.Router({ mergeParams: true}), //mergeParams of all route segments
      Review                                       = require('./../models/review')
      catchAsync                                   = require('../utils/catchAsync'),
      Campground                                   = require('./../models/campground'),
      {CampgroundSchema, ReviewSchema}             = require('./../schemas'),
      {validateReview, isLoggedIn, isReviewAuthor} = require('./../middleware'),
      ReviewsController                            = require('./../controllers/reviews');

// Endpoints

router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(ReviewsController.createReview));
    
router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(ReviewsController.deleteReview));

module.exports = router;