import { type VercelRequest, type VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

console.log('Initializing API endpoint...');

// Define valid capability types as strings
const VALID_CAPABILITY_TYPES = {
    SUMMARIZATION: 'summarization',
    CATEGORIZATION: 'categorization',
    ANALYSIS: 'analysis',
    KEYWORD_EXTRACTION: 'keyword_extraction',
    SENTIMENT_ANALYSIS: 'sentiment_analysis'
} as const;

type ValidCapabilityType = typeof VALID_CAPABILITY_TYPES[keyof typeof VALID_CAPABILITY_TYPES];

console.log('Valid capability types:', Object.values(VALID_CAPABILITY_TYPES));

// Check if API key is present and log its status (but not the key itself)
const apiKeyStatus = process.env.OPENAI_API_KEY ? 'present' : 'missing';
console.log('OpenAI API Key status:', apiKeyStatus);

const getPromptForCapability = (text: string, capability: { type: string }): string => {
    const type = capability.type.toLowerCase();
    switch (type) {
        case VALID_CAPABILITY_TYPES.SUMMARIZATION:
            return `Summarize the main idea and key points in one sentence. Start your response with a bold header 'Summarize'.\n\n${text}`;
        case VALID_CAPABILITY_TYPES.CATEGORIZATION:
            return `Identify 3-4 key topics and themes, explaining each in a brief sentence. Start your response with a bold header 'Categorize' and format each topic title in bold.\n\n${text}`;
        case VALID_CAPABILITY_TYPES.ANALYSIS:
            return `Provide a 2-3 line analysis of the text. Start your response with a bold header 'Analyze'.\n\n${text}`;
        case VALID_CAPABILITY_TYPES.KEYWORD_EXTRACTION:
            return `List some essential keywords with a very brief explanation for each. Start your response with a bold header 'Extract Keywords'.\n\n${text}`;
        case VALID_CAPABILITY_TYPES.SENTIMENT_ANALYSIS:
            return `Describe the emotional tone of this text in a few words. Start your response with a bold header 'Analyze Sentiment'.\n\n${text}`;
        default:
            return `Please analyze and transform the following text:\n\n${text}`;
    }
};

const handler = async (request: VercelRequest, response: VercelResponse) => {
    console.log('API request received:', {
        method: request.method,
        headers: {
            'content-type': request.headers['content-type'],
            'user-agent': request.headers['user-agent']
        },
        body: JSON.stringify(request.body, null, 2)
    });

    try {
        if (request.method !== 'POST') {
            console.log('Method not allowed:', request.method);
            return response.status(405).json({ error: 'Method not allowed' });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('OpenAI API key is missing');
            return response.status(500).json({ error: 'OpenAI API key is not configured' });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

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

        // Convert capability type to lowercase for comparison
        const capabilityType = capability.type.toLowerCase();
        const validTypes = Object.values(VALID_CAPABILITY_TYPES);
        
        console.log('Normalized capability type:', capabilityType);
        console.log('Valid types:', validTypes);
        
        if (!validTypes.includes(capabilityType)) {
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

export { handler as default }; 