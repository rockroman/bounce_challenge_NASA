import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai';

dotenv.config();

const app = express();

// Basic middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173' // Vite's default dev port
}));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'NASA Explorer API is running' });
});

// NASA APOD API endpoint
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

// Mars Rover Photos API endpoint
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

// Image Analysis endpoint
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

        // GPT-4o-mini pricing: $0.00015 per 1K prompt tokens, $0.0006 per 1K completion tokens
        const promptCost = (promptTokens / 1000) * 0.00015;
        const completionCost = (completionTokens / 1000) * 0.0006;
        const totalCost = promptCost + completionCost;

        // Convert USD to EUR (approximate conversion rate)
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('GET / - Test endpoint');
    console.log('GET /api/apod - NASA Picture of the Day');
    console.log('GET /api/mars-photos - Mars Rover Photos');
    console.log('POST /api/analyze-image - Analyze astronomy images');
});

