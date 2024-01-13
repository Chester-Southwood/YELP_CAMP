const mongoose   = require('mongoose'),
      Schema     = mongoose.Schema,
      Review     = require('./review');

const opts = {
    toJSON: {
        virtuals: true
    }
}

//need to pull image into own schema to add virtual property
const imageSchema = new Schema ({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200'); //for thumbnail on campground preview
});

const campgroundSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        "type": {
            type: String,
            enum: ['Point'],
            required: true
        },
        "coordinates": 
            {
                type: [Number],
                required: true
            }
        
    },
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [imageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId, // ObjectId from a review model. One to many relationship
            ref: 'review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,50)}...</p>`
});

// Middleware (Query middlware below)
// Delete all reviews attached to deleted campground
campgroundSchema.post('findOneAndDelete', async (deletedDocument) => { // Only deletes if delete method in app.js uses 'findOneAndDelete' and not a different different function
    if (deletedDocument) {
        await Review.deleteMany({
            _id: {
                $in: deletedDocument.reviews
            }
        })
    }
});

module.exports = mongoose.model('campground', campgroundSchema);