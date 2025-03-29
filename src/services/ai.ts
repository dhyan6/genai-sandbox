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
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Response received:', response.data);
        return response.data;
    } catch (error: any) {
        // Log detailed error information
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
        });

        // If we have a specific error message from the server, use it
        if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }

        // Otherwise, provide a more detailed error message
        throw new Error(`Failed to transform text: ${error.message}`);
    }
}; 