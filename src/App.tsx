import { useState } from 'react';
import { DndProvider } from 'react-dnd/dist/core';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from '@emotion/styled';
import { CapabilityBubble } from './components/CapabilityBubble';
import { TextEditor } from './components/TextEditor';
import { OutputPanel } from './components/OutputPanel';
import { transformText } from './services/ai';
import { Capability, CapabilityType, TransformationResult } from './types';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: white;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(90deg, #4A8BDF 0%, #AA64F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
`;

const CapabilitiesContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
  width: 100%;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  width: 100%;
  padding: 0 4px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const capabilities: Capability[] = [
  {
    id: '1',
    name: 'Summarize',
    description: 'Create a concise summary',
    type: CapabilityType.Summarization,
    color: '#bfdbfe',
    textColor: '#1e40af'
  },
  {
    id: '2',
    name: 'Categorize',
    description: 'Identify main topics',
    type: CapabilityType.Categorization,
    color: '#d6ccfc',
    textColor: '#5b21b6'
  },
  {
    id: '3',
    name: 'Analyze',
    description: 'Analyze the content',
    type: CapabilityType.Analysis,
    color: '#cefad5',
    textColor: '#15803d'
  },
  {
    id: '4',
    name: 'Extract Key Words',
    description: 'Extract important terms',
    type: CapabilityType.KeywordExtraction,
    color: '#fcd34d',
    textColor: '#78350f'
  },
  {
    id: '5',
    name: 'Analyze Sentiment',
    description: 'Determine the tone',
    type: CapabilityType.SentimentAnalysis,
    color: '#fca4df',
    textColor: '#831843'
  }
];

function App() {
  const [transformationResult, setTransformationResult] = useState<TransformationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState('The Amazon rainforest, often referred to as the "lungs of the Earth," produces 20% of the world\'s oxygen and is home to an estimated 10% of the planet\'s known species. However, deforestation has accelerated in recent decades due to logging, agriculture, and infrastructure development. Scientists warn that continued destruction of the rainforest could lead to severe climate consequences, including reduced biodiversity and increased carbon emissions.');

  const handleTransformRequest = async (text: string, capability: Capability) => {
    if (!text || !text.trim()) {
      alert('Please enter some text before applying a transformation.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await transformText(text.trim(), capability);
      setTransformationResult(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to transform text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <ContentWrapper>
          <Header>
            <Title>GenAI Capabilities</Title>
            <Subtitle>
              Interact with Generative AI capabilities by dragging and dropping the bubbles onto the text below.
            </Subtitle>
          </Header>
          <CapabilitiesContainer>
            {capabilities.map(capability => (
              <CapabilityBubble
                key={capability.id}
                capability={capability}
              />
            ))}
          </CapabilitiesContainer>
          <MainContent>
            <TextEditor 
              onTransformRequest={handleTransformRequest} 
              isLoading={isLoading}
              text={currentText}
              onTextChange={setCurrentText}
            />
            <OutputPanel result={transformationResult} />
          </MainContent>
        </ContentWrapper>
      </AppContainer>
    </DndProvider>
  );
}

export default App;
