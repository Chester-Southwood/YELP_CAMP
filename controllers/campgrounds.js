const Campground = require("./../models/campground"),
  { cloudinary } = require("../cloudinary"),
  maxboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
  maxboxToken = process.env.MAP_BOX_TOKEN,
  geoCoder = maxboxGeocoding({ accessToken: maxboxToken });

module.exports.index = async (request, response) => {
  const campgrounds = await Campground.find({});
  response.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (request, response) => {
  response.render("campgrounds/new");
};

module.exports.createCampground = async (request, response, next) => {
  const geodata = await geoCoder
    .forwardGeocode({
      query: request.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(request.body.campground);
  campground.geometry = geodata.body.features[0].geometry;
  campground.images = request.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = request.user._id;
  await campground.save();
  request.flash("success", "Successfully created a new campground!");
  response.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (request, response) => {
  try {
    const campground = await Campground.findById(request.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    response.render("campgrounds/show", { campground });
  } catch (error) {
    request.flash(
      "error",
      "Cannot find campground! Please verify campground exists!"
    );
    response.redirect("/campgrounds");
  }
};

module.exports.renderEditForm = async (request, response) => {
  try {
    const campground = await Campground.findById(request.params.id);
    response.render("campgrounds/edit", { campground });
  } catch (error) {
    request.flash(
      "error",
      "Cannot find campground to edit! Please verify campground exists!"
    );
    response.redirect("/campgrounds");
  }
};

module.exports.updateCampground = async (request, response) => {
  const campground = await Campground.findByIdAndUpdate(request.params.id, {
    ...request.body.campground,
  });
  const images = request.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...images);
  await campground.save();
  if (request.body.deleteImages) {
    for (let filename of request.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: {
        images: {
          filename: {
            $in: request.body.deleteImages,
          },
        },
      },
    });
  }
  request.flash("success", "Successfully updated campground!");
  response.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (request, response) => {
  const campground = await Campground.findByIdAndDelete(request.params.id);
  request.flash("success", "Successfully deleted campground!");
  response.redirect("/campgrounds");
};

module.exports.searchCampground = async (request, response) => {
  const campgrounds = await Campground.find({});
  response.render("campgrounds/search", { campgrounds });
};
