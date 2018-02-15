var mongoose                = require("mongoose"),
    passporLocalMongoose    = require("passport-local-mongoose")


//USERSCHEMA
var UserSchema = new mongoose.Schema({
    username : String,
    password : String
});

UserSchema.plugin(passporLocalMongoose);



//EXPORT USERSCHEMA MODEL
module.exports = mongoose.model('User', UserSchema);