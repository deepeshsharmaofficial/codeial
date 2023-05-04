const Post = require('../models/post')

// creating Post
module.exports.create = function(req, res) {
    Post.create({
        content: req.body.content,
        user: req.user._id,
    }, function(err, newPost){
        if(err) {
            console.log('Error in creating a post', err);
            return;
        }
        console.log('*********', newPost);
        return res.redirect('back');
    });
}