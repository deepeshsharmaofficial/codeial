const Post = require('../models/post')
const Comment = require('../models/comment')

// creating Post
module.exports.create = async function(req, res){
    // if (!req.user || !req.user._id) {
    //     console.log('Error: User is not authenticated or does not have an _id');
    //     return res.redirect('back');
    // }

    // if (!req.body || !req.body.content) {
    //     console.log('Error: Request body is missing content');
    //     return res.redirect('back');
    // }

    // console.log('Creating a new post with content:', req.body.content);

    // Post.create({
    //     content: req.body.content,
    //     user: req.user._id
    // }, function(err, post){
    //     if(err){
    //         console.log('Error in creating a post:', err);
    //         return res.redirect('back');
    //     }

    //     console.log('Post created successfully:', post);
    //     return res.redirect('back');
    // });

    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post Published!');
        return res.redirect('back');

    } catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }

};

// module.exports.destroy = function(req, res) {
//     Post.findById(req.params.id, function(err, post) {
//         // .id means converting the object id into string
//         if(post.user == req.user.id) {
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 return res.redirect('back');
//             });
//         } else {
//             return res.redirect('back');
//         }
//     });
// }

module.exports.destroy = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id) {
            post.remove();
    
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
        
    } catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}