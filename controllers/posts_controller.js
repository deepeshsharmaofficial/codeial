const Post = require('../models/post')

// creating Post
module.exports.create = function(req, res){
    if (!req.user || !req.user._id) {
        console.log('Error: User is not authenticated or does not have an _id');
        return res.redirect('back');
    }

    if (!req.body || !req.body.content) {
        console.log('Error: Request body is missing content');
        return res.redirect('back');
    }

    console.log('Creating a new post with content:', req.body.content);

    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){
            console.log('Error in creating a post:', err);
            return res.redirect('back');
        }

        console.log('Post created successfully:', post);
        return res.redirect('back');
    });
};