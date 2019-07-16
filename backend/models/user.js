const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // to be used as plugin for uniqueness validation

const userSchema = mongoose.Schema({
    // unique: true is not a validator AND  it won't throw an exception if email already exists. It only allows to do some internal optimizations of mongodb and mongoose
    // so we need to install a unique validator
    email: { type: String, requred: true, unique: true },
    password: { type: String, requred: true }
});

//use the uniqueness validator
userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = {
    UserModel
}
