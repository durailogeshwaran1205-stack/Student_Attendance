import React from 'react';

const Navbar = ({ toggleSidebar, settings }) => {
  return (
    <header className="bg-white shadow-md dark:bg-gray-800 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Student Attendance Tracker
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome, {settings.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400">📅</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {settings.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
