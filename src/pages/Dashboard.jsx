import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAttendance } from "../context/AttendanceContext";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    students,
    attendanceRecords,
    activities,
    getStatistics,
    settings,
  } = useAttendance();

  // ================================
  // STATES
  // ================================

  const [themeColor] = useState(
    () => localStorage.getItem("themeColor") || "blue"
  );

  const [statistics, setStatistics] = useState(getStatistics());

  const [holidays, setHolidays] = useState([]);
  const [holidayLoading, setHolidayLoading] = useState(false);
  const [holidayError, setHolidayError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // ================================
  // CALENDARIFIC API
  // ================================

  const API_URL =
    "https://calendarific.com/api/v2/holidays?api_key=CdfbmEGwTRgAu7zvKlgU2E0fWmsGjN2H&country=IN&year=2026";

  const colorClasses = {
    blue: "from-blue-600 to-blue-800",
    green: "from-green-600 to-green-800",
    purple: "from-purple-600 to-purple-800",
    red: "from-red-600 to-red-800",
    orange: "from-orange-600 to-orange-800",
  };

  // ================================
  // SAFE API VALUE FUNCTIONS
  // ================================

  const safeText = (value, fallback = "N/A") => {
    if (value === null || value === undefined) {
      return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.length > 0
        ? value.map((item) => safeText(item, "")).filter(Boolean).join(", ")
        : fallback;
    }

    if (typeof value === "object") {
      return Object.values(value)
        .map((item) => safeText(item, ""))
        .filter(Boolean)
        .join(", ") || fallback;
    }

    return fallback;
  };

  // IMPORTANT:
  // Calendarific "states" can sometimes be an object/string,
  // so NEVER directly use holiday.states.join().

  const getStates = (holiday) => {
    if (!holiday || holiday.states === null || holiday.states === undefined) {
      return "India";
    }

    if (Array.isArray(holiday.states)) {
      return holiday.states.length > 0
        ? holiday.states.join(", ")
        : "India";
    }

    if (typeof holiday.states === "string") {
      return holiday.states || "India";
    }

    if (typeof holiday.states === "object") {
      return Object.values(holiday.states)
        .map((state) => safeText(state, ""))
        .filter(Boolean)
        .join(", ") || "India";
    }

    return "India";
  };

  const getHolidayType = (holiday) => {
    if (!holiday) return "Holiday";

    if (Array.isArray(holiday.type)) {
      return holiday.type.join(", ");
    }

    if (typeof holiday.type === "string") {
      return holiday.type;
    }

    return holiday.primary_type || "Holiday";
  };

  const getHolidayDate = (holiday) => {
    return holiday?.date?.iso || holiday?.date?.datetime?.date || "N/A";
  };

  const getHolidayDay = (holiday) => {
    const date = getHolidayDate(holiday);

    if (date === "N/A") {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  // ================================
  // FETCH HOLIDAYS
  // ================================

  const fetchHolidays = async () => {
    setHolidayLoading(true);
    setHolidayError("");

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("Calendarific API Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.meta?.error_detail ||
            data?.meta?.error_message ||
            "Holiday API request failed"
        );
      }

      if (data?.meta?.code === 200) {
        const holidayData = data?.response?.holidays;

        if (Array.isArray(holidayData)) {
          setHolidays(holidayData);
        } else {
          setHolidays([]);
        }
      } else {
        throw new Error(
          data?.meta?.error_detail ||
            data?.meta?.error_message ||
            "Invalid holiday API response"
        );
      }
    } catch (error) {
      console.error("Holiday API Error:", error);

      setHolidayError(
        error?.message || "Unable to load holidays from Calendarific API"
      );

      setHolidays([]);
    } finally {
      setHolidayLoading(false);
    }
  };

  // ================================
  // STATISTICS UPDATE
  // ================================

  useEffect(() => {
    setStatistics(getStatistics());
  }, [students, attendanceRecords, activities, getStatistics]);

  // ================================
  // INITIAL HOLIDAY LOAD
  // ================================

  useEffect(() => {
    fetchHolidays();
  }, []);

  // ================================
  // CALENDAR BUTTON
  // ================================

  const handleCalendarClick = () => {
    setShowCalendar((previous) => !previous);
  };

  // ================================
  // SECTION 1
  // WELCOME HEADER
  // ================================

  const WelcomeHeader = () => (
    <div
      className={`bg-gradient-to-r ${
        colorClasses[themeColor] || colorClasses.blue
      } rounded-xl p-6 text-white mb-6`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {settings?.name || "User"}! 👋
          </h1>

          <p className="text-blue-100">
            Here's what's happening with your class attendance today.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
            {settings?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-blue-100">
        <span>📅</span>

        <span>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );

  // ================================
  // SECTION 2
  // STATISTICS
  // ================================

  const StatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Students"
        value={statistics.totalStudents}
        icon="👥"
        color="blue"
        trend={5}
      />

      <StatCard
        title="Present Today"
        value={statistics.presentToday}
        icon="✅"
        color="green"
        trend={8}
      />

      <StatCard
        title="Absent Today"
        value={statistics.absentToday}
        icon="❌"
        color="red"
        trend={-3}
      />

      <StatCard
        title="Average Attendance"
        value={`${statistics.averageAttendance}%`}
        icon="📊"
        color="purple"
        trend={2}
      />
    </div>
  );

  // ================================
  // SECTION 3
  // TODAY'S ATTENDANCE
  // ================================

  const TodaysAttendance = () => {
    const today = new Date().toISOString().split("T")[0];

    const todayRecords = attendanceRecords.filter(
      (record) => record.date === today
    );

    const getStatusBadge = (status) => {
      const badges = {
        Present:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",

        Absent:
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",

        Late:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      };

      return badges[status] || badges.Present;
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Today's Attendance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Student ID
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Name
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Class
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Check-in Time
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {todayRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No attendance records for today
                  </td>
                </tr>
              ) : (
                todayRecords.slice(0, 5).map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {record.studentId}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {record.studentName}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {record.className}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {record.date}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {record.checkInTime}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ================================
  // SECTION 4
  // ATTENDANCE OVERVIEW
  // ================================

  const AttendanceOverview = () => {
    const total =
      statistics.presentToday +
      statistics.absentToday +
      statistics.lateToday;

    const presentPercent =
      total > 0
        ? Math.round((statistics.presentToday / total) * 100)
        : 0;

    const absentPercent =
      total > 0
        ? Math.round((statistics.absentToday / total) * 100)
        : 0;

    const latePercent =
      total > 0
        ? Math.round((statistics.lateToday / total) * 100)
        : 0;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Attendance Overview
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Present
              </span>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {presentPercent}%
              </span>
            </div>

            <ProgressBar value={presentPercent} color="green" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Absent
              </span>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {absentPercent}%
              </span>
            </div>

            <ProgressBar value={absentPercent} color="red" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Late
              </span>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {latePercent}%
              </span>
            </div>

            <ProgressBar value={latePercent} color="yellow" />
          </div>
        </div>
      </div>
    );
  };

  // ================================
  // SECTION 5
  // RECENT ACTIVITY
  // ================================

  const RecentActivity = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {activities.slice(0, 5).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className="text-2xl">
              {activity.type === "present"
                ? "✅"
                : activity.type === "absent"
                ? "❌"
                : activity.type === "late"
                ? "⏰"
                : "🔄"}
            </span>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {activity.message}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ================================
  // SECTION 6
  // QUICK ACTIONS
  // ================================

  const QuickActions = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <button
          onClick={() => navigate("/attendance")}
          className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <span className="text-3xl mb-2">📋</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mark Attendance
          </span>
        </button>

        <button
          onClick={() => navigate("/students")}
          className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-30 rounded-lg hover:bg-green-100 transition-colors"
        >
          <span className="text-3xl mb-2">👥</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            View Students
          </span>
        </button>

        <button
          onClick={() => navigate("/reports")}
          className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <span className="text-3xl mb-2">📈</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reports
          </span>
        </button>

        <button
          onClick={() => navigate("/students")}
          className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-30 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <span className="text-3xl mb-2">➕</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Student
          </span>
        </button>

        <button
          onClick={handleCalendarClick}
          className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-30 rounded-lg hover:bg-red-100 transition-colors"
        >
          <span className="text-3xl mb-2">📅</span>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {showCalendar ? "Hide Calendar" : "View Calendar"}
          </span>
        </button>

      </div>
    </div>
  );

  // ================================
  // SECTION 7
  // TOP ATTENDANCE STUDENTS
  // ================================

  const TopAttendanceStudents = () => {
    const topStudents = [...students]
      .sort((a, b) => b.attendance - a.attendance)
      .slice(0, 5);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Top Attendance Students
        </h2>

        <div className="space-y-4">
          {topStudents.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center gap-4"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {student.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {student.studentId}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {student.attendance}%
                </p>

                <ProgressBar
                  value={student.attendance}
                  color="green"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ================================
  // SECTION 8
  // INDIA HOLIDAYS
  // ================================

  const HolidaysSection = () => {
    if (!showCalendar) {
      return null;
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              🇮🇳 India Holidays 2026
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete holiday data from Calendarific API
            </p>
          </div>

          <button
            onClick={fetchHolidays}
            disabled={holidayLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {holidayLoading ? "Refreshing..." : "🔄 Refresh"}
          </button>

        </div>

        {/* Loading */}
        {holidayLoading && (
          <div className="p-6 text-center">
            <div className="text-3xl mb-2">⏳</div>

            <p className="text-gray-600 dark:text-gray-300">
              Loading holidays...
            </p>
          </div>
        )}

        {/* Error */}
        {!holidayLoading && holidayError && (
          <div className="p-4 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 text-red-700 dark:text-red-300 rounded-lg mb-4">
            <strong>API Error:</strong> {holidayError}

            <button
              onClick={fetchHolidays}
              className="ml-3 underline font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Data */}
        {!holidayLoading &&
          !holidayError &&
          holidays.length === 0 && (
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <div className="text-3xl mb-2">📅</div>

              <p className="text-gray-600 dark:text-gray-300">
                No holidays found.
              </p>
            </div>
          )}

        {/* Summary */}
        {!holidayLoading &&
          !holidayError &&
          holidays.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Holidays
                  </p>

                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {holidays.length}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-30 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Country
                  </p>

                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    India 🇮🇳
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-30 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Year
                  </p>

                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    2026
                  </p>
                </div>

              </div>

              {/* FULL HOLIDAY DATA */}
              <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        #
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Holiday
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Day
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Primary Type
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Location / State
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Description
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

                    {holidays.map((holiday, index) => (

                      <tr
                        key={`${safeText(holiday?.name, "holiday")}-${index}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >

                        {/* Number */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {index + 1}
                        </td>

                        {/* Holiday Name */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2">

                            <span className="text-xl">
                              📅
                            </span>

                            <span className="font-semibold text-gray-800 dark:text-white">
                              {safeText(
                                holiday?.name,
                                "Unnamed Holiday"
                              )}
                            </span>

                          </div>

                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {getHolidayDate(holiday)}
                        </td>

                        {/* Day */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {getHolidayDay(holiday)}
                        </td>

                        {/* Type */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {getHolidayType(holiday)}
                        </td>

                        {/* Primary Type */}
                        <td className="px-4 py-4">

                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {safeText(
                              holiday?.primary_type,
                              "Holiday"
                            )}
                          </span>

                        </td>

                        {/* SAFE STATES */}
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {getStates(holiday)}
                        </td>

                        {/* Description */}
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 min-w-[250px]">
                          {safeText(
                            holiday?.description,
                            "No description available"
                          )}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            </>
          )}

      </div>
    );
  };

  // ================================
  // SECTION 9
  // FOOTER
  // ================================

  const DashboardFooter = () => (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-6">

      <div className="px-6 py-4">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-center md:text-left">

            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 Student Attendance Tracker. All rights reserved.
            </p>

          </div>

          <div className="flex items-center gap-6">

            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm">
              Privacy Policy
            </button>

            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm">
              Terms of Service
            </button>

            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-sm">
              Support
            </button>

          </div>

        </div>

      </div>

    </footer>
  );

  // ================================
  // MAIN DASHBOARD
  // ================================

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        settings?.darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >

      <WelcomeHeader />

      <StatisticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <TodaysAttendance />

        <AttendanceOverview />

      </div>

      <RecentActivity />

      <QuickActions />

      <TopAttendanceStudents />

      <HolidaysSection />

      <DashboardFooter />

    </div>
  );
};

export default Dashboard;
