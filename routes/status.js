const express = require('express');
const ImageModel = require('../models/ImageModel');
const router = express.Router();

router.get('/:requestId', async (req, res) => {
    const data = await ImageModel.findOne({ requestId: req.params.requestId });
    if (!data) return res.status(404).json({ error: 'Request ID not found' });
    res.json(data);
});

module.exports = router;
