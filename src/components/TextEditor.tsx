import { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd/dist/hooks';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Capability } from '../types';

interface TextEditorProps {
    onTransformRequest: (text: string, capability: Capability) => void;
    isLoading?: boolean;
    text: string;
    onTextChange: (text: string) => void;
}

const EditorContainer = styled.div`
    position: relative;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    background: white;
`;

const Header = styled.div`
    padding: 16px 20px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #1a1a1a;
    background: #f9f9f9;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 300px;
    padding: 20px;
    border: none;
    resize: vertical;
    font-family: 'Geist', sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    background: white;
    position: relative;
    z-index: 1;
    box-sizing: border-box;

    &:focus {
        outline: none;
    }
`;

const UndoButton = styled.button`
    position: absolute;
    bottom: -40px;
    left: 0;
    background: none;
    border: none;
    color: #666;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Geist', sans-serif;

    &:hover {
        color: #4169E1;
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

const LoadingOverlay = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #4a90e2;
    border-radius: 50%;
`;

export const TextEditor: React.FC<TextEditorProps> = ({ 
    onTransformRequest, 
    isLoading = false,
    text,
    onTextChange
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: 'capability',
        drop: (item: Capability) => {
            console.log('Drop event triggered');
            console.log('Text content:', text);
            console.log('Capability:', item);
            
            if (text && text.trim()) {
                console.log('Calling onTransformRequest');
                onTransformRequest(text, item);
            } else {
                console.log('No text to transform');
            }
            return { dropped: true };
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    }), [text, onTransformRequest]);

    // Log when isOver changes
    useEffect(() => {
        console.log('Is over drop target:', isOver);
    }, [isOver]);

    // Combine the refs
    const setRefs = (element: HTMLDivElement) => {
        console.log('Setting refs for element:', element);
        editorRef.current = element;
        dropRef(element);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTextChange(e.target.value);
    };

    const handleUndo = () => {
        onTextChange('');
    };

    return (
        <EditorContainer
            ref={setRefs}
            style={{
                border: isOver ? '1px solid #4A8BDF' : '1px solid #ddd',
            }}
        >
            <Header>Input</Header>
            <TextArea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter your text here..."
            />
            <UndoButton onClick={handleUndo}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v6h6" />
                    <path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 9 9 9 9 0 0 1-9 9" />
                </svg>
                Start Over
            </UndoButton>
            {isLoading && (
                <LoadingOverlay>
                    <LoadingSpinner />
                </LoadingOverlay>
            )}
        </EditorContainer>
    );
}; 