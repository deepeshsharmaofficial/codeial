const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: '/images/default-avatar.png' // Set the default avatar path here
    }
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
        // callback(no error, pass as true)

    } else {
        req.flash('error', 'Error : Image Type should jpeg | jpg | png Only!');
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed.'));
    }
};

// Static methods - Static Function are the ones which can be called overall on the whole class
userSchema.statics.uploadedAvatar = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
      },
    fileFilter: fileFilter
}).single('avatar');

userSchema.statics.avatarPath = AVATAR_PATH; // I need this avatarPath to be available publicly for the user model

const User = mongoose.model('User', userSchema);

module.exports = User;