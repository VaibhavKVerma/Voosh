const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    bio: {
        type: String
    },
    phone: {
        type: String
    },
    photo_url: {
        type: String
    },
    is_public: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['normal', 'admin'],
        default: 'normal'
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
