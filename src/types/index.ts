export type Capability = {
    id: string;
    name: string;
    description: string;
    type: CapabilityType;
    color: string;
};

export enum CapabilityType {
    Summarization = 'summarization',
    Categorization = 'categorization',
    Rewriting = 'rewriting',
    SentimentAnalysis = 'sentiment-analysis',
    ToneAdjustment = 'tone-adjustment',
    KeywordExtraction = 'keyword-extraction',
    Translation = 'translation',
    StyleAdaptation = 'style-adaptation'
}

export type TransformationResult = {
    originalText: string;
    transformedText: string;
    appliedCapabilities: Capability[];
    timestamp: Date;
}; 