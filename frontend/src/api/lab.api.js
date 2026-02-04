import API from "./axios";

export const getActiveBookings = () => {
  return API.get("/lab/bookings/active");
};

export const getMyBookings = () => {
  return API.get("/lab/bookings/my");
};

export const getAllEquipments = () => {
  return API.get("/lab/getEquipments");
};

export const getFreeSlots = (equipmentNumber) => {
  return API.get(`/lab/equipment/${equipmentNumber}/free-slots`);
};

export const bookEquipment = (payload) => {
  return API.post(`/lab/equipment/book`, payload);
};

export const cancelBooking = (bookingId) => {
  return API.patch(`/lab/booking/${bookingId}/cancel`);
};

export const addEquipment = (data) => {
  return API.post("/lab/addEquipment", data);
}

export const deleteEquipment = (equipmentId) => {
  return API.delete(`/lab/equipment/${equipmentId}`);
};