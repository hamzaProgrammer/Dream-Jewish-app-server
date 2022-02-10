const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    otpCode: {
        type: Number,
        default : null
    },
    codeSentTime: {
        type: Date,
        default : null
    },
    verifyStatus: {
        type: Boolean,
        default : 'false'
    },
}, {
    timestamps: true
});


const DreamAppUsers = mongoose.model('DreamAppUsers', UserSchema);

module.exports = DreamAppUsers