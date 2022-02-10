const mongoose = require("mongoose");

const MainCateSchema = new mongoose.Schema({
    alphabet: {
        type: String,
        required: true,
    },
    subCate: [{
        type: mongoose.Types.ObjectId,
        ref: 'dreamappsubcate'
    }],
}, {
    timestamps: true
});


const DreamAppMainCate = mongoose.model('DreamAppMainCate', MainCateSchema);

module.exports = DreamAppMainCate