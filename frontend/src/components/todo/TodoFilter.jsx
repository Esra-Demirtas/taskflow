// src/components/todo/TodoFilter.jsx
import React from 'react';

const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled'];
const priorityOptions = ['low', 'medium', 'high'];

const TodoFilter = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filters.status || ''}
        onChange={e => handleChange('status', e.target.value)}
        className="border rounded px-3 py-1"
      >
        <option value="">Durum Filtrele</option>
        {statusOptions.map(s => (
          <option key={s} value={s}>
            {s.replace('_', ' ')}
          </option>
        ))}
      </select>

      <select
        value={filters.priority || ''}
        onChange={e => handleChange('priority', e.target.value)}
        className="border rounded px-3 py-1"
      >
        <option value="">Öncelik Filtrele</option>
        {priorityOptions.map(p => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TodoFilter;
