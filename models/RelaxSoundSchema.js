const mongoose = require("mongoose");

const SoundSchema = new mongoose.Schema({
    soundFile: {
        type: String,
    },
    soundFilePic: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});


const DreamAppRelaxSounds = mongoose.model('DreamAppRelaxSounds', SoundSchema);

module.exports = DreamAppRelaxSounds