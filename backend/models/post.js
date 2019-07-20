const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, requred: true },
    content: { type: String, requred: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true }
    // type is on mongoose ID and ref: "UserModel" helps Mongoose to link this ObjectId to the UserModel
});

const PostModel = mongoose.model('PostModel', postSchema);

module.exports = {
    PostModel
}
