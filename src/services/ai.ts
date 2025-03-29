import axios from 'axios';
import { Capability, TransformationResult } from '../types';
import { CapabilityType } from '../types';

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
        const response = await axios.post('/api/transform', {
            text,
            capability,
        });

        if (!response.data) {
            throw new Error('No response from server');
        }

        return response.data;
    } catch (error: any) {
        console.error('Error transforming text:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to transform text. Please try again.');
    }
}; 