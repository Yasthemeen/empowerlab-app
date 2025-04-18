import axios from 'axios';

const API_BASE = 'https://empowerlab-app-backend.onrender.com/api/inputs';

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

export const submitInputData = async (data) => {
  const res = await axios.post(`${API_BASE}/submit`, data);
  return res.data;
};
