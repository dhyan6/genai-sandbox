require('ts-node').register();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Import the API handler
const apiHandler = require('./api/transform.ts');

// Serve static files from the dist directory
app.use(express.static('dist'));

// API endpoint
app.post('/api/transform', async (req, res) => {
    try {
        await apiHandler(req, res);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

console.log('Starting API server...');
app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
}); 