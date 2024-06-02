import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const datasetTreeData = {
  'Collocation Points': {
    'Set Points': '100',
  },
  'Boundary Conditions': {
    Inlet: {
      'Velocity (m/s)': '10',
    },
    Outlet: {
      'Pressure (atm)': '1',
    },
    Symmetry: 'Yes',
    Wall: 'No-slip',
  },
};

const modelTrainingTreeData = {
  Layers: {
    'Input Neurons': '10',
    'Output Neurons': '1',
    'Hidden Layers': '3',
    'Hidden Layer Neurons': '24',
  },
  Functions: {
    'Activation Function': 'ReLU',
    Initializer: 'Xavier',
    Optimizer: 'Adam',
  },
  Hyperparameters: {
    'Iterations (Epochs)': '100',
  },
};

const resultsTreeData = {
  Velocity: {
    "'u' velocity": '5.2',
    "'v' velocity": '2.8',
  },
  Pressure: '101325',
};

const CadModelData = {
  Physics: {
    Aerofoil: 'NACA 0012',
  },
};

const Sidebar = ({
  selectedMenuItem,
  isSidebarOpen,
  setIsSidebarOpen,
  setModelParams,
}) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [selectedLeafNode, setSelectedLeafNode] = useState(null);
  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    if (selectedMenuItem === 'Dataset') setTreeData(datasetTreeData);
    else if (selectedMenuItem === 'Model Training') {
      setTreeData(modelTrainingTreeData);
      setModelParams(modelTrainingTreeData);
    } else if (selectedMenuItem === 'Results') setTreeData(resultsTreeData);
    else if (selectedMenuItem === 'CAD Model') setTreeData(CadModelData);

    setExpandedNodes([]);
    setSelectedLeafNode(null);
    setIsRightSidebarOpen(false);
  }, [selectedMenuItem, setModelParams]);

  const toggleLeftSidebar = () => {
    setIsSidebarOpen(false);
    setIsRightSidebarOpen(false);
  };

  const toggleRightSidebar = node => {
    if (selectedLeafNode === node) {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    } else setIsRightSidebarOpen(true);
    setSelectedLeafNode(node);
  };

  const toggleNode = (node, isLeaf) => {
    if (isLeaf) {
      toggleRightSidebar(node);
    } else {
      if (expandedNodes.includes(node)) {
        setExpandedNodes(expandedNodes.filter(n => n !== node));
      } else {
        setExpandedNodes([...expandedNodes, node]);
      }
    }
  };

  const renderTree = (data, parentNode = '', level = 0) => {
    console.log(data);
    return Object.entries(data)?.map(([key, value]) => {
      const node = parentNode ? `${parentNode}.${key}` : key;
      const isExpanded = expandedNodes.includes(node);
      const isLeaf = typeof value !== 'object';

      return (
        <div key={node} className='relative'>
          <div
            className='flex items-center cursor-pointer py-1'
            style={{ paddingLeft: `${level * 16}px` }}
            onClick={() => toggleNode(node, isLeaf)}
          >
            {!isLeaf ? (
              isExpanded ? (
                <FaMinus size={12} className='mr-1' />
              ) : (
                <FaPlus size={12} className='mr-1' />
              )
            ) : null}
            <span>{key}</span>
          </div>
          {isExpanded && !isLeaf && (
            <div className='ml-4 border-l border-gray-400 relative'>
              <div className='pl-4'>{renderTree(value, node, level + 1)}</div>
            </div>
          )}
        </div>
      );
    });
  };

  const getLeafNodeValue = node => {
    const path = node?.split('.');
    let value = treeData;
    for (let i = 0; i < path?.length; i++) {
      value = value[path[i]];
    }
    return value;
  };

  const updateLeafNodeValue = (node, newValue) => {
    const path = node.split('.');
    let obj = treeData;
    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = newValue;
    setTreeData({ ...treeData });
    // if (selectedMenuItem === 'Model Training') setModelParams({ ...obj });
  };

  return (
    <div className='flex h-screen'>
      {isSidebarOpen && (
        <aside className='w-64 bg-gray-100 text-gray-800 flex flex-col border-r border-gray-400/50'>
          <div className='flex justify-end'>
            <button
              className='hover:bg-gray-200 p-2 rounded'
              onClick={toggleLeftSidebar}
            >
              <FaTimes size={15} className='text-black' />
            </button>
          </div>
          <nav className='flex-grow p-4 overflow-auto'>
            {renderTree(treeData)}
          </nav>
        </aside>
      )}
      <main className='flex-1'>{/* Empty content */}</main>
      {isRightSidebarOpen && (
        <aside className='w-64 bg-gray-100 text-gray-800 p-4'>
          <div className='mb-4'>
            <label htmlFor='leafNodeInput' className='block font-bold mb-1'>
              {selectedLeafNode}
            </label>
            <input
              type='text'
              id='leafNodeInput'
              className='w-full px-2 py-1 border border-gray-300 rounded'
              value={getLeafNodeValue(selectedLeafNode) || ''}
              onChange={e =>
                updateLeafNodeValue(selectedLeafNode, e.target.value)
              }
            />
          </div>
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
