const express = require('express');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const ImageModel = require('../models/ImageModel');
const router = express.Router();

router.get('/:requestId', async (req, res) => {
    const data = await ImageModel.findOne({ requestId: req.params.requestId });
    if (!data) return res.status(404).json({ error: 'Request ID not found' });

    const csvPath = `downloads/${req.params.requestId}.csv`;
    const csv = csvWriter({
        path: csvPath,
        header: [
            { id: 'serial', title: 'Serial Number' },
            { id: 'productName', title: 'Product Name' },
            { id: 'inputImageUrls', title: 'Input Image URLs' },
            { id: 'outputImageUrls', title: 'Output Image URLs' }
        ]
    });
    
    await csv.writeRecords([{ 
        serial: 1, 
        productName: data.productName, 
        inputImageUrls: data.inputImageUrls.join('|'), 
        outputImageUrls: data.outputImageUrls.join('|')
    }]);

    res.download(csvPath);
});

module.exports = router;
