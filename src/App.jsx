import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import HorizontalNav from './components/HorizontalNav';
import Notification from './components/Notification';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AppContent() {
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || 'blue';
  });
  const { notification, settings } = useAttendance();

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Save theme color to localStorage
  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  return (
    <div className="min-h-screen">
      <HorizontalNav themeColor={themeColor} setThemeColor={setThemeColor} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Notification notification={notification} />
    </div>
  );
}

function App() {
  return (
    <AttendanceProvider>
      <Router>
        <AppContent />
      </Router>
    </AttendanceProvider>
  );
}

export default App;
