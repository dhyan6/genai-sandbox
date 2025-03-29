# GenAI Showcase

A modern web application that demonstrates the power of AI capabilities through an intuitive drag-and-drop interface. Built with React, TypeScript, and Vite, this project showcases various text transformation capabilities powered by OpenAI's API.

## Features

- 🎯 Drag-and-drop capability bubbles for text transformation
- 💡 Multiple AI-powered text operations
- 🎨 Beautiful and responsive UI with smooth animations
- 📝 Real-time text processing
- 🔥 Fast development with HMR (Hot Module Replacement)

## Tech Stack

- React 18
- TypeScript
- Vite
- OpenAI API
- Emotion (Styled Components)
- Framer Motion
- React Markdown

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

#### Option 1: Using the Setup Script (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/genai-showcase.git
cd genai-showcase
```

2. Run the setup script:
```bash
./setup.sh
```
The script will:
- Create a `.env` file from the template
- Prompt you for your OpenAI API key
- Install dependencies
- Set up everything automatically

#### Option 2: Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/genai-showcase.git
cd genai-showcase
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. Enter or paste your text in the input box
2. Drag a capability bubble onto your text
3. Watch as the AI transforms your text according to the selected capability

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
