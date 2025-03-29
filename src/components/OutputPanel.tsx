import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { TransformationResult } from '../types';
import ReactMarkdown from 'react-markdown';

interface OutputPanelProps {
    result: TransformationResult | null;
}

const PanelContainer = styled(motion.div)`
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    font-family: 'Geist', sans-serif;
    transition: background-color 0.3s ease;
`;

const Header = styled.div<{ $bgColor?: string }>`
    padding: 16px 20px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #1a1a1a;
    background: ${props => props.$bgColor || '#f9f9f9'};
`;

const Content = styled.div`
    min-height: 300px;
    padding: 20px;
    line-height: 1.6;
    color: #333;
    font-size: 1rem;
    background: white;
    box-sizing: border-box;
    width: 100%;

    strong {
        font-weight: 600;
        color: #1a1a1a;
        display: block;
        margin-bottom: 0.5em;
    }

    p {
        margin: 0;
        margin-bottom: 1em;
    }

    ol {
        margin: 0;
        padding-left: 1.5em;
    }

    li {
        margin-bottom: 1em;
    }

    li:last-child {
        margin-bottom: 0;
    }
`;

export const OutputPanel: React.FC<OutputPanelProps> = ({ result }) => {
    const getLightColor = (color: string) => {
        // Convert hex to rgba with 0.15 opacity
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.15)`;
    };

    if (!result) {
        return (
            <PanelContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Header>Output</Header>
                <Content>
                    Drop a capability bubble on your text to see the transformation here.
                </Content>
            </PanelContainer>
        );
    }

    const bgColor = result.appliedCapabilities[0]?.color 
        ? getLightColor(result.appliedCapabilities[0].color)
        : '#f9f9f9';

    return (
        <PanelContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Header $bgColor={bgColor}>Output</Header>
            <Content>
                <ReactMarkdown components={{
                    p: ({ children }) => <p>{children}</p>,
                    strong: ({ children }) => <strong>{children}</strong>
                }}>
                    {result.transformedText.replace(/\n{2,}/g, '\n').trim()}
                </ReactMarkdown>
            </Content>
        </PanelContainer>
    );
}; 