const mongoose = require("mongoose");

const JournelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    dreamType: {
        type: String,
    },
    mood: {
        type: String,
    },
    clearity: {
        type: String,
    },
    datePost: {
        type: Date,
        required: true,
    },
    searchDate: {
        type: String,
        required: true,
    },
    timePost: {
        type: String,
        required: true,
    },
    dreamTime: {
        type: String,
        required: true,
    },
    quality: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'dreamappusers',
    },
}, {
    timestamps: true
});


const DreamAppJournels = mongoose.model('DreamAppJournels', JournelSchema);

module.exports = DreamAppJournels