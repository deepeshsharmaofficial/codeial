const express = require('express');

const router = express.Router();
const userApi = require('../../../controllers/api/v1/users_api');

/* when a client sends a POST request to the /create-session endpoint,
the createSession function from the userApi module will be invoked
to handle the request. 
*/
router.post('/create-session', userApi.createSession);


module.exports = router;