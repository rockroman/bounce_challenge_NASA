import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai';



dotenv.config();

const app = express();

//in-memory cache implementation
const cache = {
    data: new Map(),
    // 1 hour(milliseconds)
    maxAge: 3600000,
    set: function(key, value) {
        this.data.set(key, {
            value,
            timestamp: Date.now()
        });
    },
    get: function(key) {
        const item = this.data.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.maxAge) {
            this.data.delete(key);
            return null;
        }

        return item.value;
    },
    clear: function() {
        this.data.clear();
    }
};

// Clean up expired cache entries periodically
setInterval(() => {
    for (let [key, value] of cache.data.entries()) {
        if (Date.now() - value.timestamp > cache.maxAge) {
            cache.data.delete(key);
        }
    }
// Runing every 5 minutes
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

//
/**
 * OpenAI
 */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

//
/**
 * home route
 */
app.get('/', (req, res) => {
    res.json({ message: 'NASA Explorer API is running' });
});

//
/**
 * NASA APOD API endpoint
 */
app.get('/api/apod', async (req, res) => {
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

//
/**
 * Mars Rover Photos API endpoint
 */
app.get('/api/mars-photos', async (req, res) => {
    try {
        const { sol = 1000, rover = 'curiosity', camera = 'NAVCAM' } = req.query;
        const response = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`, {
            params: {
                sol,
                camera,
                api_key: process.env.NASA_API_KEY,
                page: 1,
                per_page: 12
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch Mars photos' });
    }
});

//
/**
 * Image Analysis endpoint
 */
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing imageUrl in request body' });
        }

        console.log('Analyzing image:', imageUrl);
        console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please describe this NASA astronomy image in scientific detail."
                        },
                        {
                            type: "image_url",
                            image_url: { url: imageUrl }
                        }
                    ]
                }
            ],
            max_completion_tokens: 500
        });

        const promptTokens = response.usage?.prompt_tokens || 0;
        const completionTokens = response.usage?.completion_tokens || 0;
        const totalTokens = response.usage?.total_tokens || 0;

        // GPT-4o-mini pricing
        const promptCost = (promptTokens / 1000) * 0.00015;
        const completionCost = (completionTokens / 1000) * 0.0006;
        const totalCost = promptCost + completionCost;

        // USD to EUR
        const usdToEur = 0.92;
        const totalCostEur = totalCost * usdToEur;

        console.log('Token Usage:', {
            promptTokens,
            completionTokens,
            totalTokens,
            costUSD: totalCost.toFixed(6),
            costEUR: totalCostEur.toFixed(6)
        });

        res.json({
            description: response.choices[0].message.content,
            usage: {
                promptTokens,
                completionTokens,
                totalTokens,
                costUSD: totalCost.toFixed(6),
                costEUR: totalCostEur.toFixed(6)
            }
        });

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            response: error.response?.data,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to analyze image',
            details: error.message
        });
    }
});


/**
 * Image Search endpoint
 * NLP queries and searches NASA's image database
 */
app.post('/api/image-search', async (req, res) => {
    try {
        const { query, page = 1, perPage = 20 } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'No search query in request body' });
        }

        // Checking cache
        const cacheKey = `query_${query}_${page}_${perPage}`;
        const cachedResult = cache.get(cacheKey);

        if (cachedResult) {
            console.log('Cache hit for query:', query);
            return res.json(cachedResult);
        }

        // NLP query with OpenAI
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a senior NASA image search assistant.
                     your job si to Extract key search terms and parameters from natural language queries.
                      Return ONLY a JSON object with:
                      - keywords (array of strings),
                      - yearStart (YYYY, optional),
                      - yearEnd (YYYY, optional),
                      - mediaType (image/video/audio, optional).`
                },
                {
                    role: "user",
                    content: query
                }
            ],
            response_format: { type: "json_object" }
        });

        // Parsing AI response
        const searchParams = JSON.parse(aiResponse.choices[0].message.content);

        // Search NASA's image library
        const nasaResponse = await axios.get('https://images-api.nasa.gov/search', {
            params: {
                q: searchParams.keywords.join(' '),
                media_type: searchParams.mediaType || 'image',
                year_start: searchParams.yearStart,
                year_end: searchParams.yearEnd,
                page: page,
                page_size: perPage
            }
        });

        // Process and format the response
        const formattedResults = nasaResponse.data.collection.items.map(item => {
            const data = item.data[0];
            const links = item.links || [];
            return {
                title: data.title,
                description: data.description,
                dateCreated: data.date_created,
                nasaId: data.nasa_id,
                thumbnail: links.find(link => link.rel === 'preview')?.href,
                imageUrl: links.find(link => link.rel === 'orig')?.href,
                mediaType: data.media_type
            };
        });

        const result = {
            results: formattedResults,
            query: searchParams,
            totalResults: nasaResponse.data.collection.metadata.total_hits,
            page: page,
            perPage: perPage
        };

        // Caching the results
        cache.set(cacheKey, result);

        res.json(result);

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            response: error.response?.data,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to search for images',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('GET / - Home endpoint');
    console.log('GET /api/apod - NASA Picture of the Day');
    console.log('GET /api/mars-photos - Mars Rover Photos');
    console.log('POST /api/analyze-image - Analyze astronomy images');
});

