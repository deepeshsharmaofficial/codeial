const User = require('../models/user')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const forgotPasswordMailer = require('../mailers/forgot_password_mailer');
const Token = require('../models/token');

module.exports.profile = function(req, res) {
    // res.end('<h1>User Profile</h1>');
    User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', { // ejs file - user_profile
            title: 'Profile',
            profile_user: user    
        })
    });
}

// Forgot password - Render forgot password page
module.exports.forgotPassword = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    
    res.render('forgot_password', {
      title: 'Forgot Password'
    });
}

// Forgot password - Send reset password email
module.exports.resetPassword = async function(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            req.flash('error', 'User with that email address does not exist');
            return res.redirect('back');
        }

        // Generate a unique reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Save the reset token in the Token collection
        await Token.create({
            userId: user._id,
            token: resetToken
        });
  
        // Send an email to the user with the reset token and instructions on how to reset their password
        forgotPasswordMailer.newForgetPassword(req, resetToken ,user);
    
        req.flash('success', 'An email has been sent to ' + user.email + ' with further instructions.');
        return res.redirect('/users/sign-in');
    } catch (err) {
        console.log('Error in resetting password*********************',err);
        req.flash('error', 'Error in resetting password');
        return res.redirect('back');
    }
}

// Reset password - Render reset password page
module.exports.showResetPasswordForm = async function(req, res) {
    try {
      const token = await Token.findOne({ token: req.params.token });
  
      if (!token) {
        req.flash('error', 'Invalid or expired token!');
        return res.redirect('/users/forgot-password');
      }
  
      const user = await User.findById(token.userId);
  
      res.render('reset_password', {
        title: 'Reset Password',
        token: req.params.token
      });
    } catch (err) {
      console.log(err);
      req.flash('error', 'Something went wrong!');
      return res.redirect('back');
    }
};

// Reset password - Update user password
module.exports.updatePassword = async function(req, res) {
    try {
      const token = await Token.findOne({ token: req.params.token });
  
      if (!token) {
        req.flash('error', 'Invalid or expired token!');
        return res.redirect('/users/forgot-password');
      }

      const user = await User.findById(token.userId);
  
      if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Password and confirm password do not match!');
        return res.redirect('back');
      }

      user.password = req.body.password;
      await user.save();
  
      // Delete the token
      await token.remove();
  
      req.flash('success', 'Password has been successfully reset. You can now log in with your new password.');
      return res.redirect('/users/sign-in');
    } catch (err) {
      console.log(err);
      req.flash('error', 'Something went wrong!');
      return res.redirect('back');
    }
};

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