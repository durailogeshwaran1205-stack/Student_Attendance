import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents, initialAttendanceRecords, recentActivities } from '../data/studentData';

// Create the Attendance Context
const AttendanceContext = createContext();

// Custom hook to use the Attendance Context
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

// Attendance Provider Component
export const AttendanceProvider = ({ children }) => {
  // State for students
  const [students, setStudents] = useState(initialStudents);
  
  // State for attendance records
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceRecords);
  
  // State for recent activities
  const [activities, setActivities] = useState(recentActivities);
  
  // State for settings
  const [settings, setSettings] = useState({
    name: "Admin User",
    email: "admin@school.edu",
    role: "Administrator",
    darkMode: false,
    attendanceNotifications: true,
    reportNotifications: true
  });
  
  // State for notifications
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('attendanceSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('attendanceSettings', JSON.stringify(settings));
  }, [settings]);

  // Function to add a new student
  const addStudent = (studentData) => {
    const newStudent = {
      id: students.length + 1,
      ...studentData,
      attendance: 0
    };
    setStudents([...students, newStudent]);
    showNotification('Student added successfully!', 'success');
  };

  // Function to update attendance
  const updateAttendance = (studentId, status, date) => {
    const existingRecord = attendanceRecords.find(
      record => record.studentId === studentId && record.date === date
    );

    if (existingRecord) {
      // Update existing record
      setAttendanceRecords(
        attendanceRecords.map(record =>
          record.id === existingRecord.id
            ? { ...record, status, checkInTime: status === 'Absent' ? '-' : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
            : record
        )
      );
    } else {
      // Add new record
      const student = students.find(s => s.studentId === studentId);
      const newRecord = {
        id: attendanceRecords.length + 1,
        studentId,
        studentName: student ? student.name : 'Unknown',
        className: student ? student.className : 'Unknown',
        date,
        checkInTime: status === 'Absent' ? '-' : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }

    // Add activity
    const student = students.find(s => s.studentId === studentId);
    const newActivity = {
      id: activities.length + 1,
      message: `${student ? student.name : 'Student'} marked as ${status}`,
      time: 'Just now',
      type: status.toLowerCase()
    };
    setActivities([newActivity, ...activities].slice(0, 10));

    showNotification('Attendance updated successfully!', 'success');
  };

  // Function to calculate statistics
  const getStatistics = () => {
    const totalStudents = students.length;
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(record => record.date === today);
    
    const presentToday = todayRecords.filter(record => record.status === 'Present').length;
    const absentToday = todayRecords.filter(record => record.status === 'Absent').length;
    const lateToday = todayRecords.filter(record => record.status === 'Late').length;
    
    const averageAttendance = students.length > 0
      ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length)
      : 0;

    return {
      totalStudents,
      presentToday,
      absentToday,
      lateToday,
      averageAttendance
    };
  };

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Context value
  const value = {
    students,
    attendanceRecords,
    activities,
    settings,
    notification,
    addStudent,
    updateAttendance,
    getStatistics,
    showNotification,
    updateSettings
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
