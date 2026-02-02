import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getActiveBookings, getAllEquipments, addEquipment, deleteEquipment } from "../../api/lab.api";

function Lab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(true);
  const [equipmentsError, setEquipmentsError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    labName: "",
    location: "",
    maintainedByEmail: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleAddEquipment = async () => {
    try {
      setSubmitLoading(true);
      const res = await addEquipment(formData);
      setEquipments((prev) => [
        res.data.equipment,
        ...prev
      ]);
      setShowAddModal(false);
      setFormData({
        name: "",
        description: "",
        labName: "",
        location: "",
        maintainedByEmail: ""
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add equipment");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      setEquipmentsLoading(true);
      const res = await getAllEquipments();
      setEquipments(
        Array.isArray(res?.data?.equipments) ? res.data.equipments : []
      );
    } catch (err) {
      setEquipmentsError(
        err.response?.data?.message || "Failed to load equipments"
      );
    } finally {
      setEquipmentsLoading(false);
    }
  };



  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getActiveBookings();
        setBookings(
          Array.isArray(res?.data?.bookings) ? res.data.bookings : []
        );
      } catch (err) {
        console.error("Bookings error:", err);
        setBookings([]);
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    fetchEquipments();
  }, []);



  return (
    <>
      {showAddModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
          
          <h2 className="text-lg font-semibold mb-4">Add Equipment</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Equipment Name"
              className="w-full border p-2 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Lab Name"
              className="w-full border p-2 rounded"
              value={formData.labName}
              onChange={(e) =>
                setFormData({ ...formData, labName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Location"
              className="w-full border p-2 rounded"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* Admin-only field */}
            <input
              type="email"
              placeholder="Maintained By (Lab Admin Email)"
              className="w-full border p-2 rounded"
              value={formData.maintainedByEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maintainedByEmail: e.target.value
                })
              }
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>

            <button
              onClick={handleAddEquipment}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={submitLoading}
            >
              {submitLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    )}

      {showDeleteModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Delete Equipment
            </h2>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete
              <span className="font-semibold"> {selectedEquipment.name}</span>?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                disabled={deleteLoading}
                onClick={async () => {
                  try {
                    setDeleteLoading(true);
                    await deleteEquipment(selectedEquipment._id);
                    await fetchEquipments();
                    setShowDeleteModal(false);
                    setSelectedEquipment(null);
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                      "Failed to delete equipment"
                    );
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}


      <AdminLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Lab Equipments</h1>

          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              + Create Booking
            </button>

            <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Add Equipment
            </button>
          </div>
        </div>


        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Active Equipment Bookings
          </h2>

          {loading && (
            <p className="text-gray-500">Loading bookings...</p>
          )}

          {error && (
            <p className="text-red-600">{error}</p>
          )}

          {!loading && bookings.length === 0 && (
            <p className="text-gray-500">No active bookings found.</p>
          )}

          {!loading && bookings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Equipment</th>
                    <th className="p-2 border">Lab</th>
                    <th className="p-2 border">Booked By</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Time Slot</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="p-2 border">
                        {booking.equipment?.name}
                      </td>

                      <td className="p-2 border">
                        {booking.equipment?.labName}
                      </td>

                      <td className="p-2 border">
                        {booking.bookedBy?.name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {booking.bookedBy?.email}
                        </span>
                      </td>

                      <td className="p-2 border">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </td>

                      <td className="p-2 border">
                        {new Date(booking.startTime).toLocaleTimeString()} –{" "}
                        {new Date(booking.endTime).toLocaleTimeString()}
                      </td>

                      <td className="p-2 border">
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow mt-8">
          <h2 className="text-lg font-semibold mb-4">
            All Lab Equipments
          </h2>

          {equipmentsLoading && (
            <p className="text-gray-500">Loading equipments...</p>
          )}

          {equipmentsError && (
            <p className="text-red-600">{equipmentsError}</p>
          )}

          {!equipmentsLoading && equipments.length === 0 && (
            <p className="text-gray-500">No equipments found.</p>
          )}

          {!equipmentsLoading && equipments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Equipment #</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Lab</th>
                    <th className="p-2 border">Maintained By</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {equipments.map((eq) => (
                    <tr 
                      key={eq._id}
                      onClick={() => {
                        setSelectedEquipment(eq);
                        setShowDeleteModal(true);
                      }}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="p-2 border">{eq.equipmentNumber}</td>

                      <td className="p-2 border">{eq.name}</td>

                      <td className="p-2 border">{eq.labName}</td>

                      <td className="p-2 border">
                        {eq.maintainedBy?.userId?.name || "—"}
                        <br />
                        <span className="text-xs text-gray-500">
                          {eq.maintainedBy?.userId?.email || ""}
                        </span>
                      </td>



                      <td className="p-2 border">
                        <span
                          className={`font-medium ${
                            eq.status === "available"
                              ? "text-green-600"
                              : eq.status === "in-use"
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {eq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </AdminLayout>
    </>
  );
}

export default Lab;
