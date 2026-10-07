import React from 'react';

const ProgressBar = ({ value, max = 100, color = 'blue' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const bgColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`${bgColor} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
