import React from 'react';

const Notification = ({ notification }) => {
  if (!notification.show) return null;

  const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3`}>
      <span>{notification.type === 'success' ? '✓' : '✗'}</span>
      <span>{notification.message}</span>
    </div>
  );
};

export default Notification;
