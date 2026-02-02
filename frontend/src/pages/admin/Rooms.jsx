import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";

const ROOM_TYPES = [
  "classroom",
  "laboratory",
  "seminar_hall",
  "auditorium"
];

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [bookingUserFilter, setBookingUserFilter] = useState("");
  const [formData, setFormData] = useState({
    roomId: "",
    location: "",
    roomType: "",
    capacity: "",
    facilities: "",
    department: ""
  });
  const [bookingData, setBookingData] = useState({
    roomId: "",
    date: "",
    startTime: "",
    endTime: ""
  });
  const fetchBookings = useCallback(async () => {
    try {
      const params = {};

      if (bookingStatusFilter) {
        params.status = bookingStatusFilter;
      }

      if (bookingUserFilter) {
        params.bookedBy = bookingUserFilter;
      }

      const res = await api.get(
        "/roomBooking/room-bookings",
        { params }
      );

      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, [bookingStatusFilter, bookingUserFilter]);


  const [editMode, setEditMode] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);



  const openEditModal = (room) => {
    setEditMode(true);
    setEditingRoomId(room.roomId);
    setFormData({
      roomId: room.roomId,
      location: room.location,
      roomType: room.roomType,
      capacity: room.capacity,
      facilities: room.facilities?.join(", ") || "",
      department: room.department || ""
    });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelBooking = async () => {
    try {
      setCancelLoading(true);

      await api.patch(
        `/roomBooking/room-booking/${selectedBooking._id}/cancel`
      );

      setShowCancelModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to cancel booking"
      );
    } finally {
      setCancelLoading(false);
    }
  };


  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        location: formData.location,
        roomType: formData.roomType,
        capacity: Number(formData.capacity),
        facilities: formData.facilities
          ? formData.facilities.split(",").map((f) => f.trim())
          : [],
        department: formData.department || undefined
      };

      if (editMode) {
        await api.patch(`/room/${editingRoomId}/update`, payload);
      } else {
        await api.post("/room/addRoom", {
          roomId: formData.roomId,
          ...payload
        });
      }

      setShowAddModal(false);
      setEditMode(false);
      setEditingRoomId(null);

      setFormData({
        roomId: "",
        location: "",
        roomType: "",
        capacity: "",
        facilities: "",
        department: ""
      });

      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const deactivateBooking = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/bookable`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to deactivate booking", err);
    }
  };

  const reactivateRoom = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/reactivate`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to reactivate room", err);
    }
  };

  const reactivateBooking = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/bookable/reactivate`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to reactivate booking", err);
    }
  };

  const handleCreateBooking = async () => {
    try {
      setBookingLoading(true);
      setBookingError("");

      const { roomId, date, startTime, endTime } = bookingData;

      if (!roomId || !date || !startTime || !endTime) {
        setBookingError("All fields are required");
        return;
      }

      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      if (start >= end) {
        setBookingError("End time must be after start time");
        return;
      }

      await api.post("roomBooking/room-booking", {
        roomId,
        startTime: start,
        endTime: end
      });

      setShowBookingModal(false);
      fetchBookings();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Room already booked or timetable clash";
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };



  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await api.get("/room/getRooms");

      setRooms(res.data?.data || []);

    } catch (err) {
      console.error("Failed to fetch rooms", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const deactivateRoom = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/deactivate`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to deactivate room", err);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomId.toLowerCase().includes(search.toLowerCase()) ||
      room.location.toLowerCase().includes(search.toLowerCase()) ||
      (room.department || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRoomType = roomTypeFilter
      ? room.roomType === roomTypeFilter
      : true;

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "active"
        ? room.isActive
        : !room.isActive;

    return matchesSearch && matchesRoomType && matchesStatus;
  });

  return (
    <>
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Rooms</h1>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                📅 Book Room
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                + Add Room
              </button>
            </div>
          </div>


          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search room / location / department"
              className="border px-3 py-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border px-3 py-2 rounded"
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border rounded overflow-x-auto">
            {loading ? (
              <p className="p-4">Loading rooms...</p>
            ) : (
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Room ID</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Capacity</th>
                    <th className="border p-2">Department</th>
                    <th className="border p-2">Facilities</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center">
                        No rooms found
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((room) => (
                      <tr key={room._id}>
                        <td className="border p-2">{room.roomId}</td>
                        <td className="border p-2">{room.location}</td>
                        <td className="border p-2 capitalize">
                          {room.roomType.replace("_", " ")}
                        </td>
                        <td className="border p-2">{room.capacity}</td>
                        <td className="border p-2">
                          {room.department || "-"}
                        </td>
                        <td className="border p-2">
                          {room.facilities?.length
                            ? room.facilities.join(", ")
                            : "-"}
                        </td>
                        <td className="border p-2 space-y-1">
                          {/* Room active / inactive */}
                          {room.isActive ? (
                            <button
                              onClick={() => deactivateRoom(room.roomId)}
                              className="block text-red-600 cursor-pointer"
                            >
                              Deactivate Room
                            </button>
                          ) : (
                            <button
                              onClick={() => reactivateRoom(room.roomId)}
                              className="block text-green-600 cursor-pointer"
                            >
                              Reactivate Room
                            </button>
                          )}

                          {/* Booking active / inactive */}
                          {room.isActive && (
                            room.isBookable ? (
                              <button
                                onClick={() => deactivateBooking(room.roomId)}
                                className="block text-yellow-600 cursor-pointer"
                              >
                                Deactivate Booking
                              </button>
                            ) : (
                              <button
                                onClick={() => reactivateBooking(room.roomId)}
                                className="block text-green-700 cursor-pointer"
                              >
                                Reactivate Booking
                              </button>
                            )
                          )}

                          {/* Edit only if room active */}
                          {room.isActive && (
                            <button
                              onClick={() => openEditModal(room)}
                              className="block text-blue-600 cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-10">
            <div className="flex gap-4 mb-4">
              {/* Status Filter */}
              <select
                className="border px-3 py-2 rounded"
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Booked By Filter */}
              <select
                className="border px-3 py-2 rounded"
                value={bookingUserFilter}
                onChange={(e) => setBookingUserFilter(e.target.value)}
              >
                <option value="">All Users</option>
                <option value="me">My Bookings</option>
                <option value="others">Others</option>
              </select>

              <button
                onClick={fetchBookings}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Room Bookings</h2>

            <div className="bg-white border rounded overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Booking #</th>
                    <th className="border p-2">Room</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Booked By</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b._id}>
                        <td className="border p-2">{b.bookingNumber}</td>
                        <td className="border p-2">{b.roomId}</td>
                        <td className="border p-2">
                          {new Date(b.startTime).toLocaleDateString()}
                        </td>
                        <td className="border p-2">
                          {new Date(b.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                          {" - "}
                          {new Date(b.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="border p-2">
                          {b.bookedBy?.name || "-"}
                        </td>
                        <td className="border p-2 capitalize">{b.status}</td>
                        <td className="border p-2">
                          {b.status === "active" ? (
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setShowCancelModal(true);
                              }}
                              className="text-red-600 cursor-pointer"
                            >
                              Cancel
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </AdminLayout>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Room" : "Add Room"}
            </h2>


            <form onSubmit={handleAddRoom} className="space-y-4">
              <input
                name="roomId"
                placeholder="Room ID *"
                value={formData.roomId}
                onChange={handleInputChange}
                required
                disabled={editMode}
                className={`w-full border px-3 py-2 rounded ${
                  editMode
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              />


              <input
                name="location"
                placeholder="Location *"
                className="w-full border px-3 py-2 rounded"
                value={formData.location}
                onChange={handleInputChange}
                required
              />

              <select
                name="roomType"
                className="w-full border px-3 py-2 rounded"
                value={formData.roomType}
                onChange={handleInputChange}
                required
              >
                <option value="">Room Type *</option>
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>

              <input
                name="capacity"
                type="number"
                placeholder="Capacity *"
                className="w-full border px-3 py-2 rounded"
                value={formData.capacity}
                onChange={handleInputChange}
                min={1}
                required
              />

              <input
                name="facilities"
                placeholder="Facilities (optional) — comma separated"
                className="w-full border px-3 py-2 rounded"
                value={formData.facilities}
                onChange={handleInputChange}
              />

              <input
                name="department"
                placeholder="Department (optional)"
                className="w-full border px-3 py-2 rounded"
                value={formData.department}
                onChange={handleInputChange}
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditMode(false);
                    setEditingRoomId(null);
                    setFormData({
                      roomId: "",
                      location: "",
                      roomType: "",
                      capacity: "",
                      facilities: "",
                      department: ""
                    });
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Book a Room</h2>

            {bookingError && (
              <p className="text-red-600 mb-3">{bookingError}</p>
            )}

            <div className="space-y-4">
              {/* Room */}
              <select
                value={bookingData.roomId}
                onChange={(e) =>
                  setBookingData({ ...bookingData, roomId: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Room *</option>
                {rooms
                  .filter((r) => r.isActive && r.isBookable)
                  .map((room) => (
                    <option key={room.roomId} value={room.roomId}>
                      {room.roomId} ({room.location})
                    </option>
                  ))}
              </select>

              {/* Date */}
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
              />

              {/* Start Time */}
              <input
                type="time"
                className="w-full border px-3 py-2 rounded"
                value={bookingData.startTime}
                onChange={(e) =>
                  setBookingData({ ...bookingData, startTime: e.target.value })
                }
              />

              {/* End Time */}
              <input
                type="time"
                className="w-full border px-3 py-2 rounded"
                value={bookingData.endTime}
                onChange={(e) =>
                  setBookingData({ ...bookingData, endTime: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingError("");
                    setBookingData({
                      roomId: "",
                      date: "",
                      startTime: "",
                      endTime: ""
                    });
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateBooking}
                  disabled={bookingLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {bookingLoading ? "Booking..." : "Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">
              Cancel Booking
            </h2>

            <p className="mb-4">
              Are you sure you want to cancel booking #
              <strong>{selectedBooking.bookingNumber}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 border rounded"
              >
                No
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default AdminRooms;
