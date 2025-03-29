export enum CapabilityType {
    Summarization = 'summarization',
    Categorization = 'categorization',
    Analysis = 'analysis',
    KeywordExtraction = 'keyword_extraction',
    SentimentAnalysis = 'sentiment_analysis'
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  type: CapabilityType;
  color: string;
  textColor: string;
}

export interface TransformationResult {
    result: string;
} 