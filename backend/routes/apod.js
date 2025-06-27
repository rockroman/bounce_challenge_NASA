// /**
//  * NASA APOD API endpoint
//  */
// app.get('/api/apod', async (req, res) => {
//     try {
//         const response = await axios.get('https://api.nasa.gov/planetary/apod', {
//             params: {
//                 api_key: process.env.NASA_API_KEY
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'Failed to fetch APOD data' });
//     }
// });

import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * NASA APOD API endpoint
 */
router.get('/apod', async (req, res) => {
    try {
        const response = await axios.get('https://api.nasa.gov/planetary/apod', {
            params: {
                api_key: process.env.NASA_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch APOD data' });
    }
});

export default router;