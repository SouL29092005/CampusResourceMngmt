import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyIssues } from "../../api/library.api";
import { getMyBookings, getAllEquipments, getFreeSlots, bookEquipment, cancelBooking } from "../../api/lab.api";

export default function StudentDashboard() {
  const [issues, setIssues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [loadingIssues, setLoadingIssues] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [, setLoadingEquipments] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const fetchIssues = async () => {
    try {
      setLoadingIssues(true);
      const res = await getMyIssues();
      setIssues(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await getMyBookings();
      const all = Array.isArray(res?.data?.bookings) ? res.data.bookings : [];
      // only show active bookings
      setBookings(all.filter(b => b.status === "active"));
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      setLoadingEquipments(true);
      const res = await getAllEquipments();
      setEquipments(Array.isArray(res?.data?.equipments) ? res.data.equipments : []);
    } catch (err) {
      console.error(err);
      setEquipments([]);
    } finally {
      setLoadingEquipments(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchBookings();
    fetchEquipments();
    // read user name stored at login
    const n = localStorage.getItem("userName");
    if (n) setUserName(n);
  }, []);

  const openBookingModal = async (equipment) => {
    setSelectedEquipment(equipment);
    setShowBookingModal(true);
    setCustomStart("");
    setCustomEnd("");
    setSlotLoading(true);
    try {
      const res = await getFreeSlots(equipment.equipmentNumber);
      setFreeSlots(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch free slots");
      setFreeSlots([]);
    } finally {
      setSlotLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedEquipment) {
      alert("Please select equipment first");
      return;
    }

    if (!customStart || !customEnd) {
      alert("Please provide start and end times");
      return;
    }

    const start = new Date(customStart);
    const end = new Date(customEnd);

    if (isNaN(start) || isNaN(end)) {
      alert("Invalid start or end time");
      return;
    }

    if (start >= end) {
      alert("Start time must be before end time");
      return;
    }

    const now = new Date();
    const maxAllowedDate = new Date();
    maxAllowedDate.setDate(now.getDate() + 3);

    if (start < now || end > maxAllowedDate) {
      alert("Booking must be within the next 3 days and not in the past");
      return;
    }

    const payload = {
      equipmentNumber: selectedEquipment.equipmentNumber,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    try {
      setBookingLoading(true);
      await bookEquipment(payload);
      alert("Booked successfully");
      setShowBookingModal(false);
      setSelectedEquipment(null);
      setCustomStart("");
      setCustomEnd("");
      fetchBookings();
      fetchEquipments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book equipment");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      fetchBookings();
      fetchEquipments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {userName || 'Student'}!</p>
        </div>

        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">My Borrowed Books</h2>

          {loadingIssues ? (
            <p className="text-gray-500">Loading...</p>
          ) : issues.length === 0 ? (
            <p className="text-gray-500">No borrowed books found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Book</th>
                    <th className="p-2 border">Issued At</th>
                    <th className="p-2 border">Due At</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((iss) => (
                    <tr key={iss._id}>
                      <td className="p-2 border">{iss.book?.title}</td>
                      <td className="p-2 border">{new Date(iss.issuedAt).toLocaleDateString()}</td>
                      <td className="p-2 border">{new Date(iss.dueAt).toLocaleDateString()}</td>
                      <td className="p-2 border">{iss.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Lab Bookings</h2>
            <button
              onClick={() => { setShowBookingModal(true); setSelectedEquipment(null); setFreeSlots([]); setCustomStart(""); setCustomEnd(""); }}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Book Equipment
            </button>
          </div>

          {loadingBookings ? (
            <p className="text-gray-500">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Equipment</th>
                    <th className="p-2 border">Lab</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="p-2 border">{b.equipment?.name}</td>
                      <td className="p-2 border">{b.equipment?.labName}</td>
                      <td className="p-2 border">{new Date(b.startTime).toLocaleDateString()}</td>
                      <td className="p-2 border">{new Date(b.startTime).toLocaleTimeString()} – {new Date(b.endTime).toLocaleTimeString()}</td>
                      <td className="p-2 border">
                        <button onClick={() => handleCancel(b._id)} className="text-red-600">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Book Equipment</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Select Equipment</label>
                <select className="w-full border p-2 rounded" onChange={(e) => {
                  const eq = equipments.find(x => x._id === e.target.value);
                  if (eq) openBookingModal(eq);
                }}>
                  <option value="">-- Select --</option>
                  {equipments.map(eq => (
                    <option key={eq._id} value={eq._id}>{`#${eq.equipmentNumber} - ${eq.name} (${eq.labName})`}</option>
                  ))}
                </select>
              </div>

              {selectedEquipment && (
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="font-semibold">{selectedEquipment.name}</h3>
                  <p className="text-sm text-gray-600">{selectedEquipment.description}</p>

                  <div className="mt-3">
                    <h4 className="font-medium">Available Slots (next 3 days)</h4>

                    {slotLoading ? (
                      <p className="text-gray-500">Loading slots...</p>
                    ) : freeSlots.length === 0 ? (
                      <p className="text-gray-500">No free slots available.</p>
                    ) : (
                      <div className="space-y-2 mt-2">
                        {freeSlots.map((s, idx) => (
                          <div key={idx} className="p-2 border rounded">
                            <div className="text-sm">{new Date(s.freeFrom).toLocaleString()} – {new Date(s.freeTo).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Start Time</label>
                        <input type="datetime-local" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-full border p-2 rounded" />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">End Time</label>
                        <input type="datetime-local" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-full border p-2 rounded" />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Note: Free slots are shown for reference only. Please choose your desired start and end times within the 3 day window.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowBookingModal(false); setSelectedEquipment(null); }} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleBook} disabled={bookingLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{bookingLoading ? 'Booking...' : 'Book'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}