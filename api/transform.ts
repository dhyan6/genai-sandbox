import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { CapabilityType } from '../src/types';

// Check if API key is present
if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getPromptForCapability = (text: string, capability: { type: CapabilityType }): string => {
    switch (capability.type) {
        case CapabilityType.Summarization:
            return `Summarize the main idea and key points in one sentence. Start your response with a bold header 'Summarize'.\n\n${text}`;
        case CapabilityType.Categorization:
            return `Identify 3-4 key topics and themes, explaining each in a brief sentence. Start your response with a bold header 'Categorize' and format each topic title in bold.\n\n${text}`;
        case CapabilityType.Analysis:
            return `Provide a 2-3 line analysis of the text. Start your response with a bold header 'Analyze'.\n\n${text}`;
        case CapabilityType.KeywordExtraction:
            return `List some essential keywords with a very brief explanation for each. Start your response with a bold header 'Extract Keywords'.\n\n${text}`;
        case CapabilityType.SentimentAnalysis:
            return `Describe the emotional tone of this text in a few words. Start your response with a bold header 'Analyze Sentiment'.\n\n${text}`;
        default:
            return `Please analyze and transform the following text:\n\n${text}`;
    }
};

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    console.log('API request received:', {
        method: request.method,
        body: request.body,
        headers: request.headers
    });

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not set');
        return response.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    try {
        const { text, capability } = request.body;

        if (!text || !capability) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        console.log('Processing request with:', { text, capability });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant that specializes in text transformation.',
                },
                {
                    role: 'user',
                    content: getPromptForCapability(text, capability),
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        console.log('OpenAI API response received');

        const transformedText = completion.choices[0].message?.content?.trim();
        if (!transformedText) {
            throw new Error('No response content from OpenAI');
        }

        const result = {
            transformedText,
            originalText: text,
            appliedCapabilities: [capability],
            timestamp: new Date(),
        };

        console.log('Sending response:', result);
        return response.status(200).json(result);
    } catch (error: any) {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        // Handle OpenAI API specific errors
        if (error.response?.status === 401) {
            return response.status(500).json({ error: 'Invalid OpenAI API key' });
        }

        return response.status(500).json({ 
            error: error.response?.data?.error || error.message || 'Failed to transform text' 
        });
    }
} 