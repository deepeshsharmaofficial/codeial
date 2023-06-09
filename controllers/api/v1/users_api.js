const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res) {
    /* whenever a user name and password is received,
    We need to find that user and generate the Json Web Token
    corresponding to that user.
    */

    try {
        let user = await User.findOne({
            email: req.body.email
        })

        // if user password doesn't match
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: 'Invalid username or password'
            });
        }

        // if user has been found
        return res.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe!',
            data : {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '100000'})
            }
        })


    } catch(err) {
        console.log('err', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }

}





