import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const ProductFilter: React.FC<Props> = ({ searchParams, setSearchParams }) => {
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [conditions, setConditions] = useState<string[]>(searchParams.getAll('conditions'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');

  const allConditions = ['New', 'Used', 'Refurbished'];

  const handleConditionToggle = (condition: string) => {
    const updated = conditions.includes(condition)
      ? conditions.filter(c => c !== condition)
      : [...conditions, condition];
    setConditions(updated);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set('page', '1');

    if (minPrice) newParams.set('minPrice', minPrice);
    else newParams.delete('minPrice');

    if (maxPrice) newParams.set('maxPrice', maxPrice);
    else newParams.delete('maxPrice');

    if (searchTerm) newParams.set('searchTerm', searchTerm);
    else newParams.delete('searchTerm');

    newParams.delete('conditions');
    conditions.forEach(cond => newParams.append('conditions', cond));

    setSearchParams(newParams);
  };

  return (
    <div className="mb-4 space-y-4 p-4 border rounded-lg bg-white shadow">
      <div>
        <label className="block text-sm font-medium">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Condition</label>
        <div className="flex flex-wrap gap-3">
          {allConditions.map(cond => (
            <label key={cond} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={conditions.includes(cond)}
                onChange={() => handleConditionToggle(cond)}
              />
              {cond}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilter;
