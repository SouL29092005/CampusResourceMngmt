import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllCourses, createCourse, deleteCourse } from "../../api/admin.course.api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    weeklyHours: "",
    type: "LECTURE",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllCourses();
      setCourses(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.courseCode || !formData.courseName || !formData.weeklyHours) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setAddLoading(true);
      setError(null);
      setSuccess(null);
      
      await createCourse({
        ...formData,
        weeklyHours: parseInt(formData.weeklyHours),
      });

      setSuccess("Course added successfully!");
      setFormData({
        courseCode: "",
        courseName: "",
        weeklyHours: "",
        type: "LECTURE",
      });
      setShowAddModal(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add course");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      setDeleteLoading(true);
      setError(null);
      setSuccess(null);
      
      await deleteCourse(selectedCourse._id);
      
      setSuccess("Course deleted successfully!");
      setSelectedCourse(null);
      setShowDeleteConfirm(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Courses Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
        >
          + Add New Course
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No courses found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-4 text-left font-semibold">Course Code</th>
                  <th className="border p-4 text-left font-semibold">Course Name</th>
                  <th className="border p-4 text-left font-semibold">Weekly Hours</th>
                  <th className="border p-4 text-left font-semibold">Type</th>
                  <th className="border p-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    onClick={() => setSelectedCourse(course)}
                    className={`cursor-pointer transition ${
                      selectedCourse?._id === course._id
                        ? "bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="border p-4">{course.courseCode}</td>
                    <td className="border p-4">{course.courseName}</td>
                    <td className="border p-4 text-center">{course.weeklyHours}</td>
                    <td className="border p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          course.type === "LECTURE"
                            ? "bg-blue-100 text-blue-800"
                            : course.type === "LAB"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.type}
                      </span>
                    </td>
                    <td className="border p-4">
                      {selectedCourse?._id === course._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="bg-blue-500 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Course</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-2xl font-bold hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleAddChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CS101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleAddChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Introduction to Computer Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weekly Hours *
                </label>
                <input
                  type="number"
                  name="weeklyHours"
                  value={formData.weeklyHours}
                  onChange={handleAddChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleAddChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LECTURE">Lecture</option>
                  <option value="LAB">Lab</option>
                  <option value="TUTORIAL">Tutorial</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {addLoading ? "Adding..." : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCourse && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="bg-red-500 text-white p-6">
              <h2 className="text-2xl font-bold">Delete Course</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedCourse.courseName}</strong> ({selectedCourse.courseCode})?
              </p>
              <p className="text-gray-500 text-sm">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCourse}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
}
