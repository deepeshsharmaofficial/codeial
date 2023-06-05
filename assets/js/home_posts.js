{
    // method to submit the form data for new post using AJAX
    let createPost = function() {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    console.log('Home Post Data ->',data);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
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

    // method to create a post in DOM
    let newPostDom = function(i) {
        return $(`<li id="post-${i._id}" class="post-list-container">
                    <p>
                        <img src="${i.user.avatar}" alt="${i.user.name}" width="50">
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${i._id}">X</a>
                        </small>

                        <small>
                        ${i.user.name}
                        </small>
                        <br>
                        ${i.content}
                    </p>
                    <div class="post-comment-container">
                        <form id="post-${ i._id }-comments-form" action="/comments/create" method="post">
                            <input type="text" name="content" class="input-text" placeholder="Type Here to add comment..." required>
                            <input type="hidden" name="post" value="${i._id}">
                            <input type="submit" value="Add Comment" class="submit-btn">
                        </form>
                
                        <div class="post-comments-list">
                            <ul id="post-comments-${i._id}">

                            </ul>
                        </div>
                    </div>
                </li>`
            )
    }

    // method to delete a post from DOM - Sending AJAX request
    let deletePost = function(deleteLink) {
        $(deleteLink).click(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
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

    /* loop over all the existing posts on the page
    (when the window loads for the first time) and
    call the delete post method on delete link of each,
    also add AJAX (using the class we've created) to the delete
    button of each
    */

    let convertPostsToAjax = function() {
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

             // get the post's id by splitting the id attribute
             let postId = self.prop('id').split("-")[1]
             new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}