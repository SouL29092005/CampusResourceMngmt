import { useState } from "react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const scrollToContact = () => {
    const section = document.getElementById("login-contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Login to Your Account
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@college.edu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
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