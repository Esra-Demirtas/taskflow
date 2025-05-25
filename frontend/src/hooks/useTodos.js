import { useState, useEffect } from 'react';
import axios from 'axios';

const useTodos = (filters = {}) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const response = await axios.get('/api/todos', { params });
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filters]);

  return { todos, loading, error, refetch: fetchTodos };
};

export default useTodos;
