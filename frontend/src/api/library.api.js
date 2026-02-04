import axios from "./axios";

export const fetchActiveIssues = () => {
  return axios.get("/library/issues/active");
};

export const getMyIssues = () => {
  return axios.get("/library/issues/my");
};

export const searchBookByName = (title) => {
  return axios.get(`/library/search?title=${title}`);
};

export const addBooks = (payload) => {
  return axios.post("/library/addBooks", payload);
};