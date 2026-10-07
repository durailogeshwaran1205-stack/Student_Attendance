import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import AttendanceTable from '../components/AttendanceTable';

const Attendance = () => {
  const { students, updateAttendance, showNotification, settings } = useAttendance();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  // Handle attendance change for a student
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  // Handle save attendance
  const handleSaveAttendance = () => {
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      updateAttendance(studentId, status, selectedDate);
    });
    
    setAttendanceData({});
    showNotification('Attendance saved successfully!', 'success');
  };

  // Filter students based on search and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !selectedClass || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Get unique classes for filter dropdown
  const uniqueClasses = [...new Set(students.map(student => student.className))];

  // Calculate attendance summary
  const calculateSummary = () => {
    const total = filteredStudents.length;
    const present = Object.values(attendanceData).filter(status => status === 'Present').length;
    const absent = Object.values(attendanceData).filter(status => status === 'Absent').length;
    const late = Object.values(attendanceData).filter(status => status === 'Late').length;
    const marked = present + absent + late;

    return { total, present, absent, late, marked };
  };

  const summary = calculateSummary();

  return (
    <div className={`transition-colors duration-200 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Page Header */}
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Attendance Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mark and manage student attendance
          </p>
        </div>

        {/* Date and Class Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Student
              </label>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{summary.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Marked</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.marked}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.present}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.absent}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Mark Attendance
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {summary.marked} of {summary.total} marked
              </span>
            </div>
          </div>
          <AttendanceTable
            students={filteredStudents}
            attendanceData={attendanceData}
            onAttendanceChange={handleAttendanceChange}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAttendance}
            disabled={summary.marked === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              summary.marked === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Save Attendance
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-xl p-4">
          <h3 className="font-medium text-gray-800 dark:text-white mb-2">
            Instructions:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Select the date for which you want to mark attendance</li>
            <li>• Filter by class if needed</li>
            <li>• Use the radio buttons to mark each student as Present, Absent, or Late</li>
            <li>• Click "Save Attendance" to save the records</li>
          </ul>
        </div>
    </div>
  );
};

export default Attendance;
