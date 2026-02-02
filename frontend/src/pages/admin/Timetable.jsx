import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../api/axios";

function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await api.get("timetable/getTimetable");
      setTimetable(res.data.data);
    } catch {
      setError("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const uploadCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/timetable/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      await fetchTimetable();
      alert("Timetable uploaded successfully");
    } catch {
      alert("Failed to upload timetable");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Timetable</h1>

        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {uploading ? "Uploading..." : "Upload New Timetable"}
          <input
            type="file"
            accept=".csv"
            onChange={uploadCSV}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading && <p>Loading timetable...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && timetable.length === 0 && (
        <p className="text-gray-500">No timetable uploaded yet.</p>
      )}

      {!loading && timetable.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Day</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Room</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Faculty</th>
                <th className="border p-2">Dept</th>
                <th className="border p-2">Sem</th>
              </tr>
            </thead>

            <tbody>
              {timetable.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="border p-2">{entry.dayOfWeek}</td>
                  <td className="border p-2">
                    {entry.startTime} - {entry.endTime}
                  </td>
                  <td className="border p-2">
                    {entry.roomId} ({entry.roomType})
                  </td>
                  <td className="border p-2">
                    {entry.courseCode} - {entry.courseName}
                  </td>
                  <td className="border p-2">{entry.facultyName}</td>
                  <td className="border p-2">{entry.department}</td>
                  <td className="border p-2">{entry.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default Timetable;
