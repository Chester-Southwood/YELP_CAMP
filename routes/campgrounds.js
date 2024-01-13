const express                                                         = require('express'),
      router                                                          = express.Router()
      catchAsync                                                      = require('./../utils/catchAsync'),
      Campground                                                      = require('./../models/campground'),
      {CampgroundSchema, ReviewSchema}                                = require('./../schemas'),
      {isLoggedIn:isLoggedInMiddleware, isAuthor, validateCampground} = require('./../middleware'),
      CampgroundsController                                           = require('./../controllers/campgrounds'),
      multer                                                          = require('multer'),
      { cloudinaryStorage }                                           = require('../cloudinary'),
      upload                                                          = multer({ storage: cloudinaryStorage });

router.route('/')
    .get(CampgroundsController.index)
    .post(isLoggedInMiddleware, upload.array('image'), validateCampground, catchAsync(CampgroundsController.createCampground));

router.route('/new')
    .get(isLoggedInMiddleware, CampgroundsController.renderNewForm);

router.route('/search')
    .get( catchAsync(CampgroundsController.searchCampground));
    
router.route('/:id')
    .get(catchAsync(CampgroundsController.showCampground))
    .put(isLoggedInMiddleware, isAuthor, upload.array('image'), validateCampground, catchAsync(CampgroundsController.updateCampground))
    .delete(isLoggedInMiddleware, isAuthor, catchAsync(CampgroundsController.deleteCampground));

router.route('/:id/edit')
    .get(isLoggedInMiddleware, isAuthor, catchAsync(CampgroundsController.renderEditForm));

module.exports = router;