const { OpenAI } = require('openai');
const { SYSTEM_PROMPT, CAPABILITY_PROMPTS } = require('../src/config/prompts');

const VALID_CAPABILITY_TYPES = {
    SUMMARIZATION: 'summarization',
    CATEGORIZATION: 'categorization',
    ANALYSIS: 'analysis',
    KEYWORD_EXTRACTION: 'keyword_extraction',
    SENTIMENT_ANALYSIS: 'sentiment_analysis'
};

console.log('Initializing API endpoint...');

// Check if API key is present and log its status (but not the key itself)
const apiKeyStatus = process.env.OPENAI_API_KEY ? 'present' : 'missing';
console.log('OpenAI API Key status:', apiKeyStatus);

async function handler(request, response) {
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
                error: `Invalid capability type. Expected one of: ${validTypes.join(', ')}`
            });
        }

        // Find the matching capability prompt
        const capabilityKey = Object.keys(VALID_CAPABILITY_TYPES).find(
            key => VALID_CAPABILITY_TYPES[key] === capabilityType
        );
        
        if (!capabilityKey || !CAPABILITY_PROMPTS[capabilityKey]) {
            console.error('No prompt found for capability:', capabilityType);
            return response.status(500).json({ error: 'Internal server error' });
        }

        // Get the prompt and replace the placeholder with the actual text
        const prompt = CAPABILITY_PROMPTS[capabilityKey].prompt.replace('{text}', text);

        console.log('Processing request with capability:', capabilityType);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        console.log('OpenAI API response received:', {
            status: 'success',
            choicesLength: completion.choices.length
        });

        const result = completion.choices[0].message.content;
        console.log('Sending successful response');
        return response.status(200).json({ result });

    } catch (error) {
        console.error('Error processing request:', error);
        return response.status(500).json({ error: 'Failed to process request' });
    }
}

module.exports = handler; 