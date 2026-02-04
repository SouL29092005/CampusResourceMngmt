import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const scrollToContact = () => {
    const section = document.getElementById("login-contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      // store display name for welcome banner
      if (user?.name) localStorage.setItem("userName", user.name);

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "lab_admin":
          navigate("/lab-admin/dashboard");
          break;

        case "librarian":
          navigate("/librarian/dashboard");
          break;

        case "faculty":
          navigate("/faculty/dashboard");
          break;

        case "student":
          navigate("/student/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);

      const message =
        err.response?.data?.message || "Invalid email or password";

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Login to Your Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Need help?{" "}
            <button
              type="button"
              onClick={scrollToContact}
              className="text-indigo-600 hover:underline"
            >
              Contact Us
            </button>
          </p>

        </div>
      </div>

      <footer
      id="login-contact"
      className="bg-gray-900 text-white py-10"
    >
      <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
        <h3 className="text-lg font-semibold">Contact Us</h3>
        <p>Email: campus.support@college.edu</p>
        <p>Phone: +91 98765 43210</p>
      </div>
    </footer>
    </div>    
  );
}

export default Login;