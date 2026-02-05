import api from "./axios";

export const getAllCourses = async () => {
  return await api.get("/subject");
};
