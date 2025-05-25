import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/todo/TodoForm';
import Modal from '../components/common/Modal'; // Modal bileşeninizin doğru yolu
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false); // TodoForm için modal
    const [selectedTodo, setSelectedTodo] = useState(null); // Düzenlenecek todo

    // Silme onayı için yeni state'ler
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Onay modalını göster/gizle
    const [todoToDeleteId, setTodoToDeleteId] = useState(null);     // Silinecek todo'nun ID'si

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
            const response = await axios.get(`${API_BASE_URL}/todos?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Backend'den gelen veriye göre uyarlayın. Örneğin Laravel API resource ile 'data' içinde gelebilir.
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
    }, [navigate]); // navigate hook'u bağımlılık olarak eklenmeli

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleShowClick = (todoId) => {
        // Bu buton sadece todonun detayını gösterecek sayfaya yönlendirme yapar.
        navigate(`/todos/detail/${todoId}`); // '/todos/detail/:id' gibi bir rota kullanın.
    };

    const handleEditClick = (todo) => {
        setSelectedTodo(todo);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setSelectedTodo(null); // Yeni todo için formu sıfırla
        setShowModal(true);
    };

    const handleSaveTodo = () => { // TodoForm'dan dönüşte çağrılır
        fetchTodos(currentPage); // Liste güncellendiği için todoları yeniden çek
        setShowModal(false); // Modalı kapat
    };

    // Silme butonuna tıklandığında çağrılan fonksiyon (onay modalını açar)
    const handleDeleteTodo = (todoId) => {
        setTodoToDeleteId(todoId);      // Silinecek ID'yi sakla
        setShowConfirmModal(true);      // Onay modalını göster
    };

    // Onay modalındaki "Evet, Sil" butonuna tıklandığında çağrılan fonksiyon
    const confirmDeleteTodo = async () => {
        // todoToDeleteId'nin geçerli olduğundan emin olalım
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
            setTodos(todos.filter((todo) => todo.id !== todoToDeleteId)); // State'ten sil
            toast.success('Todo başarıyla silindi!');
        } catch (error) {
            console.error('Todo silinirken hata oluştu:', error);
            const errorMessage = error.response?.data?.message || 'Todo silinirken bir hata oluştu.';
            toast.error(errorMessage);
        } finally {
            setShowConfirmModal(false); // Onay modalını kapat
            setTodoToDeleteId(null);    // Silinecek ID'yi sıfırla
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
            fetchTodos(page);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-8rem)]">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Yapılacaklar Listesi</h1>

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleCreateClick}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    Yeni Todo Oluştur
                </button>
            </div>

            {todos.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Henüz hiç todo bulunamadı.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Başlık</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Açıklama</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Durum</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Öncelik</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Bitiş Tarihi</th>
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
                                            <span className="text-gray-400 italic">Yok</span>
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
                                            {/* Burası artık modalı açıyor */}
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
                        todo={selectedTodo} // Düzenleme modunda todo'yu gönderir
                        onClose={() => setShowModal(false)} // Modalı kapatma işlevi
                        onSave={handleSaveTodo} // Kaydedildikten sonra yapılacak işlev
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
                                onClick={confirmDeleteTodo} // Onaylandıktan sonra silme işlemini başlatır
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                Evet, Sil
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)} // Modalı kapatır
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