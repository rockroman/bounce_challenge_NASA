import express from 'express';
import axios from 'axios';
import { calculateTokenUsage } from '../utils/openAiUtils.js';
import cache from '../utils/cache.js';
import openai from '../utils/openAiConfig.js';

const router = express.Router();

/**
 * Image Search endpoint
 * NLP queries and searches NASA's image database
 */
router.post('/image-search', async (req, res) => {
    try {
        const { query, page = 1, perPage = 10 } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'No search query in request body' });
        }

        // Checking cache
        const cacheKey = `query_${ query }_${ page }_${ perPage }`;
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
                    content: `You are a NASA image search expert. Analyze natural language queries and extract precise search parameters.`
                },
                {
                    role: "user",
                    content: query
                }
            ],
            response_format: { type: "json_object" }
        });

        const usage = calculateTokenUsage(aiResponse.usage);
        const searchParams = JSON.parse(aiResponse.choices[0].message.content);

        if (!searchParams.keywords || searchParams.keywords.length === 0) {
            return res.status(400).json({
                error: "Invalid search query",
                details: "Could not extract any searchable keywords. Please try a more specific search term."
            });
        }

        const nasaParams = {
            q: searchParams.keywords.join(' '),
            media_type: searchParams.mediaType || 'image',
            page: page,
            page_size: searchParams.limit || perPage
        };

        const yearRegex = /^\d{4}$/;
        if (searchParams.yearStart && yearRegex.test(searchParams.yearStart)) {
            nasaParams.year_start = searchParams.yearStart;
        }
        if (searchParams.yearEnd && yearRegex.test(searchParams.yearEnd)) {
            nasaParams.year_end = searchParams.yearEnd;
        }

        const nasaResponse = await axios.get('https://images-api.nasa.gov/search', {
            params: nasaParams
        });

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
            results: formattedResults.slice(0, Math.min(searchParams.limit || 10, 10)),
            query: searchParams,
            totalResults: nasaResponse.data.collection.metadata.total_hits,
            page: page,
            perPage: Math.min(searchParams.limit || 10, 10),
            tokenUsage: usage
        };

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

export default router;