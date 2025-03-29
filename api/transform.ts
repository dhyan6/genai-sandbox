import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { CapabilityType } from '../src/types';

console.log('Initializing API endpoint...');
console.log('Available CapabilityTypes:', Object.values(CapabilityType));

// Check if API key is present and log its status (but not the key itself)
const apiKeyStatus = process.env.OPENAI_API_KEY ? 'present' : 'missing';
console.log('OpenAI API Key status:', apiKeyStatus);

let openai: OpenAI;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');
} catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    throw error;
}

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

const handler = async (request: VercelRequest, response: VercelResponse) => {
    try {
        console.log('API request received:', {
            method: request.method,
            headers: {
                'content-type': request.headers['content-type'],
                'user-agent': request.headers['user-agent']
            },
            body: JSON.stringify(request.body, null, 2)
        });

        if (request.method !== 'POST') {
            console.log('Method not allowed:', request.method);
            return response.status(405).json({ error: 'Method not allowed' });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('OpenAI API key is missing');
            return response.status(500).json({ error: 'OpenAI API key is not configured' });
        }

        const { text, capability } = request.body;

        console.log('Received capability:', JSON.stringify(capability, null, 2));
        console.log('Capability type:', capability?.type);

        // Validate request body
        if (!text) {
            console.error('Missing text in request body');
            return response.status(400).json({ error: 'Missing text in request body' });
        }
        if (!capability) {
            console.error('Missing capability in request body');
            return response.status(400).json({ error: 'Missing capability in request body' });
        }
        if (!capability.type) {
            console.error('Missing capability type');
            return response.status(400).json({ error: 'Missing capability type' });
        }

        // Validate capability type against enum
        const validTypes = Object.values(CapabilityType);
        if (!validTypes.includes(capability.type)) {
            console.error('Invalid capability type:', capability.type);
            console.error('Expected one of:', validTypes);
            return response.status(400).json({ 
                error: 'Invalid capability type',
                received: capability.type,
                expected: validTypes
            });
        }

        console.log('Processing request with capability:', capability.type);

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
        }).catch(error => {
            console.error('OpenAI API Error:', {
                message: error.message,
                type: error.type,
                status: error.status,
                code: error.code,
                stack: error.stack
            });
            throw error;
        });

        console.log('OpenAI API response received:', {
            status: 'success',
            choicesLength: completion.choices.length
        });

        const transformedText = completion.choices[0].message?.content?.trim();
        if (!transformedText) {
            console.error('No response content from OpenAI');
            throw new Error('No response content from OpenAI');
        }

        const result = {
            transformedText,
            originalText: text,
            appliedCapabilities: [capability],
            timestamp: new Date(),
        };

        console.log('Sending successful response');
        return response.status(200).json(result);
    } catch (error: any) {
        console.error('API Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
            status: error.response?.status,
            code: error.code,
            type: error.type
        });

        // Handle OpenAI API specific errors
        if (error.response?.status === 401) {
            return response.status(500).json({ 
                error: 'Invalid OpenAI API key',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        return response.status(500).json({ 
            error: error.response?.data?.error || error.message || 'Failed to transform text',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            type: error.type,
            code: error.code
        });
    }
};

export default handler; 