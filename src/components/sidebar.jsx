import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const datasetTreeData = {
  Physics: {
    dropdown: ['0', '1', '2'],
  },
  Materials: {
    dropdown: ['air', 'water'],
  },
  Results: {
    Plots: {
      'Data-Sources': {
        check: {
          'x-velocity': 'checked',
          'y-velocity': 'checked',
          pressure: 'checked',
        },
        showDirect: true,
      },
      Loss: {
        check: {
          'train loss': 'checked',
          'test loss': 'checked',
        },
        showDirect: true,
      },
    },
  },
  'Collocation Points': {
    'Set Points': '100',
  },
  'Boundary Conditions': {
    Inlet: {
      type: {
        'Velocity (m/s)': '10',
        'Pressure (atm)': '1',
        'Mass (kg)': '200',
        'Volume (m^3))': '300',
      },
      input: {
        key: 'Velocity (m/s)',
        value: '10',
      },
      showDirect: true,
    },
    Outlet: {
      type: {
        'Velocity (m/s)': '10',
        'Pressure (atm)': '1',
        'Mass (kg)': '200',
        'Volume (m^3))': '300',
      },
      input: {
        key: 'Pressure (atm)',
        value: '1',
      },
      showDirect: true,
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
    'Activation Function': {
      type: {
        ReLU: '',
      },
      input: {
        key: 'Activation Function',
        value: 'ReLu',
      },
      showDirect: true,
    },
    Initializer: {
      type: {
        Xavier: '',
      },
      input: {
        key: 'Initializer',
        value: 'ReLu',
      },
      showDirect: true,
    },
    Optimizer: {
      type: {
        Adam: '',
      },
      input: {
        key: 'Optimizer',
        value: 'ReLu',
      },
      showDirect: true,
    },
  },
  Hyperparameters: {
    'Iterations (Epochs)': '100',
  },
};

const CadModelData = {
  Airfoil: {
    Inlet: '',
    Outlet: '',
    Wall: '',
    Symmetry: '',
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

  const [selectedInputType, setSelectedInputType] = useState();

  useEffect(() => {
    if (selectedMenuItem === 'Dataset') setTreeData(datasetTreeData);
    else if (selectedMenuItem === 'Model Training') {
      setTreeData(modelTrainingTreeData);
      setModelParams(modelTrainingTreeData);
      // } else if (selectedMenuItem === 'Results') setTreeData(resultsTreeData);
    } else if (selectedMenuItem === 'CAD Model') setTreeData(CadModelData);

    setExpandedNodes([]);
    setSelectedLeafNode(null);
    setIsRightSidebarOpen(false);
    setSelectedInputType('');
  }, [selectedMenuItem, setModelParams]);

  const toggleLeftSidebar = () => {
    setIsSidebarOpen(false);
    setIsRightSidebarOpen(false);
  };

  const toggleRightSidebar = node => {
    if (
      selectedLeafNode === node &&
      selectedMenuItem !== 'Results' &&
      selectedMenuItem !== 'CAD Model'
    ) {
      setIsRightSidebarOpen(!isRightSidebarOpen);
    } else if (
      selectedMenuItem !== 'Results' &&
      selectedMenuItem !== 'CAD Model'
    ) {
      setIsRightSidebarOpen(true);
    }
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
    if (!data) return null; // Add this check to prevent errors

    return Object.entries(data).map(([key, value]) => {
      const node = parentNode ? `${parentNode}.${key}` : key;
      const isExpanded = expandedNodes.includes(node);
      const isLeaf = typeof value !== 'object' || value?.showDirect === true;
      const isDropDown = value?.dropdown?.length > 0;

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
          {isExpanded && !isLeaf && !isDropDown && (
            <div className='ml-4 border-l border-gray-400 relative'>
              <div className='pl-4'>{renderTree(value, node, level + 1)}</div>
            </div>
          )}
          {isExpanded && isDropDown && (
            <div className='ml-4'>
              <select className='bg-gray-200 m-2 px-1'>
                {value.dropdown.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
          {isExpanded && key === 'Data-Sources' && (
            <div className='ml-4'>
              {Object.entries(value.check || {}).map(
                ([checkKey, checkValue]) => (
                  <div key={checkKey} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={checkValue === 'checked'}
                      onChange={() => {
                        value.check[checkKey] =
                          checkValue === 'checked' ? 'unchecked' : 'checked';
                        setTreeData({ ...treeData });
                      }}
                    />
                    <span className='ml-2'>{checkKey}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const getLeafNodeValue = node => {
    if (!node) return null; // Add this check to prevent errors
    const path = node.split('.');
    let value = treeData;
    for (let i = 0; i < path.length; i++) {
      value = value[path[i]];
      if (value === undefined) return null; // Add this check to prevent errors
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
  };

  // console.log(Object.entries(getLeafNodeValue(selectedLeafNode)?.type || {}));

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
            {typeof getLeafNodeValue(selectedLeafNode) === 'object' &&
            getLeafNodeValue(selectedLeafNode)?.type ? (
              <>
                Type:
                <select
                  className='bg-gray-200 m-2 px-1'
                  onChange={e => setSelectedInputType(e.target.value)}
                >
                  {Object.keys(getLeafNodeValue(selectedLeafNode)?.type)?.map(
                    (type, index) => (
                      <option key={index}>{type}</option>
                    )
                  )}
                </select>
                <label htmlFor='leafNodeInput' className='block font-bold mb-1'>
                  {selectedInputType}
                </label>
                <input
                  type='text'
                  id='leafNodeInput'
                  className='w-full px-2 py-1 border border-gray-300 rounded'
                  value={
                    getLeafNodeValue(selectedLeafNode)?.type[
                      selectedInputType
                    ] || ''
                  }
                />
              </>
            ) : getLeafNodeValue(selectedLeafNode)?.check ? (
              <>
                {Object.entries(getLeafNodeValue(selectedLeafNode)?.check).map(
                  ([checkKey, checkValue]) => (
                    <div key={checkKey} className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={checkValue === 'checked'}
                        onChange={() => {
                          getLeafNodeValue(selectedLeafNode).check[checkKey] =
                            checkValue === 'checked' ? 'unchecked' : 'checked';
                          setTreeData({ ...treeData });
                        }}
                      />
                      <span className='ml-2'>{checkKey}</span>
                    </div>
                  )
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
