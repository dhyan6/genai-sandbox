import axios from 'axios';
import { Capability, TransformationResult } from '../types';

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