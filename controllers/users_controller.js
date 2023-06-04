const User = require('../models/user')
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res) {
    // res.end('<h1>User Profile</h1>');
    User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', { // ejs file - user_profile
            title: 'Profile',
            profile_user: user    
        })
    });
}

module.exports.update = async function(req, res) {
    // if(req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    //         req.flash('success', 'Profile Updated Successfully!');
    //         return res.redirect('back');
    //     });
    // } else {
    //     req.error('error', 'Error in Updating the Profile');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id) {

        try {
            let user = await User.findById(req.params.id);

            // I won't be able to access it directly from request.params
            // because this is a multi-part form.
            // my bodyparser is not able to parse it because this is a multi-part form
            User.uploadedAvatar(req, res, function(err){
                if(err) {
                    console.log('*****Multer Error: ', err);
                    req.flash('error', 'Error in Uploading Avatar');
                    return res.redirect('back');
                }

                console.log(req.file);
                
                user.name = req.body.name;
                user.email = req.body.email;

                // We are going to update it only when user is sending it.
                if(req.file) {
                    const imagePath = path.join(__dirname, '..', user.avatar);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user.
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save(function(err) {
                    if (err) {
                        req.flash('error', 'Error in Saving User');
                        return res.redirect('back');
                    }
                    req.flash('success', 'Profile Updated Successfully!');
                    return res.redirect('back');
                });

            });


        } catch(err) {
            req.flash('error', err);
            return res.redirect('back');
        }

    } else {
        req.error('error', 'Error in Updating the Profile');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign Up page
module.exports.signUp = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    })
}

// render the sign In page
module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    })
}

// get the sign up data
module.exports.create = function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err) {console.log('error in finding user in signing up'); return}

        if(!user) {
            // Create the user
            User.create(req.body, function(err, user){
                if(err) {console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    })
}

// sign in and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    console.log('Log Out')
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have Logged Out!');
        res.redirect('/');
    });
}