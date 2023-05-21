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
                    console.log(data);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
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
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${i.id}">X</a>
                        </small>

                        <small>
                        ${i.user.name}
                        </small>
                        <br>
                        ${i.content}
                    </p>
                    <div class="post-comment-container">
                        <form action="/comments/create" method="post">
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

    createPost();
}