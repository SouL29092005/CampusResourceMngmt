import { useState, useEffect } from "react";
import { updateMyProfile } from "../../api/profile.api";
import { getAllCourses } from "../../api/course.api";

export default function EditProfileModal({
  profileData,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (profileData) {
      // Filter out system fields
      const filteredData = {};
      Object.entries(profileData).forEach(([key, value]) => {
        if (
          !["_id", "userId", "__v", "createdAt", "updatedAt"].includes(key)
        ) {
          filteredData[key] = value;
        }
      });
      setFormData(filteredData);
    }
    fetchCourses();
  }, [profileData]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await getAllCourses();
      setCourses(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnrolledSubjectsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedCourseIds = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      enrolledSubjects: selectedCourseIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await updateMyProfile(formData);

      setSuccess(true);
      if (onUpdate) {
        onUpdate(res.data.profile);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-gray-200 transition"
          >
            ×
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, value]) => {
              // Skip array fields - they'll be handled separately
              if (Array.isArray(value)) {
                return null;
              }

              if (!["string", "number"].includes(typeof value)) {
                return null;
              }

              const label = key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1");

              return (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type={typeof value === "number" ? "number" : "text"}
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder={label}
                  />
                </div>
              );
            })}

            {/* Add explicit fields for librarian profile if not already in formData */}
            {!("qualification" in formData) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Qualification"
                />
              </div>
            )}

            {!("librarySection" in formData) && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Library Section
                </label>
                <input
                  type="text"
                  name="librarySection"
                  value={formData.librarySection || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Library Section"
                />
              </div>
            )}
          </div>

          {/* Enrolled Subjects Section */}
          {formData.enrolledSubjects && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enrolled Subjects
              </label>
              {loadingCourses ? (
                <p className="text-gray-500">Loading courses...</p>
              ) : (
                <select
                  multiple
                  value={formData.enrolledSubjects || []}
                  onChange={handleEnrolledSubjectsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName} ({course.courseCode})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (Cmd on Mac) to select multiple courses
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⟳</span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
