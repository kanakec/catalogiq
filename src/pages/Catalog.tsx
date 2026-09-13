import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { FilterBar, FilterState } from '../components/catalog/FilterBar';
import { ProductTable } from '../components/catalog/ProductTable';
import { ProductCard } from '../components/catalog/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { LayoutGrid, List, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

export const Catalog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useCatalog();

  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter State
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      searchQuery: searchParams.get('q') || '',
      category: searchParams.get('category') || 'all',
      status: searchParams.get('status') || 'all',
      qualityRange: searchParams.get('quality') || 'all',
      sortBy: searchParams.get('sort') || 'score-asc',
    };
  });

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique categories from products
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category !== 'Uncategorized') {
        set.add(p.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [products]);

  // Handle filter changes and automatically reset pagination to page 1
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1); // Requirement: pagination automatically resets when search/filter/sort changes
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      status: 'all',
      qualityRange: 'all',
      sortBy: 'score-asc',
    });
    setCurrentPage(1);
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query: name, brand, category, keywords
    const q = filters.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const brandMatch = (p.brand || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const skuMatch = (p.sku || '').toLowerCase().includes(q);
        const keywordsMatch = Array.isArray(p.keywords)
          ? p.keywords.some((k) => (k || '').toLowerCase().includes(q))
          : false;

        return titleMatch || brandMatch || catMatch || skuMatch || keywordsMatch;
      });
    }

    // Category filter
    if (filters.category !== 'all') {
      list = list.filter((p) => (p.category || '').toLowerCase() === filters.category.toLowerCase());
    }

    // Status filter
    if (filters.status !== 'all') {
      list = list.filter((p) => p.status === filters.status);
    }

    // Quality Range filter
    if (filters.qualityRange !== 'all') {
      switch (filters.qualityRange) {
        case '90-100':
          list = list.filter((p) => p.qualityScore >= 90);
          break;
        case '80-89':
          list = list.filter((p) => p.qualityScore >= 80 && p.qualityScore < 90);
          break;
        case '50-79':
          list = list.filter((p) => p.qualityScore >= 50 && p.qualityScore < 80);
          break;
        case '0-49':
          list = list.filter((p) => p.qualityScore < 50);
          break;
      }
    }

    // Sorting
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case 'score-asc':
          return a.qualityScore - b.qualityScore;
        case 'score-desc':
          return b.qualityScore - a.qualityScore;
        case 'issues-desc':
          return b.issues.length - a.issues.length;
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        default:
          return a.qualityScore - b.qualityScore;
      }
    });

    return list;
  }, [products, filters]);

  // Pagination calculation
  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  return (
    <div id="catalog-page" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, audit, and calibrate product data across all channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              title="Table view"
              aria-label="Table view"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid view"
              aria-label="Grid view"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => navigate('/analyzer')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add / Ingest SKU</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={availableCategories}
        totalResults={totalCount}
      />

      {/* Content Area */}
      {totalCount === 0 ? (
        <EmptyState
          title="No Matching Products Found"
          description="None of the products match your search query and active filter criteria. Try clearing some filters."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <ProductTable
          products={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Grid Pagination */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500">
              Page {currentPage} of {totalPages} ({totalCount} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
