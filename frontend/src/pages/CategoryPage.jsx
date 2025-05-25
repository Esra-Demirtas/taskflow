import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryForm from '../components/category/CategoryForm';
import Modal from '../components/common/Modal'; // Modal bileşenini import edin
import { toast } from 'react-toastify'; // toast bildirimleri için import edin
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Kategori formu modalı için

    // Silme onayı için yeni state'ler
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Onay modalını göster/gizle
    const [categoryToDeleteId, setCategoryToDeleteId] = useState(null); // Silinecek kategori ID'si

    const navigate = useNavigate();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Token kontrolü ve yönlendirme
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const res = await axios.get(`${API_BASE_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(res.data.data); // Laravel API Resource yapısına göre 'data' içinden alınır
            setError(null);
        } catch (err) {
            console.error("Kategori listesi yüklenirken hata oluştu:", err);
            if (err.response && err.response.status === 401) {
                navigate('/login'); // Yetkilendirme hatasında login sayfasına yönlendir
            } else {
                setError('Kategori listesi yüklenirken hata oluştu.');
                toast.error('Kategori listesi yüklenirken bir sorun oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (category) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (category.id) {
                await axios.put(`${API_BASE_URL}/categories/${category.id}`, category, config);
                toast.success('Kategori başarıyla güncellendi!');
            } else {
                await axios.post(`${API_BASE_URL}/categories`, category, config);
                toast.success('Kategori başarıyla oluşturuldu!');
            }
            fetchCategories(); // Listeyi güncelle
            setIsModalOpen(false); // Modalı kapat
            setEditingCategory(null); // Düzenlenen kategoriyi sıfırla
        } catch (err) {
            console.error("Kategori kaydedilirken hata oluştu:", err);
            const errorMessage = err.response?.data?.message || 'Kategori kaydedilirken bir hata oluştu.';
            toast.error(errorMessage);
        }
    };

    // Silme butonuna tıklandığında modalı açan fonksiyon
    const handleDeleteClick = (id) => {
        setCategoryToDeleteId(id); // Silinecek ID'yi sakla
        setShowConfirmModal(true); // Onay modalını göster
    };

    // Onay modalındaki "Evet, Sil" butonuna tıklandığında çağrılan fonksiyon
    const confirmDelete = async () => {
        if (!categoryToDeleteId) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_BASE_URL}/categories/${categoryToDeleteId}`, config);
            setCategories(categories.filter(cat => cat.id !== categoryToDeleteId)); // State'ten sil
            toast.success('Kategori başarıyla silindi!');
        } catch (err) {
            console.error("Kategori silinirken hata oluştu:", err);
            const errorMessage = err.response?.data?.message || 'Kategori silinirken bir hata oluştu.';
            toast.error(errorMessage);
        } finally {
            setShowConfirmModal(false); // Onay modalını kapat
            setCategoryToDeleteId(null); // ID'yi sıfırla
        }
    };

    const openModal = (category = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-8rem)]">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Kategori Yönetimi</h1>

            <button
                onClick={() => openModal()}
                className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
                Yeni Kategori Ekle
            </button>

            {loading ? (
                <div className="text-center py-8 text-gray-600">Yükleniyor...</div>
            ) : error ? (
                <div className="text-red-600 text-center py-8">{error}</div>
            ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-600">Kategori bulunamadı.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori Adı</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Renk</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-3 text-sm text-gray-900">{cat.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                        <div
                                            style={{ backgroundColor: cat.color || '#cccccc', width: 30, height: 20 }}
                                            className="rounded-md border border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-2">
                                        <button
                                            onClick={() => openModal(cat)}
                                            className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm shadow-sm"
                                        >
                                            Düzenle
                                        </button>
                                        {/* Yeni modalı açan fonksiyon */}
                                        <button
                                            onClick={() => handleDeleteClick(cat.id)}
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

            {/* Kategori Form Modalı (Ekleme/Düzenleme) */}
            {isModalOpen && (
                <Modal onClose={closeModal}> {/* Modal bileşeniniz varsa */}
                    <CategoryForm
                        category={editingCategory}
                        onSave={handleSave}
                        onCancel={closeModal}
                    />
                </Modal>
            )}

            {/* Silme Onayı Modalı */}
            {showConfirmModal && (
                <Modal onClose={() => setShowConfirmModal(false)}>
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Silme Onayı</h3>
                        <p className="mb-6 text-gray-700">Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmDelete}
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

export default CategoryPage;