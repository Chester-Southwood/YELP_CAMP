const BaseJoi = require('joi'),
      sanitizeHtml = require('sanitize-html');

const Joi = BaseJoi.extend((joi) => ({
    type:'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                return (clean !== value) ? helpers.error('string.escapeHTML', { value}) : clean;
            }
        }
    }
}));

const CampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        //imageURL: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages:Joi.array()
}),
ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.CampgroundSchema = CampgroundSchema;
module.exports.ReviewSchema     = ReviewSchema;