import axios from 'axios';
import { Capability, TransformationResult } from '../types';
import { CapabilityType } from '../types';

const API_URL = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
    console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
}

const getPromptForCapability = (text: string, capability: Capability): string => {
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

export const transformText = async (
    text: string,
    capability: Capability
): Promise<TransformationResult> => {
    try {
        const response = await axios.post(
            API_URL,
            {
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
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            originalText: text,
            transformedText: response.data.choices[0].message.content.trim(),
            appliedCapabilities: [capability],
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Error transforming text:', error);
        throw new Error('Failed to transform text. Please try again.');
    }
}; 