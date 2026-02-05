import api from "./axios";

export const getMyProfile = async () => {
  return await api.get("/users/me");
};

export const updateMyProfile = async (data) => {
  return await api.put("/users/update-me", data);
};
