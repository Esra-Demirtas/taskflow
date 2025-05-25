import React, { useState, useEffect } from 'react';

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Kategori adı boş olamaz');
      return;
    }
    onSave({ id: category?.id, name, color });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 max-w-md">
      <div className="mb-3">
        <label className="block mb-1 font-semibold">Kategori Adı</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Kategori adı"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Renk</label>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className="w-20 h-10 p-0 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Kaydet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          İptal
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
