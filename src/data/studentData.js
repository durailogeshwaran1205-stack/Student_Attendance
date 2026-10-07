// Local sample student data
// This file contains static data for the Student Attendance Tracker

export const initialStudents = [
  {
    id: 1,
    studentId: "ST001",
    name: "Arun Kumar",
    email: "arun@example.com",
    className: "B.Sc Computer Science",
    attendance: 92
  },
  {
    id: 2,
    studentId: "ST002",
    name: "Priya S",
    email: "priya@example.com",
    className: "B.Sc Computer Science",
    attendance: 88
  },
  {
    id: 3,
    studentId: "ST003",
    name: "Karthik R",
    email: "karthik@example.com",
    className: "B.Sc Computer Science",
    attendance: 95
  },
  {
    id: 4,
    studentId: "ST004",
    name: "Divya M",
    email: "divya@example.com",
    className: "B.Sc Computer Science",
    attendance: 78
  },
  {
    id: 5,
    studentId: "ST005",
    name: "Rahul N",
    email: "rahul@example.com",
    className: "B.Sc Computer Science",
    attendance: 85
  },
  {
    id: 6,
    studentId: "ST006",
    name: "Sneha P",
    email: "sneha@example.com",
    className: "B.Sc Computer Science",
    attendance: 90
  },
  {
    id: 7,
    studentId: "ST007",
    name: "Vikram S",
    email: "vikram@example.com",
    className: "B.Sc Computer Science",
    attendance: 82
  },
  {
    id: 8,
    studentId: "ST008",
    name: "Anitha K",
    email: "anitha@example.com",
    className: "B.Sc Computer Science",
    attendance: 87
  },
  {
    id: 9,
    studentId: "ST009",
    name: "Suresh T",
    email: "suresh@example.com",
    className: "B.Sc Computer Science",
    attendance: 76
  },
  {
    id: 10,
    studentId: "ST010",
    name: "Lakshmi V",
    email: "lakshmi@example.com",
    className: "B.Sc Computer Science",
    attendance: 94
  },
  {
    id: 11,
    studentId: "ST011",
    name: "Mohan D",
    email: "mohan@example.com",
    className: "B.Sc Computer Science",
    attendance: 89
  },
  {
    id: 12,
    studentId: "ST012",
    name: "Kavitha R",
    email: "kavitha@example.com",
    className: "B.Sc Computer Science",
    attendance: 91
  }
];

// Sample attendance records
export const initialAttendanceRecords = [
  {
    id: 1,
    studentId: "ST001",
    studentName: "Arun Kumar",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "09:00 AM",
    status: "Present"
  },
  {
    id: 2,
    studentId: "ST002",
    studentName: "Priya S",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "09:15 AM",
    status: "Present"
  },
  {
    id: 3,
    studentId: "ST003",
    studentName: "Karthik R",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "09:05 AM",
    status: "Present"
  },
  {
    id: 4,
    studentId: "ST004",
    studentName: "Divya M",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "09:30 AM",
    status: "Late"
  },
  {
    id: 5,
    studentId: "ST005",
    studentName: "Rahul N",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "-",
    status: "Absent"
  },
  {
    id: 6,
    studentId: "ST006",
    studentName: "Sneha P",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "08:55 AM",
    status: "Present"
  },
  {
    id: 7,
    studentId: "ST007",
    studentName: "Vikram S",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "09:10 AM",
    status: "Present"
  },
  {
    id: 8,
    studentId: "ST008",
    studentName: "Anitha K",
    className: "B.Sc Computer Science",
    date: "2024-01-15",
    checkInTime: "09:20 AM",
    status: "Present"
  }
];

// Sample recent activities
export const recentActivities = [
  {
    id: 1,
    message: "Arun Kumar marked as Present",
    time: "2 minutes ago",
    type: "present"
  },
  {
    id: 2,
    message: "Priya S marked as Present",
    time: "5 minutes ago",
    type: "present"
  },
  {
    id: 3,
    message: "Divya M marked as Late",
    time: "10 minutes ago",
    type: "late"
  },
  {
    id: 4,
    message: "Rahul N marked as Absent",
    time: "15 minutes ago",
    type: "absent"
  },
  {
    id: 5,
    message: "Attendance record updated",
    time: "20 minutes ago",
    type: "update"
  }
];
