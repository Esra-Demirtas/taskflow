import React, { useState, useEffect } from 'react';

const TodoForm = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  function formatLocalDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Eğer parse edilemezse, boşluk bazlı kes
    return dateString.split(' ')[0];
  }

  // Yerel tarihin YYYY-MM-DD formatı
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const TodoForm = ({ initialData, onSubmit, onCancel }) => {
  // state ve useEffect burada...
};

 useEffect(() => {
  if (initialData) {
    setTitle(initialData.title || '');
    setDescription(initialData.description || '');
    setStatus(initialData.status || 'pending');
    setPriority(initialData.priority || 'medium');
    setDueDate(formatLocalDate(initialData.due_date));
  }
}, [initialData]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      priority,
      due_date: dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Başlık</label>
        <input
          required
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Açıklama</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold">Durum</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="pending">Beklemede</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="completed">Tamamlandı</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold">Öncelik</label>
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold">Bitiş Tarihi</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
