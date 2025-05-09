import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Units API
export const getUnits = async () => {
  const response = await api.get('/units');
  return response.data;
};

export const getUnitById = async (id) => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

export const createUnit = async (unitData) => {
  const response = await api.post('/units', unitData);
  return response.data;
};

export const updateUnit = async (id, unitData) => {
  const response = await api.put(`/units/${id}`, unitData);
  return response.data;
};

export const deleteUnit = async (id) => {
  const response = await api.delete(`/units/${id}`);
  return response.data;
};

export const searchUnits = async (query) => {
  const response = await api.get(`/units/search/${query}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export default api;