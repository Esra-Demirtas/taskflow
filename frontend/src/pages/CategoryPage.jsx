import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryForm from '../components/category/CategoryForm'; 
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api'; 

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`); 
      setCategories(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Kategori listesi yüklenirken hata oluştu:", err);
      setError('Kategori listesi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (category) => {
    try {
      if (category.id) {
        await axios.put(`${API_BASE_URL}/categories/${category.id}`, category); 
      } else {
        await axios.post(`${API_BASE_URL}/categories`, category); 
      }
      fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Kategori kaydedilirken hata oluştu:", err);
      alert('Kategori kaydedilirken hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?'); 
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`); 
      fetchCategories();
    } catch (err) {
      console.error("Kategori silinirken hata oluştu:", err);
      alert('Kategori silinirken hata oluştu'); 
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
                    <button
                      onClick={() => handleDelete(cat.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative transform scale-95 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition-colors duration-200"
            >
              &times;
            </button>
            <CategoryForm
              category={editingCategory}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
