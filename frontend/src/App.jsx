import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Library from "./pages/admin/Library";
import Lab from "./pages/admin/Lab";
import Rooms from "./pages/admin/Rooms";
import Timetable from "./pages/admin/Timetable";

import StudentDashboard from "./pages/student/StudentDashboard";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/library" element={<Library />} />
        <Route path="/admin/lab" element={<Lab />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/timetable" element={<Timetable />} />
      </Route>

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>
    </Routes>
  );
}
