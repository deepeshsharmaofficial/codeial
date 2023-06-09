const express = require('express');

const router = express.Router();
const passport = require('passport');
const postsApi = require("../../../controllers/api/v1/posts_api");

router.get('/', postsApi.index);

// I am setting the session to be false because I don't want session cookies to be generated
// This will put an authentication check over my passport.
router.delete('/:id', passport.authenticate('jwt', {session: false}) ,postsApi.destroy);


/* I also need to check if this authentication is working for this We will need a couple of things.

1. The authentication token jwt for the user, once that user session has been created.
2. Post which needs to be deleted
*/

module.exports = router;