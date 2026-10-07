import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar, themeColor, setThemeColor }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: '📊',
      subItems: [
        { path: '/', label: 'Overview' },
        { path: '/reports', label: 'Statistics' }
      ]
    },
    { 
      path: '/students', 
      label: 'Students', 
      icon: '👥',
      subItems: [
        { path: '/students', label: 'All Students' },
        { path: '/students', label: 'Add Student' },
        { path: '/students', label: 'Search Students' }
      ]
    },
    { 
      path: '/attendance', 
      label: 'Attendance', 
      icon: '📋',
      subItems: [
        { path: '/attendance', label: 'Mark Attendance' },
        { path: '/attendance', label: 'View History' },
        { path: '/reports', label: 'Attendance Reports' }
      ]
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: '📈',
      subItems: [
        { path: '/reports', label: 'Daily Reports' },
        { path: '/reports', label: 'Monthly Reports' },
        { path: '/reports', label: 'Student Reports' }
      ]
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: '⚙️',
      subItems: [
        { path: '/settings', label: 'Profile' },
        { path: '/settings', label: 'Appearance' },
        { path: '/settings', label: 'Notifications' }
      ]
    }
  ];

  const colorOptions = [
    { name: 'Blue', value: 'blue', from: 'from-blue-800', to: 'to-blue-900', bg: 'bg-blue-500' },
    { name: 'Green', value: 'green', from: 'from-green-800', to: 'to-green-900', bg: 'bg-green-500' },
    { name: 'Purple', value: 'purple', from: 'from-purple-800', to: 'to-purple-900', bg: 'bg-purple-500' },
    { name: 'Red', value: 'red', from: 'from-red-800', to: 'to-red-900', bg: 'bg-red-500' },
    { name: 'Orange', value: 'orange', from: 'from-orange-800', to: 'to-orange-900', bg: 'bg-orange-500' }
  ];

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleColorChange = (color) => {
    setThemeColor(color);
  };

  const currentColor = colorOptions.find(c => c.value === themeColor) || colorOptions[0];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b ${currentColor.from} ${currentColor.to} text-white w-64 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-white border-opacity-20">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>🎓</span>
            <span>Attendance</span>
          </h1>
          <p className="text-white text-opacity-80 text-sm mt-1">Tracker System</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={item.path}>
                <div>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`transform transition-transform duration-200 ${dropdownOpen === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen === index && (
                    <ul className="ml-8 mt-2 space-y-1 animate-fadeIn">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            onClick={() => {
                              window.innerWidth < 1024 && toggleSidebar();
                              setDropdownOpen(null);
                            }}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive
                                  ? 'bg-white bg-opacity-30 text-white font-medium'
                                  : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-20'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Color Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white border-opacity-20">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="text-sm font-medium text-white mb-3">Theme Color</p>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${color.bg} ${
                    themeColor === color.value
                      ? 'border-white scale-110'
                      : 'border-transparent hover:border-white hover:border-opacity-50'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
