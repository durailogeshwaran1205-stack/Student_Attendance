import React from 'react';

const AttendanceTable = ({ students, attendanceData, onAttendanceChange }) => {
  return (
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
              Class
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Present
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Absent
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Late
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {students.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">📭</span>
                  <p>No students found</p>
                </div>
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const currentStatus = attendanceData[student.studentId] || 'Present';
              return (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {student.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.studentId}`}
                      value="Present"
                      checked={currentStatus === 'Present'}
                      onChange={() => onAttendanceChange(student.studentId, 'Present')}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.studentId}`}
                      value="Absent"
                      checked={currentStatus === 'Absent'}
                      onChange={() => onAttendanceChange(student.studentId, 'Absent')}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.studentId}`}
                      value="Late"
                      checked={currentStatus === 'Late'}
                      onChange={() => onAttendanceChange(student.studentId, 'Late')}
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 cursor-pointer"
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
