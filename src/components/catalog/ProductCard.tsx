import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { QualityScore } from '../common/QualityScore';
import { Eye, Pencil, Trash2, ScanSearch, ExternalLink, ImageOff } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { openEditModal, openConfirmModal, deleteProduct } = useCatalog();

  const handleDelete = () => {
    openConfirmModal({
      title: 'Delete Product SKU?',
      message: `Are you sure you want to remove "${product.title || product.sku}"?`,
      confirmText: 'Delete SKU',
      isDestructive: true,
      onConfirm: () => {
        deleteProduct(product.id);
      },
    });
  };

  const hasMissingImage = !product.imageUrl || !product.imageUrl.trim();

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Top Media Area */}
      <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden group">
        {hasMissingImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-rose-400 bg-rose-50/50 dark:bg-rose-950/20">
            <ImageOff className="w-8 h-8 mb-1" />
            <span className="text-xs font-semibold">Missing Image</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.title ? `${product.title} image` : 'Product image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        )}

        <div className="absolute top-2.5 left-2.5">
          <StatusBadge status={product.status} size="sm" />
        </div>

        <div className="absolute top-2.5 right-2.5">
          <QualityScore score={product.qualityScore} size="sm" />
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
            <span className="font-mono">{product.sku}</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {product.category || 'Uncategorized'}
            </span>
          </div>

          <h4
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-sm font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 line-clamp-2 transition-colors cursor-pointer"
            title={product.title || 'Untitled Product'}
          >
            {product.title || <span className="text-rose-600 italic">[Missing Title]</span>}
          </h4>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {product.brand ? product.brand : <span className="text-rose-500 italic">No Brand</span>}
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
              {typeof product.price === 'number' && product.price > 0 ? `$${product.price.toFixed(2)}` : '$0.00'}
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/product/${product.id}/preview`)}
              title="Storefront Preview"
              aria-label="Preview storefront"
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/analyzer?id=${product.id}`)}
              title="Analyze in Sandbox"
              aria-label="Analyze product"
              className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ScanSearch className="w-4 h-4" />
            </button>
            <button
              onClick={() => openEditModal(product)}
              title="Edit Product"
              aria-label="Edit product"
              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Product"
              aria-label="Delete product"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
