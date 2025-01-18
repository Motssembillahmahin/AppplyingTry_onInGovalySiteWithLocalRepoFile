const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const axios = require('axios');
const fs = require('fs/promises');

const router = express.Router();

// Configure Multer
const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary
cloudinary.config({
    cloud_name: '',
    api_key: '', 
    api_secret: '', // Replace with your API secret
});

// API Endpoint for Try-On
router.post('/try-on', upload.single('personImage'), async (req, res) => {
    const { garmentImageUrl } = req.body;
    const personImage = req.file;

    if (!personImage) {
        return res.status(400).json({ error: 'Person image is required.' });
    }
    if (!garmentImageUrl) {
        return res.status(400).json({ error: 'Garment image URL is required.' });
    }

    try {
        // Upload the person image to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(personImage.path, {
            folder: 'try-on',
        });
        const personImageUrl = cloudinaryResult.secure_url;

        // Call Pixelcut API
        const requestBody = {
            person_image_url: personImageUrl,
            garment_image_url: garmentImageUrl,
        };

        const response = await axios.post('https://api.developer.pixelcut.ai/v1/try-on', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': '', // Replace with your external API key
            },
        });

        res.json({ tryOnImageUrl: response.data.result_url });

        // Cleanup
        await fs.unlink(personImage.path);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to process try-on.' });
    }
});

module.exports = router;
