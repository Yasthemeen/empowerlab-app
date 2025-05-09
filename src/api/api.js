import axios from 'axios';

// const API_BASE = 'https://empowerlab-app-backend.onrender.com/api/inputs';
const API_BASE = 'http://localhost:9090/api/inputs';

export const getInputNodes = async () => {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
};

export const getClientInputs = async () => {
  const res = await axios.get(`${API_BASE}/client`);
  return res.data;
};

export const getTherapistInputs = async () => {
  const res = await axios.get(`${API_BASE}/therapist`);
  return res.data;
};

export const submitInputData = async (data, isSearchMode = false) => {
  const url = isSearchMode ? `${API_BASE}/search` : `${API_BASE}/submit`;
  const res = await axios.post(url, data);
  return res.data;
};
