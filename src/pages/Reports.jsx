import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import ProgressBar from '../components/ProgressBar';

const Reports = () => {
  const { students, attendanceRecords, settings } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterAttendance, setFilterAttendance] = useState('');

  // Calculate report data for each student
  const reportData = useMemo(() => {
    return students.map(student => {
      const studentRecords = attendanceRecords.filter(
        record => record.studentId === student.studentId
      );
      
      const totalDays = studentRecords.length;
      const presentDays = studentRecords.filter(record => record.status === 'Present').length;
      const absentDays = studentRecords.filter(record => record.status === 'Absent').length;
      const lateDays = studentRecords.filter(record => record.status === 'Late').length;
      
      const attendancePercentage = totalDays > 0 
        ? Math.round((presentDays / totalDays) * 100) 
        : student.attendance;

      return {
        ...student,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage
      };
    });
  }, [students, attendanceRecords]);

  // Filter report data
  const filteredReports = reportData.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !filterClass || report.className === filterClass;
    
    let matchesAttendance = true;
    if (filterAttendance === 'high') {
      matchesAttendance = report.attendancePercentage >= 90;
    } else if (filterAttendance === 'medium') {
      matchesAttendance = report.attendancePercentage >= 75 && report.attendancePercentage < 90;
    } else if (filterAttendance === 'low') {
      matchesAttendance = report.attendancePercentage < 75;
    }
    
    return matchesSearch && matchesClass && matchesAttendance;
  });

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalStudents = filteredReports.length;
    const averageAttendance = totalStudents > 0
      ? Math.round(filteredReports.reduce((sum, report) => sum + report.attendancePercentage, 0) / totalStudents)
      : 0;
    const totalPresent = filteredReports.reduce((sum, report) => sum + report.presentDays, 0);
    const totalAbsent = filteredReports.reduce((sum, report) => sum + report.absentDays, 0);

    return {
      totalStudents,
      averageAttendance,
      totalPresent,
      totalAbsent
    };
  }, [filteredReports]);

  // Get unique classes for filter dropdown
  const uniqueClasses = [...new Set(students.map(student => student.className))];

  // Get attendance color
  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'blue';
    if (percentage >= 60) return 'yellow';
    return 'red';
  };

  return (
    <div className={`transition-colors duration-200 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Page Header */}
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Attendance Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and analyze attendance statistics
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {summaryStats.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                👥
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Attendance</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {summaryStats.averageAttendance}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                📊
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Present Days</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {summaryStats.totalPresent}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                ✅
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Absent Days</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {summaryStats.totalAbsent}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl">
                ❌
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Class
              </label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
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
                Filter by Attendance
              </label>
              <select
                value={filterAttendance}
                onChange={(e) => setFilterAttendance(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Attendance</option>
                <option value="high">High (90%+)</option>
                <option value="medium">Medium (75-89%)</option>
                <option value="low">Low (&lt;75%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Attendance Report
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredReports.length} students
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Present Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Absent Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">📭</span>
                        <p>No report data found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {report.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {report.totalDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {report.presentDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {report.absentDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {report.attendancePercentage}%
                          </span>
                          <ProgressBar 
                            value={report.attendancePercentage} 
                            color={getAttendanceColor(report.attendancePercentage)} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Students with 90%+ attendance</p>
              <p className="text-2xl font-bold">
                {filteredReports.filter(r => r.attendancePercentage >= 90).length}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Students with 75-89% attendance</p>
              <p className="text-2xl font-bold">
                {filteredReports.filter(r => r.attendancePercentage >= 75 && r.attendancePercentage < 90).length}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Students with &lt;75% attendance</p>
              <p className="text-2xl font-bold">
                {filteredReports.filter(r => r.attendancePercentage < 75).length}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Reports;
