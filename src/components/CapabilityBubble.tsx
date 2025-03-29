import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd/dist/hooks';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Capability } from '../types';

interface CapabilityBubbleProps {
    capability: Capability;
}

const BubbleContainer = styled(motion.div)<{ $color: string; $textColor: string }>`
    padding: 12px 24px;
    border-radius: 50px;
    background-color: ${props => props.$color};
    color: ${props => props.$textColor};
    cursor: grab;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 500;
    white-space: nowrap;
    border: none;
    font-family: 'Geist', sans-serif;
    touch-action: none;
    
    &:hover {
        transform: translateY(-1px);
    }
    
    &:active {
        cursor: grabbing;
        transform: translateY(1px);
    }
`;

const BubbleText = styled.span`
    font-weight: bold;
    color: #333;
`;

const BubbleDescription = styled.p`
    margin: 0;
    font-size: 0.9em;
    color: #666;
`;

export const CapabilityBubble: React.FC<CapabilityBubbleProps> = ({ capability }) => {
    const bubbleRef = useRef<HTMLDivElement>(null);
    
    const [{ isDragging }, drag] = useDrag({
        type: 'capability',
        item: () => {
            console.log('Starting drag with capability:', capability);
            return capability;
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (_, monitor) => {
            const didDrop = monitor.didDrop();
            console.log('Drag ended. Was dropped:', didDrop);
        }
    });

    // Log when isDragging changes
    useEffect(() => {
        console.log('Is dragging:', isDragging);
    }, [isDragging]);

    // Apply the drag ref to the bubble ref
    drag(bubbleRef);

    return (
        <BubbleContainer
            ref={bubbleRef}
            $color={capability.color}
            $textColor={capability.textColor}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            animate={{ scale: isDragging ? 0.95 : 1 }}
            transition={{ duration: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <BubbleText>{capability.name}</BubbleText>
            <BubbleDescription>{capability.description}</BubbleDescription>
        </BubbleContainer>
    );
}; 