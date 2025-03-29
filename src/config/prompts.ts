/**
 * Configuration file for AI capability prompts
 * Edit these prompts to modify how each capability processes text
 */

export const SYSTEM_PROMPT = "You are a helpful assistant that processes text based on specific capabilities.";

export const CAPABILITY_PROMPTS = {
    SUMMARIZATION: {
        type: 'summarization',
        prompt: `Start your response with a bold header 'Summarization'.Summarize the main idea and key points in one sentence:

{text}`
    },
    
    CATEGORIZATION: {
        type: 'categorization',
        prompt: `Start your response with a bold header 'Categorization'. In bullet points, identify 3-4 key topics and themes from the text, explaining each in a brief sentence using this format:

- Topic 1: [Brief explanation of topic 1]
- Topic 2: [Brief explanation of topic 2]
- Topic 3: [Brief explanation of topic 3]
- Topic 4: [Brief explanation of topic 4]

{text}`
    },
    
    ANALYSIS: {
        type: 'analysis',
        prompt: `Start your response with a bold header 'Analysis'.Provide a 2-3 line analysis of the text:

{text}`
    },
    
    KEYWORD_EXTRACTION: {
        type: 'keyword_extraction',
        prompt: `Start your response with a bold header 'Keyword Extraction'. List 4-5 key keywords from the text separated by commas:

{text}`
    },
    
    SENTIMENT_ANALYSIS: {
        type: 'sentiment_analysis',
        prompt: `Start your response with a bold header 'Sentiment Analysis'. Describe the emotional tone of this text in a brief insightfulsentence:

{text}`
    }
}; 