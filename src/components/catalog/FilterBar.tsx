import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  category: string;
  status: string;
  qualityRange: string; // 'all' | '90-100' | '80-89' | '50-79' | '0-49'
  sortBy: string; // 'score-desc' | 'score-asc' | 'title-asc' | 'price-desc' | 'price-asc' | 'issues-desc'
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  categories: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories,
  totalResults,
}) => {
  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.qualityRange !== 'all' ||
    filters.sortBy !== 'score-asc'; // default or custom

  return (
    <div
      id="catalog-filter-bar"
      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 space-y-3"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input: matches name, brand, category, keywords */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="catalog-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by name, brand, category, or keywords..."
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 caret-slate-900 dark:caret-teal-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              id="catalog-sort-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
            >
              <option value="score-asc">Quality: Lowest First</option>
              <option value="score-desc">Quality: Highest First</option>
              <option value="issues-desc">Most Issues</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Chips / Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            id="filter-category-select"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="filter-status-select"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Healthy">Healthy (80+)</option>
            <option value="Needs Review">Needs Review (50-79)</option>
            <option value="Critical">Critical (&lt;50)</option>
          </select>

          {/* Quality Range Filter */}
          <select
            id="filter-quality-select"
            value={filters.qualityRange}
            onChange={(e) => onFilterChange({ qualityRange: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Quality Scores</option>
            <option value="90-100">90 - 100 (Exemplary)</option>
            <option value="80-89">80 - 89 (Healthy)</option>
            <option value="50-79">50 - 79 (Fair / Needs Work)</option>
            <option value="0-49">0 - 49 (Defective / Critical)</option>
          </select>

          {hasActiveFilters && (
            <button
              id="clear-filters-btn"
              onClick={onReset}
              className="px-2.5 py-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{totalResults}</span> products
        </div>
      </div>
    </div>
  );
};
