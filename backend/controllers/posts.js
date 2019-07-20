const { PostModel } = require('../models/post');

var createPost = async(request, response, next) => {
    const url = `${request.protocol}://${request.get("host")}`;
    const post = new PostModel({
        title: request.body.title,
        content: request.body.content,
        imagePath: `${url}/images/${request.file.filename}`,
        creator: request.userData.userId
    });
    //return console.log(request.userData);
    try {
        const createdPost = await post.save();
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
    } catch(error) {
        response.status(500).json({message: 'Failed to create a post'});
    };
};

var editPost = async (req, resp, next) => {
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
    try {
        const result = await PostModel.updateOne({_id: req.params.id, creator: req.userData.userId}, updatedPost);
        if (result.nModified > 0) {
            return resp.status(200).json({message: 'Post updated successfully'});
        } else {
            return resp.status(401).json({message: 'Unathorized post access!'});
        }
    } catch(error) {
        return resp.status(500).json({message: 'Could would update post'});
    };
};

var getAllPosts = async (req, resp, next) =>{
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
        return resp.status(500).json({message: 'Unable to find all posts due to ' + error.message });
    });
    //return resp.status(200).json({message: 'Posts fetched successfully', posts:posts});
};

var getPost = async (req, resp, next) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById(postId);
        if (post){
            // console.log(post);
            return resp.status(200).json(post);
        } else {
            return resp.status(404).json({message: 'Post not found'});
        }
    } catch(error) {
        return req.status(500).json({error: 'Unable to get the post due to ' + error.message});
    };
};

var deletePost = async (req, resp, next) => {
    let id = req.params.id;
    console.log('About to delete post with id :' + id);
    console.log (id + "/" + req.userData.userId);
    try {
        const result = await PostModel.deleteOne({_id: id, creator: req.userData.userId});
        console.log(result);
        if (result.n > 0) {
            return resp.status(200).json({message: `Post ${id} deleted successfully`});
        } else {
            return resp.status(401).json({message: 'Unathorized delete post access!'});
        }
    } catch(error) {
        console.log('Unable to delete a post due to ' + error.message);
        return req.status(500).json({error: 'Unable to delete a post due to ' + error.message});
    };
};

module.exports = {
    createPost,
    editPost,
    getAllPosts,
    getPost,
    deletePost
}
