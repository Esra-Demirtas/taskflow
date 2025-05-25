// src/components/category/CategoryList.jsx
import React from 'react';

const CategoryList = ({ categories, selectedCategories, onCategoryToggle }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryToggle(cat.id)}
          className={`px-3 py-1 rounded-full text-white text-sm 
            ${selectedCategories.includes(cat.id) ? 'opacity-100' : 'opacity-50'}
            `}
          style={{ backgroundColor: cat.color }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
