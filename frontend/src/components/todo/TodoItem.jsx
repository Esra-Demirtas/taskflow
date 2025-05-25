// src/components/todo/TodoItem.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-300',
    in_progress: 'bg-blue-300',
    completed: 'bg-green-300',
    cancelled: 'bg-red-300',
  };
  return (
    <span className={`px-2 py-1 rounded text-sm ${colors[status] || 'bg-gray-300'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const PriorityIndicator = ({ priority }) => {
  const colors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };
  return (
    <span className={`font-bold ${colors[priority] || 'text-gray-600'}`}>
      {priority}
    </span>
  );
};

const TodoItem = ({ todo, onEdit }) => {
  return (
    <div className="border p-4 rounded flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{todo.title}</h3>
        <p className="text-gray-600">{todo.description}</p>
        <div className="flex space-x-4 mt-2">
          <StatusBadge status={todo.status} />
          <PriorityIndicator priority={todo.priority} />
        </div>
      </div>
      <button
        onClick={() => onEdit(todo)}
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Düzenle
      </button>
    </div>
  );
};

export default TodoItem;
