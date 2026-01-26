import { Link } from "react-router-dom";

export default function Navbar() {
  const scrollToContact = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          Campus Resource Management System
        </h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            Login
          </Link>

          <button
            onClick={scrollToContact}
            className="text-gray-600 hover:text-blue-600"
          >
            Contact Us
          </button>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
