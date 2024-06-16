import { useState } from 'react';
import MenuBar from './components/menuBar';
import Sidebar from './components/sidebar';
import ThreeViewer from './components/threeViewer';
import NeuralNetViewer from './components/neuralNetViewer';
import ImageViewer from './components/imageViewer';

export default function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [modelParams, setModelParams] = useState(null);

  const [selectedResult, setSelectedResult] = useState('u_velocity');

  const handleMenuItemSelect = menuItem => {
    setSelectedMenuItem(menuItem);
    if (menuItem != 'Results') {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  };

  const handleFileSelect = event => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className='flex flex-col h-screen w-screen'>
      <MenuBar
        onMenuItemSelect={handleMenuItemSelect}
        onFileSelect={handleFileSelect}
        onResultSelect={e => {
          switch (e.target.value) {
            case 'u Velocity':
              setSelectedResult('u_velocity');
              break;
            case 'v Velocity':
              setSelectedResult('v_velocity');
              break;
            case 'Pressure':
              setSelectedResult('pressure');
              break;
            default:
              setSelectedResult('u_velocity');
          }
        }}
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
            <ImageViewer imageUrl='/model.png' />
          )}
          {selectedMenuItem === 'Results' && (
            <ImageViewer imageUrl={selectedResult + '.png'} />
          )}
        </main>
      </div>
    </div>
  );
}
