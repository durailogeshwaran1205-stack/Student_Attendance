import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const HorizontalNav = ({ themeColor, setThemeColor }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const colorClasses = {
    blue: { bg: 'bg-blue-600', active: 'bg-blue-50 text-blue-600' },
    green: { bg: 'bg-green-600', active: 'bg-green-50 text-green-600' },
    purple: { bg: 'bg-purple-600', active: 'bg-purple-50 text-purple-600' },
    red: { bg: 'bg-red-600', active: 'bg-red-50 text-red-600' },
    orange: { bg: 'bg-orange-600', active: 'bg-orange-50 text-orange-600' }
  };

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
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500' }
  ];

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setDropdownOpen(null);
  };

  const handleColorChange = (color) => {
    setThemeColor(color);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(event.target)) {
        setDropdownOpen(null);
        setMobileMenuOpen(false);
      }
    };

    if (dropdownOpen !== null || mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen, mobileMenuOpen]);

  return (
    <nav className={`${colorClasses[themeColor].bg} text-white shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-white">
              Attendance Tracker
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.path} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(index);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  <span className={`transform transition-transform duration-200 text-xs ${dropdownOpen === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen === index && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                    <ul className="py-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(null);
                            }}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm transition-colors ${
                                isActive
                                  ? colorClasses[themeColor].active + ' font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Color Panel */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white hidden sm:block">
              Theme:
            </span>
            <div className="flex gap-1">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${color.bg} ${
                    themeColor === color.value
                      ? 'border-white scale-110'
                      : 'border-transparent hover:border-white hover:border-opacity-50'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMobileMenu();
            }}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={item.path}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(`mobile-${index}`);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-white hover:bg-opacity-20"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className={`transform transition-transform duration-200 text-xs ${dropdownOpen === `mobile-${index}` ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Mobile Dropdown */}
                  {dropdownOpen === `mobile-${index}` && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.path}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(null);
                              setMobileMenuOpen(false);
                            }}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-white bg-opacity-20 text-white font-medium'
                                  : 'text-white hover:bg-white hover:bg-opacity-10'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Color Panel */}
            <div className="mt-4 px-4">
              <p className="text-sm text-white mb-2">Theme Color</p>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange(color.value);
                    }}
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
        )}
      </div>
    </nav>
  );
};

export default HorizontalNav;
