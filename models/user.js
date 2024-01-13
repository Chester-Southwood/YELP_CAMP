const mongoose              = require('mongoose'),
      Schema                = mongoose.Schema,
      passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//Reminder - Schemas are pluggable, that is, they allow for applying pre-packaged capabilities to extend their functionality. This is a very powerful feature.
UserSchema.plugin(passportLocalMongoose); //https://github.com/saintedlama/passport-local-mongoose#plugin-passport-local-mongoose

module.exports = mongoose.model('User', UserSchema);