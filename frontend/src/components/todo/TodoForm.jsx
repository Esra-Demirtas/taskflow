// src/components/todo/TodoForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000/api';

// Prop isimleri: todo, onClose, onSave
const TodoForm = ({ todo, onClose, onSave }) => { // <-- Prop isimleri burada kontrol edildi
    const [formData, setFormData] = useState({ // <-- formData state'i doğru
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: null,
        category_ids: [],
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Todo prop'u değiştiğinde formu doldur
    useEffect(() => {
        if (todo) { // <-- todo prop'u kullanılıyor
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                status: todo.status || 'pending',
                priority: todo.priority || 'medium',
                due_date: todo.due_date ? new Date(todo.due_date) : null,
                category_ids: todo.categories ? todo.categories.map(cat => cat.id) : [],
            });
        } else {
            // Yeni todo oluşturuluyorsa formu sıfırla
            setFormData({
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                due_date: null,
                category_ids: [],
            });
        }
    }, [todo]); // <-- todo prop'u bağımlılık olarak ekleniyor

    // Kategorileri API'den çek
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/categories`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCategories(response.data.data || response.data);
            } catch (err) {
                console.error('Kategoriler çekilirken hata oluştu:', err);
                setErrors(prev => ({ ...prev, categories: 'Kategoriler yüklenemedi.' }));
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, options } = e.target;

        if (name === 'category_ids') {
            const selectedOptions = Array.from(options).filter(option => option.selected);
            const selectedValues = selectedOptions.map(option => parseInt(option.value, 10));
            setFormData(prev => ({ ...prev, [name]: selectedValues })); // <-- formData kullanılıyor
        } else {
            setFormData(prev => ({ ...prev, [name]: value })); // <-- formData kullanılıyor
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, due_date: date })); // <-- formData kullanılıyor
        if (errors.due_date) {
            setErrors(prev => ({ ...prev, due_date: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) { // <-- formData kullanılıyor
            newErrors.title = 'Başlık boş bırakılamaz.';
        } else if (formData.title.trim().length < 3) { // <-- formData kullanılıyor
            newErrors.title = 'Başlık en az 3 karakter olmalıdır.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const dataToSend = {
                ...formData, // <-- 'formState' yerine 'formData' kullanıldı
                // `due_date` null ise boş string gönder, aksi takdirde ISO formatına çevir
                // Laravel için yyyy-mm-dd formatı genelde yeterlidir.
                due_date: formData.due_date ? formData.due_date.toISOString().split('T')[0] : null,
            };

            let response;
            if (todo) { // <-- 'todoToEdit' yerine 'todo' kullanıldı
                // Güncelleme işlemi
                response = await axios.put(`${API_BASE_URL}/todos/${todo.id}`, dataToSend, config); // <-- 'todoToEdit' yerine 'todo' kullanıldı
                toast.success('Todo başarıyla güncellendi!');
            } else {
                // Yeni todo ekleme işlemi
                response = await axios.post(`${API_BASE_URL}/todos`, dataToSend, config);
                toast.success('Yeni todo başarıyla eklendi!');
            }
            onSave(response.data.data); // <-- 'onSave' prop'u kullanıldı
            onClose(); // <-- 'onCancel' yerine 'onClose' prop'u kullanıldı

        } catch (error) {
            console.error('Todo kaydederken hata oluştu:', error);
            const errorMessage = error.response?.data?.message || 'Todo kaydedilirken bir hata oluştu.';
            toast.error(errorMessage);
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(messages => {
                    messages.forEach(message => {
                        toast.error(message);
                    });
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{todo ? 'Todo Düzenle' : 'Yeni Todo Oluştur'}</h2>

            {/* Başlık */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Başlık:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title} // <-- formData kullanılıyor
                    onChange={handleChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
            </div>

            {/* Açıklama */}
            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Açıklama:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description} // <-- formData kullanılıyor
                    onChange={handleChange}
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>

            {/* Durum */}
            <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Durum:</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status} // <-- formData kullanılıyor
                    onChange={handleChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="pending">Beklemede</option>
                    <option value="in_progress">Devam Ediyor</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal Edildi</option>
                </select>
            </div>

            {/* Öncelik */}
            <div className="mb-4">
                <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Öncelik:</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority} // <-- formData kullanılıyor
                    onChange={handleChange}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                </select>
            </div>

            {/* Bitiş Tarihi */}
            <div className="mb-4">
                <label htmlFor="due_date" className="block text-gray-700 text-sm font-bold mb-2">Bitiş Tarihi:</label>
                <DatePicker
                    selected={formData.due_date} // <-- formData kullanılıyor
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className={`shadow appearance-none border rounded w-full py-2 px-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.due_date ? 'border-red-500' : ''}`}
                    placeholderText="Tarih seçiniz"
                    isClearable
                />
                {errors.due_date && <p className="text-red-500 text-xs italic mt-1">{errors.due_date}</p>}
            </div>

            {/* Kategoriler (Çoklu Seçim) */}
            <div className="mb-6">
                <label htmlFor="category_ids" className="block text-gray-700 text-sm font-bold mb-2">
                    Kategoriler:
                    <span className="block text-red-500 text-xs font-normal mt-1">
                        *Birden fazla kategori seçmek için CTRL'ye basılı tutun.
                    </span>
                </label>
                {loadingCategories ? (
                    <p className="text-gray-500">Kategoriler yükleniyor...</p>
                ) : (
                    <select
                        id="category_ids"
                        name="category_ids"
                        multiple
                        value={formData.category_ids.map(String)} // <-- formData kullanılıyor
                        onChange={handleChange}
                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 ${errors.category_ids ? 'border-red-500' : ''}`}
                    >
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}
                {errors.category_ids && <p className="text-red-500 text-xs italic mt-1">{errors.category_ids}</p>}
            </div>

            {/* Butonlar */}
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {todo ? 'Güncelle' : 'Oluştur'} {/* <-- todo prop'u kullanılıyor */}
                </button>
                <button
                    type="button"
                    onClick={onClose} // <-- 'onCancel' yerine 'onClose' prop'u kullanılıyor
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    İptal
                </button>
            </div>
        </form>
    );
};

export default TodoForm;