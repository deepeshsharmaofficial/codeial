// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{
    
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId) {
        this.postId = postId;
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

    }

    // method to submit the form data for new post's comment using AJAX
    createComment(postId) {
        let pSelf = this
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data) {
                    console.log("Comment -> ",data);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post's comment in DOM
    newCommentDom(comment) {
        return $(`<li id="comment-${comment._id}">
                    <p>
                        <small>
                            <a href="/comments/destroy/${comment._id}">X</a>
                        </small>
                        
                        <small>
                            ${comment.user.name}
                        </small>
                        <br>
                        ${comment.content}
                    </p>
                </li>`
            );
    }

};
