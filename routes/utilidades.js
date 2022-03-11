const express = require('express');
let router = express.Router();

router.get('/urn', (req, res) => {
    res.json({
        status: 'success',
        data: process.env.MODEL_URN
    });
});

module.exports = router;