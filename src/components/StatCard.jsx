import React from 'react';

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  const bgColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
            {value}
          </h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`${bgColor} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
