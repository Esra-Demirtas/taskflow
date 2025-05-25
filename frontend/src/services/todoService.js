// src/services/todoService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getTodos = async () => {
  const response = await axios.get(`${API_URL}/todos`);
  return response.data.data;
};

export const deleteTodo = async (id) => {
  return await axios.delete(`${API_URL}/todos/${id}`);
};
