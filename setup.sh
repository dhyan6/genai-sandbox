#!/bin/bash

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Skipping creation."
else
    # Copy .env.example to .env
    cp .env.example .env
    echo "✅ Created .env file from template"
fi

# Prompt for OpenAI API key
echo ""
echo "🔑 Please enter your OpenAI API key:"
read -r api_key

# Update .env file with the API key
if [ -n "$api_key" ]; then
    # Use sed differently for macOS and Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|your_openai_api_key_here|$api_key|" .env
    else
        # Linux
        sed -i "s|your_openai_api_key_here|$api_key|" .env
    fi
    echo "✅ Updated API key in .env file"
else
    echo "⚠️  No API key provided. Please manually update the .env file"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete! You can now run 'npm run dev' to start the application" 