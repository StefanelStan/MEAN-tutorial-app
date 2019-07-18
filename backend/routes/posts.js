const express = require('express');
const multer = require('multer');

const router = express.Router();

const { checkAuth } = require('../middleware/check-auth');
const { PostModel } = require('../models/post');

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// confdigure the multer to use the destination and how to write the name of file
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]; // if file is invalid, this will be invalid/null and error will remain error
        let error = new Error("Invalid mime-type");
        if (isValid) { // if isValid was left null, error will not be set to null and callback will blow with error
            error = null;
        }
        callback(error, 'backend/images');
    },
    filename : (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-'); // this will remove the extension
        const ext = MIME_TYPE_MAP[file.mimetype];
        console.log(name);
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', checkAuth, multer({storage: storage}).single("image"), async(request, response, next) => {
    const url = `${request.protocol}://${request.get("host")}`;
    const post = new PostModel({
        title: request.body.title,
        content: request.body.content,
        imagePath: `${url}/images/${request.file.filename}`,
        creator: request.userData.userId
    });
    //return console.log(request.userData);
    post.save().then((createdPost) => {
        return response.status(201).json({
            message: 'Post added successfully',
            // postId: createdPost._id  let's return the right stuff!
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });
});

//use multer here as well to put resources
router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, resp, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = `${req.protocol}://${req.get("host")}`;
        imagePath= `${url}/images/${req.file.filename}`;
    }
    console.log(req.file);
    const updatedPost = new PostModel({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: request.userData.userId
    });
    PostModel.updateOne({_id: req.params.id, creator: req.userData.userId}, updatedPost).then((result) => {
        if (result.nModified > 0) {
            return resp.status(200).json({message: 'Post updated successfully'});
        } else {
            return resp.status(401).json({message: 'Unathorized post access!'});
        }
    });
});

router.get('', (req, resp, next) =>{
    const posts = [
        {title: 'Post Title1', content: 'Post Content1', id: 1},
        {title: 'Post Title2', content: 'Post Content2', id: 2},
        {title: 'Post Title3', content: 'Post Content3', id: 3},
    ];
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = PostModel.find(); // we want to chain the DB query and skip/limit if we have req query parameters
    let fetchedPosts;
    if (pageSize && currentPage) { //if they both are NOT undefined
        postQuery.skip(pageSize * (currentPage - 1)) // we want to skip the items of the previous pages. If we're on page3 we want to skip elements of page 1 and 2
        .limit(pageSize); // limit to pageSize
        console.log('Limiting the query to fetch all posts...');
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return PostModel.countDocuments();
    })
    .then(count => {
        //console.log('Fetching all posts');
        //console.log(documents);
        console.log('Posts count = ' + count);
        return resp.status(200).json({message: 'Posts fetched successfully', posts: fetchedPosts, maxPosts: count});
    })
    .catch((error) => {
        console.log('Unable to find all posts due to ' + error.message);
    });

    //return resp.status(200).json({message: 'Posts fetched successfully', posts:posts});
});

router.get('/:id', (req, resp, next) => {
    const postId = req.params.id;
    PostModel.findById(postId).then((post) => {
        if(post){
            // console.log(post);
            return resp.status(200).json(post);
        } else {
            return resp.status(404).json({message: 'Post not found'});
        }
    });
});

router.delete('/:id', checkAuth, (req, resp, next) => {
    let id = req.params.id;
    console.log('About to delete post with id :' + id);
    console.log (id + "/" + req.userData.userId);
    PostModel.deleteOne({_id: id, creator: req.userData.userId})
        .then((result) => {
            console.log(result);
            if (result.n > 0) {
                return resp.status(200).json({message: `Post ${id} deleted successfully`});
            } else {
                return resp.status(401).json({message: 'Unathorized delete post access!'});
            }
        })
        .catch((error) => {
            console.log('Unable to delete a post due to ' + error.message);
        });
});

module.exports = {
    router
}
