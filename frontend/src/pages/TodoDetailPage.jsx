import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TodoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/categories/${id}/todos`);
      setTodos(res.data.data);
      setError(null);
    } catch (err) {
      setError('Todo listesi alınırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Geri
      </button>

      <h1 className="text-3xl font-bold mb-6">Kategori {id} Todo Listesi</h1>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && todos.length === 0 && <p>Bu kategoride todo bulunmamaktadır.</p>}

      <ul className="list-disc list-inside space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="border p-4 rounded shadow-sm">
            <h2 className="font-semibold text-lg">{todo.title}</h2>
            <p>Durum: <strong>{todo.status}</strong></p>
            <p>Öncelik: <strong>{todo.priority}</strong></p>
            {todo.description && <p>Açıklama: {todo.description}</p>}
            {/* Diğer todo detayları varsa buraya ekleyebilirsin */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoDetailPage;
