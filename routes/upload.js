const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const ImageModel = require('../models/ImageModel');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const requestId = uuidv4();
    const filePath = req.file.path;
    const csvData = fs.readFileSync(filePath, 'utf-8').split('\n').slice(1);
    
    for (let row of csvData) {
        if (!row) continue;
        const [serial, productName, urls] = row.split(',');
        const inputUrls = urls.split('|');
        
        const newEntry = new ImageModel({ requestId, productName, inputImageUrls: inputUrls });
        await newEntry.save();

        // Process images
        const outputUrls = [];
        for (let url of inputUrls) {
            const imageName = path.basename(url);
            const outputPath = `output/${imageName}`;
            await sharp(url).jpeg({ quality: 50 }).toFile(outputPath);
            outputUrls.push(outputPath);
        }

        // Update DB
        await ImageModel.updateOne({ requestId }, { outputImageUrls: outputUrls, status: 'Completed' });
    }
    
    res.json({ requestId });
});

module.exports = router;
