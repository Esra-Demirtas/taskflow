import { useState, useEffect } from 'react';
import axios from 'axios';

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Kategori yüklenirken hata:', error);
      }
    };
    fetchCategories();
  }, []);

  return { categories };
};

export default useCategories;
