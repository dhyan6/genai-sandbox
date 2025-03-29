import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface PasswordModalProps {
    onPasswordSubmit: (isCorrect: boolean) => void;
}

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

const Input = styled.input`
    width: 100%;
    padding: 12px;
    margin: 20px 0;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: #4A8BDF;
    }
`;

const Button = styled.button`
    background: linear-gradient(90deg, #4A8BDF 0%, #AA64F6 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }
`;

const ErrorMessage = styled.p`
    color: #dc2626;
    margin: 10px 0 0;
    font-size: 0.9rem;
`;

export const PasswordModal: React.FC<PasswordModalProps> = ({ onPasswordSubmit }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isCorrect = password === 'genairocks';
        if (!isCorrect) {
            setError(true);
        }
        onPasswordSubmit(isCorrect);
    };

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
                <form onSubmit={handleSubmit}>
                    <h2>Enter Password</h2>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        placeholder="Password"
                        autoFocus
                    />
                    {error && <ErrorMessage>Your password is incorrect</ErrorMessage>}
                    <Button type="submit">Submit</Button>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
}; 