import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // useLocation eklendi
import axios from 'axios';
import TodoForm from '../components/todo/TodoForm';
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

const TodoDetailPage = () => {
    const { id } = useParams(); // URL'den todo ID'sini al (varsa)
    const navigate = useNavigate();
    const location = useLocation(); // Mevcut rota bilgisini almak için
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Rota modunu belirle: 'create', 'edit' veya 'show'
    const isCreateMode = location.pathname === '/todos/create';
    const isEditMode = location.pathname.startsWith('/todos/edit/');
    const isShowMode = location.pathname.startsWith('/todos/detail/');


    useEffect(() => {
        const fetchTodo = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(`${API_BASE_URL}/todos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTodo(response.data.data);
            } catch (err) {
                console.error('Todo detayları çekilirken hata oluştu:', err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                } else if (err.response && err.response.status === 404) {
                    setError('Belirtilen todo bulunamadı.');
                    toast.error('Belirtilen todo bulunamadı.');
                } else {
                    setError('Todo detayları yüklenirken bir hata oluştu.');
                    toast.error('Todo detayları yüklenirken bir hata oluştu.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id && (isEditMode || isShowMode)) { // ID varsa ve düzenleme/gösterme modundaysak todoyu çek
            fetchTodo();
        } else if (isCreateMode) { // Oluşturma modundaysak
            setLoading(false);
            setTodo(null); // Yeni todo için formu sıfırlamak
        } else { // Geçersiz durumlar veya ID olmadan detay/düzenleme sayfasına erişim
            setLoading(false);
            setError("Geçersiz todo işlemi.");
            toast.error("Geçersiz todo işlemi.");
            navigate('/todos'); // Ana listeye yönlendir
        }
    }, [id, navigate, isCreateMode, isEditMode, isShowMode]);

    // Todo başarıyla kaydedildiğinde (güncelleme veya oluşturma sonrası)
    const handleSaveSuccess = (savedTodo) => { // 'updatedTodo' yerine 'savedTodo' olarak değiştirdim
        toast.success(`Todo "${savedTodo.title}" başarıyla kaydedildi.`);
        navigate('/todos'); // Todolar listesi sayfasına geri dön
    };

    // Form iptal edildiğinde veya modal kapandığında
    const handleCloseForm = () => {
        navigate('/todos'); // Todolar listesi sayfasına geri dön
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Todo yükleniyor...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>;
    }

    return (
    <div className="p-6 sm:p-8 bg-gray-100 min-h-[calc(100vh-8rem)]">
        {isShowMode && todo && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">📝 Todo Detayı</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-gray-700">
                    <div>
                        <p className="text-gray-500 font-medium">Başlık</p>
                        <p className="font-semibold mt-1">{todo.title}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Açıklama</p>
                        <p className="mt-1">{todo.description || <span className=" text-gray-400">Belirtilmedi</span>}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Durum</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold 
                            ${todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                            todo.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            todo.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}`}>
                            {statusLabels[todo.status] || todo.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Öncelik</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold 
                            ${todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                            todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            todo.priority === 'low' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`}>
                            {priorityLabels[todo.priority] || todo.priority}
                        </span>
                    </div>

                    <div>
                        <p className="text-gray-500 font-medium">Bitiş Tarihi</p>
                        <p className="mt-1">{todo.due_date ? new Date(todo.due_date).toLocaleDateString('tr-TR') : 'Belirtilmedi'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Kategoriler</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {todo.categories && todo.categories.length > 0 ? (
                                todo.categories.map(cat => (
                                    <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                                        {cat.name}
                                    </span>
                                ))
                            ) : (
                                <span className=" text-gray-400">Belirtilmedi</span>
                            )}
                        </div>
                    </div>
                    {/* Diğer alanlar buraya eklenebilir */}
                </div>
            </div>
        )}
    </div>
);

};

export default TodoDetailPage;