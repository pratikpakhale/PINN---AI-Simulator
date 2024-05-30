import { useState } from 'react';
import MenuBar from './components/menuBar';
import Sidebar from './components/sidebar';
import ThreeViewer from './components/threeViewer';
import NeuralNetViewer from './components/neuralNetViewer';
import ImageViewer from './components/imageViewer';
import ResultsViewer from './components/resultsViewer';

export default function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [modelParams, setModelParams] = useState(null);

  const handleMenuItemSelect = menuItem => {
    setSelectedMenuItem(menuItem);
    setIsSidebarOpen(true);
  };

  const handleFileSelect = event => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className='flex flex-col h-screen w-screen'>
      <MenuBar
        onMenuItemSelect={handleMenuItemSelect}
        onFileSelect={handleFileSelect}
      />
      <div className='flex'>
        <Sidebar
          selectedMenuItem={selectedMenuItem}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setModelParams={setModelParams}
        />
        <main className='flex-1'>
          {selectedMenuItem === 'CAD Model' && (
            <ThreeViewer selectedFile={selectedFile} />
          )}
          {selectedMenuItem === 'Dataset' && (
            <ImageViewer imageUrl='/dataset.png' />
          )}
          {selectedMenuItem === 'Model Training' && (
            <NeuralNetViewer modelTrainingTreeData={modelParams} />
          )}
          {selectedMenuItem === 'Results' && <ResultsViewer />}
        </main>
      </div>
    </div>
  );
}
