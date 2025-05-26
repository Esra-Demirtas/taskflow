import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/todo/TodoForm';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000/api';

const statusLabels = {
    pending: 'Beklemede',
    in_progress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi',
};

const priorityLabels = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
};

const TodoListPage = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

    const [sortBy, setSortBy] = useState('created_at'); // Varsayılan sıralama alanı
    const [sortDirection, setSortDirection] = useState('desc'); // Varsayılan sıralama yönü

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [todoToDeleteId, setTodoToDeleteId] = useState(null);

    const navigate = useNavigate();

    const fetchTodos = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const params = new URLSearchParams({ page, per_page: 10 }); // per_page ekledik
            if (filterStatus) {
                params.append('status', filterStatus);
            }
            if (filterPriority) {
                params.append('priority', filterPriority);
            }
            params.append('sort', sortBy);
            params.append('order', sortDirection);

            console.log('Fetching todos with params:', params.toString()); // Debugging için
            const response = await axios.get(`${API_BASE_URL}/todos?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('API Response:', response.data); // Debugging için
            setTodos(response.data.data);
            setTotalPages(response.data.last_page);
            setCurrentPage(response.data.current_page);
        } catch (err) {
            console.error('Todolar çekilirken hata oluştu:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            } else {
                setError('Todolar yüklenirken bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, filterStatus, filterPriority, sortBy, sortDirection]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Filtreleme veya sıralama değiştiğinde sayfayı 1'e sıfırla ve yeniden todoları çek
    useEffect(() => {
        setCurrentPage(1);
        fetchTodos(1);
    }, [filterStatus, filterPriority, sortBy, sortDirection]);

    const handleShowClick = (todoId) => {
        navigate(`/todos/detail/${todoId}`);
    };

    const handleEditClick = (todo) => {
        setSelectedTodo(todo);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setSelectedTodo(null);
        setShowModal(true);
    };

    const handleSaveTodo = () => {
        fetchTodos(currentPage);
        setShowModal(false);
    };

    const handleDeleteTodo = (todoId) => {
        setTodoToDeleteId(todoId);
        setShowConfirmModal(true);
    };

    const confirmDeleteTodo = async () => {
        if (!todoToDeleteId) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_BASE_URL}/todos/${todoToDeleteId}`, config);
            toast.success('Todo başarıyla silindi!');
            // Silme işlemi sonrası güncel sayfadaki todoları yeniden çek
            fetchTodos(currentPage);
        } catch (error) {
            console.error('Todo silinirken hata oluştu:', error);
            const errorMessage = error.response?.data?.message || 'Todo silinirken bir hata oluştu.';
            toast.error(errorMessage);
        } finally {
            setShowConfirmModal(false);
            setTodoToDeleteId(null);
        }
    };

    const handleStatusChange = async (todoId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.put(`${API_BASE_URL}/todos/${todoId}/status`, { status: newStatus }, config);

            setTodos(todos.map(todo =>
                todo.id === todoId ? { ...todo, status: response.data.data.status } : todo
            ));
            toast.success(`Todo durumu "${statusLabels[newStatus]}" olarak güncellendi!`);
        } catch (error) {
            console.error('Todo durumu güncellenirken hata oluştu:', error);
            const errorMessage = error.response?.data?.message || 'Todo durumu güncellenirken bir hata oluştu.';
            toast.error(errorMessage);
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page); // Sayfayı güncelle
            fetchTodos(page); // Yeni sayfayı çek
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Yapılacaklar Listesi</h1>
                <button
                    onClick={handleCreateClick}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    Yeni Todo Oluştur
                </button>
            </div>

            {/* Filtreleme alanı */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div className="flex items-center gap-2">
                    <label htmlFor="statusFilter" className="text-gray-700 font-medium">Durum:</label>
                    <select
                        id="statusFilter"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Tümü</option>
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="priorityFilter" className="text-gray-700 font-medium">Öncelik:</label>
                    <select
                        id="priorityFilter"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="">Tümü</option>
                        {Object.entries(priorityLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-8 text-gray-600">Veriler yükleniyor...</div>
            ) : todos.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Henüz hiç todo bulunamadı.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* Sıralanabilir Sütun Başlıkları */}
                                {['title', 'description', 'status', 'priority', 'due_date'].map(column => (
                                    <th
                                        key={column}
                                        className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-200 transition duration-150 relative"
                                        onClick={() => handleSort(column)}
                                    >
                                        <div className="flex items-center">
                                            {
                                                column === 'title' ? 'Başlık' :
                                                column === 'description' ? 'Açıklama' :
                                                column === 'status' ? 'Durum' :
                                                column === 'priority' ? 'Öncelik' :
                                                column === 'due_date' ? 'Bitiş Tarihi' : ''
                                            }
                                            <span className="ml-1 text-xs">
                                                {sortBy === column && sortDirection === 'asc' && '↑'}
                                                {sortBy === column && sortDirection === 'desc' && '↓'}
                                                {sortBy !== column && '↕'} {/* Varsayılan olarak göster */}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                                {/* İşlem ve Kategoriler sıralanamayacak */}
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Kategoriler</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.map((todo) => (
                                <tr key={todo.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="py-3 px-4 border-b text-sm text-gray-800 font-medium">{todo.title}</td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600 max-w-xs truncate">{todo.description}</td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">{statusLabels[todo.status] || todo.status}</td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">{priorityLabels[todo.priority] || todo.priority}</td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        {todo.due_date ? new Date(todo.due_date).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        {todo.categories && todo.categories.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {todo.categories.map(cat => (
                                                    <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Belirtilmedi</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 border-b text-sm text-gray-600">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleShowClick(todo.id)}
                                                className="px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200 text-sm shadow-sm"
                                            >
                                                Göster
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(todo)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs transition duration-200"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTodo(todo.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs transition duration-200"
                                            >
                                                Sil
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Önceki
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sonraki
                    </button>
                </div>
            )}

            {/* Todo Form Modal (Düzenleme/Oluşturma) */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <TodoForm
                        todo={selectedTodo}
                        onClose={() => setShowModal(false)}
                        onSave={handleSaveTodo}
                    />
                </Modal>
            )}

            {/* Silme Onayı Modalı */}
            {showConfirmModal && (
                <Modal onClose={() => setShowConfirmModal(false)}>
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Silme Onayı</h3>
                        <p className="mb-6 text-gray-700">Bu todoyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmDeleteTodo}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                Evet, Sil
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TodoListPage;