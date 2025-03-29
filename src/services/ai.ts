import axios from 'axios';
import { Capability, TransformationResult } from '../types';

export const transformText = async (
    text: string,
    capability: Capability
): Promise<TransformationResult> => {
    try {
        // Get the base URL in production, or use relative URL in development
        const baseURL = import.meta.env.PROD ? window.location.origin : '';
        const url = `${baseURL}/api/transform`;
        
        console.log('Making request to:', url);
        console.log('Request payload:', { text, capability });
        
        const response = await axios.post(url, {
            text,
            capability,
        });

        if (!response.data) {
            throw new Error('No response from server');
        }

        console.log('Response received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.error || 'Failed to transform text. Please try again.');
    }
}; 