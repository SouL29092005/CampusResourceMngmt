import api from "./axios";

export const getAllCourses = async () => {
  return await api.get("/subject");
};

export const createCourse = async (data) => {
  return await api.post("/subject/create", data);
};

export const deleteCourse = async (id) => {
  return await api.delete(`/subject/delete/${id}`);
};

export const updateCourse = async (id, data) => {
  return await api.put(`/subject/update/${id}`, data);
};
