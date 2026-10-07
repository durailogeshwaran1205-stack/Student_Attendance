import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2024 Student Attendance Tracker. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 text-sm transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
