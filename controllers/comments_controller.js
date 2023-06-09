const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req, res){
    // Post.findById(req.body.post, function(err, post){
    //     if(post) {
    //         Comment.create({
    //             content: req.body.content,
    //             post: req.body.post,
    //             user: req.user._id
    //         }, function(err, comment){
    //             if(err){
    //                 console.log('Error in doing comment:', err);
    //                 return res.redirect('back');
    //             }
    //             console.log('Comment created successfully:', comment);
                
    //             post.comments.push(comment);
    //             post.save();
                
    //             res.redirect('/');
    //         });
    //     }
    // });

    try {
        let post = await Post.findById(req.body.post);

        if(post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }); 
            
            post.comments.push(comment);
            post.save();



            comment = await comment
            .populate('user', ['name', 'avatar', 'email'])
            .execPopulate();

            // commentsMailer.newComment(comment);
            let job = await queue.create('emails', comment).save(function(err){
                if(err) {
                    console.log('error in creaing a queue ', err);
                    return;
                }

                console.log('job enqueued ', job.id);
            });

            queue.inactiveCount((err, count) => {
                if (err) throw err;
              
                console.log(`Accepted tasks: ${count}`);
            });

            queue.activeCount((err, count) => {
                if (err) throw err;
              
                console.log(`Remaining Accepted tasks: ${count}`);
            });
            
            if(req.xhr) {

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }


            req.flash('success', 'Comment Published!');
            res.redirect('/');
        }
    } catch(err) {
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }
}

// module.exports.destroy = function(req, res) {
//     Comment.findById(req.params.id, function(err, comment) {
//         Post.findById(comment.post, function(err, post) {
//             if((comment.user == req.user.id) || (post.user == req.user.id)) {
//                 let postId = comment.post;
                
//                 comment.remove();

//                 Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, function(err, post){
//                     return res.redirect('back');
//                 })
//             } else {
//                 return res.redirect('back');
//             }
//         })
//     });
// }

module.exports.destroy = async function(req, res) {
    
    try {
        let comment = await Comment.findById(req.params.id);
        let post = Post.findById(comment.post);
    
        if((comment.user == req.user.id) || (post.user == req.user.id)) {
            let postId = comment.post;
            
            comment.remove();
    
            let post = Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
            
            // send the comment id which was deleted back to the views
            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment Deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }
    } catch(err) {
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }

}