import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from '../components/todo/TodoForm';

const API_BASE_URL = 'http://localhost:8000/api';

const statusLabels = {
  pending: 'Beklemede',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

const priorityLabels = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
};

const TodoListPage = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

const fetchTodos = async () => {
  setLoading(true);
  try {
    const params = { page, limit, sort, order };
    if (filterStatus) params.status = filterStatus;
    if (filterPriority) params.priority = filterPriority;
    if (searchTerm) params.q = searchTerm;

    const res = await axios.get(`${API_BASE_URL}/todos`, { params });

    console.log('API Response:', res.data); 

    setTodos(res.data.data); 
    setTotalPages(res.data.pagination?.last_page || 1); 
    setError('');
  } catch (e) {
    console.error("Todo listesi yüklenirken hata oluştu:", e);
    setError('Todo listesi yüklenirken hata oluştu. Lütfen konsolu kontrol edin.');
    setTodos([]);
    setTotalPages(1); 
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTodos();
  }, [page, limit, sort, order, filterStatus, filterPriority, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); 
  };

  const handleSortChange = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc'); 
    }
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bu todo silinsin mi?'); 
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      fetchTodos();
    } catch (e) {
      console.error("Silme işleminde hata oluştu:", e);
      alert('Silme işleminde hata oluştu.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditTodo(null);
  };

  const handleFormSubmit = async (todo) => {
    try {
      if (editTodo) {
        await axios.put(`${API_BASE_URL}/todos/${editTodo.id}`, todo);
      } else {
        await axios.post(`${API_BASE_URL}/todos`, todo);
      }
      fetchTodos();
    } catch (e) {
      console.error("Kayıt sırasında hata oluştu:", e);
      alert('Kayıt sırasında hata oluştu.'); 
    } finally {
      handleFormClose();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-8rem)]">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Yapılacaklar Listesi</h1>

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
      >
        Yeni Todo Ekle
      </button>

      {/* Filtre ve Arama Bölümü */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center p-4 bg-gray-50 rounded-lg shadow-inner">
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="flex-1 w-full sm:w-auto border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        >
          <option value="">Durum Filtrele</option>
          <option value="pending">Beklemede</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}
          className="flex-1 w-full sm:w-auto border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        >
          <option value="">Öncelik Filtrele</option>
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <input
          type="text"
          placeholder="Görev adına göre ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-2 w-full sm:w-auto border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        />
      </div>

      {/* Tablo */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-gray-600">Gösterilecek todo bulunamadı.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSortChange('title')}
                >
                  Görev Adı {sort === 'title' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Açıklama</th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSortChange('status')}
                >
                  Durum {sort === 'status' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSortChange('priority')}
                >
                  Öncelik {sort === 'priority' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSortChange('created_at')}
                >
                  Oluşturulma Tarihi {sort === 'created_at' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleSortChange('due_date')}
                >
                  Bitiş Tarihi {sort === 'due_date' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <tr key={todo.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-gray-900">{todo.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{todo.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">{statusLabels[todo.status] || todo.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">{priorityLabels[todo.priority] || todo.priority}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(todo.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{todo.due_date ? new Date(todo.due_date).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm shadow-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm shadow-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sayfalama */}
      <div className="mt-6 flex justify-center items-center gap-3">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Önceki
        </button>
        <span className="px-4 py-2 text-gray-700 font-medium">Sayfa {page} / {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Sonraki
        </button>
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative transform scale-95 animate-fade-in">
            <button
              onClick={handleFormClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition-colors duration-200"
            >
              &times;
            </button>
            <TodoForm
              initialData={editTodo}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoListPage;
