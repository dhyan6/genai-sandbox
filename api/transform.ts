import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Configuration, OpenAIApi } from 'openai';
import { CapabilityType } from '../src/types';

const configuration = new Configuration({
    apiKey: process.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, capability } = request.body;

        if (!text || !capability) {
            return response.status(400).json({ error: 'Missing required fields' });
        }

        const completion = await openai.createChatCompletion({
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

        return response.status(200).json({
            transformedText: completion.data.choices[0].message?.content?.trim() || '',
            originalText: text,
            appliedCapabilities: [capability],
            timestamp: new Date(),
        });
    } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
        return response.status(500).json({ error: 'Failed to transform text' });
    }
} 