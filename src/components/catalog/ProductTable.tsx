import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { QualityScore } from '../common/QualityScore';
import {
  Eye,
  Pencil,
  Trash2,
  ScanSearch,
  ExternalLink,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const { openEditModal, openConfirmModal, deleteProduct } = useCatalog();

  const handleDeleteClick = (product: Product) => {
    openConfirmModal({
      title: 'Delete Product SKU?',
      message: `Are you sure you want to delete "${product.title || product.sku}"? This removes the SKU and all its audit history from CatalogIQ.`,
      confirmText: 'Delete SKU',
      isDestructive: true,
      onConfirm: () => {
        deleteProduct(product.id);
      },
    });
  };

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div id="product-table-wrapper" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table id="catalog-products-table" className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16 text-center">Image</th>
              <th className="py-3.5 px-4">Product Details</th>
              <th className="py-3.5 px-4 w-32">Brand</th>
              <th className="py-3.5 px-4 w-36">Category</th>
              <th className="py-3.5 px-4 w-28">Price</th>
              <th className="py-3.5 px-4 w-28 text-center">Quality</th>
              <th className="py-3.5 px-4 w-32 text-center">Status</th>
              <th className="py-3.5 px-4 w-44 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            {products.map((product) => {
              const hasMissingImage = !product.imageUrl || !product.imageUrl.trim();

              return (
                <tr
                  key={product.id}
                  id={`product-row-${product.id}`}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Thumbnail */}
                  <td className="py-3 px-4 text-center">
                    <div className="relative w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 mx-auto">
                      {hasMissingImage ? (
                        <div className="flex flex-col items-center justify-center text-rose-400" title="Missing Image">
                          <ImageOff className="w-5 h-5" />
                        </div>
                      ) : (
                        <img
                          src={product.imageUrl}
                          alt={product.title ? `${product.title} thumbnail` : 'Product thumbnail'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </td>

                  {/* Title & SKU & Issues preview */}
                  <td className="py-3 px-4">
                    <div className="max-w-md">
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-left font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 line-clamp-1 transition-colors cursor-pointer"
                        title={product.title || 'Untitled Product'}
                      >
                        {product.title ? product.title : <span className="text-rose-600 italic font-normal">[Missing Title]</span>}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                          {product.sku}
                        </span>
                        {product.issues.length > 0 && (
                          <span
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded cursor-pointer hover:underline"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {product.issues.length} {product.issues.length === 1 ? 'issue' : 'issues'}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="py-3 px-4">
                    {product.brand ? (
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {product.brand}
                      </span>
                    ) : (
                      <span className="text-rose-500 dark:text-rose-400 text-xs font-semibold italic bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                        Missing
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    {product.category && product.category !== 'Uncategorized' ? (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {product.category}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold italic">
                        Uncategorized
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                    {typeof product.price === 'number' && product.price > 0 ? (
                      `$${product.price.toFixed(2)}`
                    ) : (
                      <span className="text-rose-600 text-xs font-bold">
                        {product.price === 0 ? '$0.00 (Zero)' : 'Invalid'}
                      </span>
                    )}
                  </td>

                  {/* Quality Score */}
                  <td className="py-3 px-4 text-center">
                    <QualityScore score={product.qualityScore} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={product.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* View detail */}
                      <button
                        id={`btn-view-${product.id}`}
                        onClick={() => navigate(`/product/${product.id}`)}
                        title="View Full Product Audit"
                        aria-label={`View ${product.title || product.sku}`}
                        className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Customer Preview */}
                      <button
                        id={`btn-preview-${product.id}`}
                        onClick={() => navigate(`/product/${product.id}/preview`)}
                        title="Customer Storefront Preview"
                        aria-label={`Preview customer storefront for ${product.title || product.sku}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      {/* Analyze in Sandbox */}
                      <button
                        id={`btn-analyze-${product.id}`}
                        onClick={() => navigate(`/analyzer?id=${product.id}`)}
                        title="Analyze in Quality Sandbox"
                        aria-label={`Analyze ${product.title || product.sku}`}
                        className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <ScanSearch className="w-4 h-4" />
                      </button>

                      {/* Edit modal */}
                      <button
                        id={`btn-edit-${product.id}`}
                        onClick={() => openEditModal(product)}
                        title="Edit Product Data"
                        aria-label={`Edit ${product.title || product.sku}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        id={`btn-delete-${product.id}`}
                        onClick={() => handleDeleteClick(product)}
                        title="Delete SKU"
                        aria-label={`Delete ${product.title || product.sku}`}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div
        id="table-pagination"
        className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startItem}</span> to{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{endItem}</span> of{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{totalCount}</span> products
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="pagination-prev-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-md font-bold text-xs transition-colors ${
                currentPage === pageNum
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            id="pagination-next-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
