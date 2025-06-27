import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { popularSearchTerms } from './utils/suggestions.js';
import cache from "./utils/cache.js"
import apodRoutes from './routes/apod.js';
import analyzeImageRoutes from './routes/analyzeImage.js';
import imageSearchRoutes from './routes/imageSearch.js';

dotenv.config();

const app = express();


// Clean expired cache
setInterval(() => {
    for (let [key, value] of cache.data.entries()) {
        if (Date.now() - value.timestamp > cache.maxAge) {
            cache.data.delete(key);
        }
    }
    //every 5 min
}, 300000);


/**
 * Basic middleware
 */
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173'
}));
app.use(express.json());


/**
 * home route
 */
app.get('/', (req, res) => {
    res.json({ message: 'NASA Explorer API is running' });
});


/**
 * Imported routes
 */
app.use('/api', apodRoutes);
app.use('/api', imageSearchRoutes);
app.use('/api', analyzeImageRoutes);



/**
 * search suggestion lightweight endpoint using array
 */
app.get('/api/search-suggestions', async (req, res) => {

    try {
        const term = req.query.term?.toLowerCase() || '';
        const suggestions = popularSearchTerms.filter(item => item.toLowerCase().includes(term));
        res.json(suggestions);

    } catch (error) {

        console.error('Error details:', {
            message: error.message,
            status: error.status,
            response: error.response?.data,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to get suggestions',
            details: error.message
        });

    }

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`);
    console.log('Available endpoints:');
    console.log('GET / - Home endpoint');
    console.log('GET /api/apod - NASA Picture of the Day');
    console.log('GET /api/image-search - NLP search of images in NASA database ');
    console.log('POST /api/analyze-image - Analyze astronomy images');
    console.log('GET /api/search-suggestions - simulate  search suggestions ')
});

