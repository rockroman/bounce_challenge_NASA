import express from 'express';
import { calculateTokenUsage } from '../utils/openAiUtils.js';
import openai from '../utils/openAiConfig.js';

const router = express.Router();


/**
 * Image Analysis endpoint
 */
router.post('/analyze-image', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing imageUrl in request body' });
        }

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

        const usage = calculateTokenUsage(response.usage);

        res.json({
            description: response.choices[0].message.content,
            usage
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

export default router;