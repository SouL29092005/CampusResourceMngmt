import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/library", label: "Library" },
  { to: "/admin/lab", label: "Lab Equipments" },
  { to: "/admin/rooms", label: "Rooms" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/timetable", label: "Timetable" }
];

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

      <nav className="space-y-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              isActive
                ? "block bg-indigo-600 px-4 py-2 rounded"
                : "block px-4 py-2 rounded hover:bg-gray-700"
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
