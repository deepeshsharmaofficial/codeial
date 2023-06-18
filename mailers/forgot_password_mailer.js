const nodeMailer = require('../config/nodemailer');

exports.newForgetPassword = (req, resetToken, user) => {

    let htmlString = nodeMailer.renderTemplate({
        user: user,
        req: req,
        resetToken: resetToken
    }, '/users/new_reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from: 'deep921155@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: htmlString
        
    }, (err, info) => {
        if(err) {
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}