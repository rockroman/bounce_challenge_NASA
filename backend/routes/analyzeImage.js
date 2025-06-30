import express from 'express';
import { calculateTokenUsage } from '../utils/openAiUtils.js';
import openai from '../utils/openAiConfig.js';

const router = express.Router();


/**
 * Image Analysis endpoint
 */
router.post('/analyze-image', async (req, res) => {
    try {
        const { imageUrl, imageTitle } = req.body;

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
                            text: `You are a NASA astronomy image analysis expert. Analyze the image titled "${ imageTitle || 'Unknown Title' }" and provide a detailed scientific analysis.
                            IMPORTANT RULES:
                            1. The image title "${ imageTitle || 'Unknown Title' }" must be used as the primary context for your analysis. Assume the title is accurate and directly related to the image.
                            2. Provide ONLY factual, accurate, and relevant information specific to this image and its title.
                            3. DO NOT include data or details that cannot be validated or are not directly related to the image title.
                            4. Avoid generic descriptions that could apply to other images.

                            STRUCTURE YOUR ANALYSIS AS FOLLOWS:
                            - Key Features: Describe the unique and observable features of the image based on the title.
                            - Scientific Context: Explain the scientific significance of the features and their relevance to astronomy.
                            - Observational Techniques: Mention how such images are typically captured or studied.

                            Focus on the specific details of the image and ensure your analysis is precise and verifiable.`
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