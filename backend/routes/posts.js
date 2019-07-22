const express = require('express');


const router = express.Router();

const { checkAuth } = require('../middleware/check-auth');
const PostsController = require ('../controllers/posts');
const extractFile = require('../middleware/file');


router.post('', checkAuth, extractFile , PostsController.createPost);

//use multer here as well to put resources
router.put('/:id', checkAuth, extractFile, PostsController.editPost);

router.get('', PostsController.getAllPosts);

router.get('/:id', PostsController.getPost);

router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = {
    router
}
