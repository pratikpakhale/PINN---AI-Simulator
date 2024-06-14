import { FaFileImport, FaDatabase, FaCogs, FaChartBar } from 'react-icons/fa';
import { useState } from 'react';

const MenuBar = ({ onMenuItemSelect, onFileSelect, onResultSelect }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleMenuItemClick = menuItem => {
    setSelectedMenuItem(menuItem);
    onMenuItemSelect(menuItem);
  };

  return (
    <>
      <nav className='bg-gray-100 text-gray-800 p-4 border-b border-gray-400/30'>
        <ul className='flex justify-start space-x-8'>
          <ImportCad
            onFileSelect={event => {
              onFileSelect(event);
              handleMenuItemClick('CAD Model');
            }}
          />
          <li className='border-r border-gray-400/50 h-16'></li>
          <MenuItem
            icon={<FaDatabase size={32} />}
            text='Dataset'
            selected={selectedMenuItem === 'Dataset'}
            onClick={() => handleMenuItemClick('Dataset')}
          />
          <li className='border-r border-gray-400/50 h-16'></li>
          <MenuItem
            icon={<FaCogs size={32} />}
            text='Model Training'
            selected={selectedMenuItem === 'Model Training'}
            onClick={() => handleMenuItemClick('Model Training')}
          />
          <li className='border-r border-gray-400/50 h-16'></li>
          <MenuItem
            icon={<FaChartBar size={32} />}
            text='Results'
            selected={selectedMenuItem === 'Results'}
            onClick={() => handleMenuItemClick('Results')}
          />
        </ul>
      </nav>
      {/* small menu bar  */}
      {selectedMenuItem === 'Results' && (
        <div className='px-10 py-2 bg-gray-100/50'>
          {/* Choose Results to Display: */}
          <select className='bg-gray-200 mx-2 px-1' onChange={onResultSelect}>
            <option>u Velocity</option>
            <option>v Velocity</option>
            <option>Pressure</option>
          </select>
        </div>
      )}
    </>
  );
};

const MenuItem = ({ icon, text, selected, onClick }) => (
  <li
    className={`flex flex-col items-center space-y-3 cursor-pointer ${
      selected ? 'text-blue-500' : ''
    }`}
    onClick={onClick}
  >
    <div className='bg-transparent rounded p-2 shadow'>
      <div className='text-4xl text-[#99760c]'>{icon}</div>
    </div>
    <div className='text-xs font-sans font-semibold text-center'>{text}</div>
  </li>
);

const ImportCad = ({ onFileSelect }) => {
  return (
    <li className='flex flex-col items-center space-y-3 cursor-pointer'>
      <label htmlFor='fileInput' className='bg-transparent rounded p-2 shadow'>
        <div className='text-4xl text-[#99760c]'>
          <FaFileImport size={32} />
        </div>
      </label>
      <input
        type='file'
        id='fileInput'
        accept='.stl'
        style={{ display: 'none' }}
        onChange={onFileSelect}
      />

      <div className='text-xs font-sans font-semibold text-center'>
        Import CAD Model
      </div>
    </li>
  );
};

export default MenuBar;
