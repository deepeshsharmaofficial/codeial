const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
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
    // Post.find({})
    // .populate('user')
    // .populate({
    //     path: 'comments',
    //     populate: {
    //         path: 'user'
    //     }
    // })
    // .exec(function(err, posts){
    //     User.find({}, function(err, users) {
    //         return res.render('home', {
    //             title: 'Home',
    //             post_list: posts,
    //             all_users: users
    //         });
    //     })
    // })

    try {
        // using async statement
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            options: {
                sort: {createdAt : -1}
            }
        });
    
        let users = await User.find({});

        return res.render('home', {
            title: 'Home',
            post_list: posts,
            all_users: users
        });
    } catch(err) {
        console.log("Error", err);
        return;
    }

}

// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();
// posts.then()