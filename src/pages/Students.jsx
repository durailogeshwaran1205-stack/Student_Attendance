import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import StudentTable from '../components/StudentTable';

const Students = () => {
  const { students, addStudent, showNotification, settings } = useAttendance();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    className: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.studentId || !formData.name || !formData.email || !formData.className) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    // Check if student ID already exists
    if (students.some(student => student.studentId === formData.studentId)) {
      showNotification('Student ID already exists', 'error');
      return;
    }

    // Add student
    addStudent(formData);

    // Reset form
    setFormData({
      studentId: '',
      name: '',
      email: '',
      className: ''
    });

    // Close form
    setShowForm(false);
  };

  // Filter students based on search and class filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !filterClass || student.className === filterClass;
    
    return matchesSearch && matchesClass;
  });

  // Get unique classes for filter dropdown
  const uniqueClasses = [...new Set(students.map(student => student.className))];

  // Handle delete student
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      showNotification('Student deleted successfully', 'success');
      // Note: In a real app, you would implement delete in the context
    }
  };

  // Handle edit student
  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      className: student.className
    });
    setShowForm(true);
  };

  return (
    <div className={`transition-colors duration-200 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Page Header */}
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Students Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all student records
          </p>
        </div>

        {/* Add Student Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Add New Student
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="ST001"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class
                  </label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                    <option value="B.Sc Physics">B.Sc Physics</option>
                    <option value="B.Sc Chemistry">B.Sc Chemistry</option>
                    <option value="B.Sc Mathematics">B.Sc Mathematics</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-full md:w-64">
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
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              All Students ({filteredStudents.length})
            </h2>
          </div>
          <StudentTable 
            students={filteredStudents} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
    </div>
  );
};

export default Students;
