const mongoose = require("mongoose");

const DreamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'dreamappsubcates'
    },
}, {
    timestamps: true
});


const DreamAppDreams = mongoose.model('DreamAppDreams', DreamSchema);

module.exports = DreamAppDreams