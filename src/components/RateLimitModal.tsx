import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled(motion.div)`
    background: white;
    padding: 40px;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    text-align: center;
`;

const Message = styled.h2`
    color: #dc2626;
    margin: 0;
    font-size: 1.5rem;
`;

export const RateLimitModal: React.FC = () => {
    return (
        <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Message>Limit of generations reached</Message>
            </ModalContent>
        </ModalOverlay>
    );
}; 