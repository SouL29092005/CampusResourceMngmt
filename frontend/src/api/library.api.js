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

export const issueBook = (payload) => {
  return axios.post('/library/issue', payload);
};

export const returnBook = (payload) => {
  return axios.post('/library/return', payload);
};

export const updateBookStatus = (payload) => {
  return axios.post('/library/updateBookStatus', payload);
};

export const getBookByAccession = (accessionNumber) => {
  return axios.get(`/library/book/${accessionNumber}`);
};

export const fetchOverdueIssues = () => {
  return axios.get('/library/issues/overdue');
};