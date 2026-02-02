import API from "./axios";

export const getActiveBookings = () => {
  return API.get("/lab/bookings/active");
};

export const getAllEquipments = () => {
  return API.get("/lab/getEquipments");
};

export const addEquipment = (data) => {
  return API.post("/lab/addEquipment", data);
}

export const deleteEquipment = (equipmentId) => {
  return API.delete(`/lab/equipment/${equipmentId}`);
};