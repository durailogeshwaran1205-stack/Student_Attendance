import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';

const Settings = () => {
  const { settings, updateSettings, showNotification } = useAttendance();
  const [localSettings, setLocalSettings] = useState(settings);

  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings({
      ...localSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Save settings
  const handleSaveSettings = () => {
    updateSettings(localSettings);
    showNotification('Settings saved successfully!', 'success');
  };

  // Reset settings
  const handleResetSettings = () => {
    setLocalSettings(settings);
    showNotification('Settings reset to original values', 'success');
  };

  return (
    <div className={`transition-colors duration-200 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Page Header */}
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your application settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>👤</span>
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={localSettings.name}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={localSettings.email}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={localSettings.role}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🎨</span>
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Toggle dark mode for the application
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={localSettings.darkMode}
                    onChange={handleSettingsChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🔔</span>
              Notification Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attendance Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive notifications when attendance is marked
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="attendanceNotifications"
                    checked={localSettings.attendanceNotifications}
                    onChange={handleSettingsChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Report Notifications
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive notifications when reports are generated
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="reportNotifications"
                    checked={localSettings.reportNotifications}
                    onChange={handleSettingsChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              System Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Application Name</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">Student Attendance Tracker</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">React Version</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">18.2.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Project Type</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">Frontend-only React Application</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Data Storage</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">Local State & localStorage</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Build Tool</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">Create React App</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Save Settings
            </button>
            <button
              onClick={handleResetSettings}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>
    </div>
  );
};

export default Settings;
