const Post = require('../models/post');

module.exports.home = function(req, res) {
    console.log(req.cookies);
    // res.cookie('user_id', 25);
    // Post.find({}, function(err, post) {
    //     if(err) {
    //         console.log('error in fetching post from db');
    //         return;
    //     }
    //     return res.render('home', {
    //         title: 'Home',
    //         post_list: post
    //     });
    // });

    // populate the user of each post
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home', {
            title: 'Home',
            post_list: posts
        });
    })
}