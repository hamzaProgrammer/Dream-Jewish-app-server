const mongoose = require("mongoose");

const SubCateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    dreams: [{
        type: mongoose.Types.ObjectId,
        ref: 'dreamappdreams'
    }],
}, {
    timestamps: true
});


const DreamAppSubCate = mongoose.model('DreamAppSubCate', SubCateSchema);

module.exports = DreamAppSubCate