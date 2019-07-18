const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, requred: true },
    content: { type: String, requred: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const PostModel = mongoose.model('PostModel', postSchema);

module.exports = {
    PostModel
}
