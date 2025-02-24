const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    requestId: String,
    productName: String,
    inputImageUrls: [String],
    outputImageUrls: [String],
    status: { type: String, default: 'Processing' }
});

module.exports = mongoose.model('Image', ImageSchema);
