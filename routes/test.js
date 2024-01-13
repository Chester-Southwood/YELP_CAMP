const express = require("express"),
  router = express.Router(),
  Campground = require("./../models/campground");

router.route("/").get(async (request, response) => {
  const campgrounds = await Campground.find({});
  response.render("tests", { campgrounds });
});

module.exports = router;
