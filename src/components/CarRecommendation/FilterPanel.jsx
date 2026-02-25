import React, { useState } from 'react';
import { X, DollarSign, Calendar, Gauge, Tag } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const brands = [
    '奔驰', '宝马', '奥迪', '大众', '丰田', '本田',
    '特斯拉', '比亚迪', '蔚来', '理想', '小鹏', '吉利'
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [0, 1000000],
      brands: [],
      years: [],
      mileage: [0, 300000]
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  const toggleBrand = (brand) => {
    setLocalFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const toggleYear = (year) => {
    setLocalFilters(prev => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter(y => y !== year)
        : [...prev.years, year]
    }));
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">筛选条件</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Price Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={18} className="text-slate-600" />
            <h3 className="font-medium text-slate-900">价格区间</h3>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={localFilters.priceRange[1]}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                priceRange: [0, parseInt(e.target.value)]
              }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600">
              <span>0万</span>
              <span>{(localFilters.priceRange[1] / 10000).toFixed(0)}万</span>
            </div>
          </div>
        </div>

        {/* Brands */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag size={18} className="text-slate-600" />
            <h3 className="font-medium text-slate-900">品牌</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  localFilters.brands.includes(brand)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Years */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-slate-600" />
            <h3 className="font-medium text-slate-900">车龄</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  localFilters.years.includes(year)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Mileage */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gauge size={18} className="text-slate-600" />
            <h3 className="font-medium text-slate-900">里程</h3>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={localFilters.mileage[1]}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                mileage: [0, parseInt(e.target.value)]
              }))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-600">
              <span>0万公里</span>
              <span>{(localFilters.mileage[1] / 10000).toFixed(0)}万公里</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-slate-200 flex gap-3">
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          重置
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          应用
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
