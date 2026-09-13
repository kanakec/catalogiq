import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityScore } from '../components/common/QualityScore';
import { EmptyState } from '../components/common/EmptyState';
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Trash2,
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Check,
  Wrench,
  ImageOff,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, openEditModal, openConfirmModal, deleteProduct, resolveIssueWithModal } = useCatalog();

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The requested product SKU could not be found in the catalog database."
        actionText="Back to Catalog"
        onAction={() => navigate('/catalog')}
      />
    );
  }

  const handleDelete = () => {
    openConfirmModal({
      title: 'Delete Product SKU?',
      message: `Are you sure you want to permanently delete "${product.title || product.sku}"?`,
      confirmText: 'Delete SKU',
      isDestructive: true,
      onConfirm: () => {
        deleteProduct(product.id);
        navigate('/catalog');
      },
    });
  };

  const hasMissingImage = !product.imageUrl || !product.imageUrl.trim();
  const formattedTime = new Date(product.updatedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div id="product-detail-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/catalog')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 font-semibold">{product.sku}</span>
              <StatusBadge status={product.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
              {product.title || '[Missing Title]'}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/product/${product.id}/preview`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs sm:text-sm rounded-lg transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Customer Preview</span>
          </Link>

          <Link
            to={`/analyzer?id=${product.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm rounded-lg transition-colors"
          >
            <ScanSearch className="w-4 h-4" />
            <span>Audit Sandbox</span>
          </Link>

          <button
            onClick={() => openEditModal(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit SKU</span>
          </button>

          <button
            onClick={handleDelete}
            aria-label="Delete product"
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Audit Summary Card (Quality Score + Status + Updated Time) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Quality Score Hero */}
          <div className="flex items-center gap-4 md:border-r border-slate-100 dark:border-slate-800 pr-6">
            <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center border bg-slate-50 dark:bg-slate-800/80 font-black text-3xl tabular-nums">
              <span
                className={
                  product.qualityScore >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : product.qualityScore >= 50
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }
              >
                {product.qualityScore}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">/ 100 PTS</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality Audit</p>
              <div className="mt-1">
                <StatusBadge status={product.status} size="md" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {product.issues.length} active catalog issues
              </p>
            </div>
          </div>

          {/* Core metadata: Brand, Category, Price */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Taxonomy</span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Brand: {product.brand || <span className="text-rose-500 italic">[Missing]</span>}
            </div>
            <div className="text-xs text-slate-500">
              Category: <span className="font-semibold text-slate-700 dark:text-slate-300">{product.category || 'Uncategorized'}</span>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pricing &amp; Inventory</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {typeof product.price === 'number' && product.price > 0 ? `$${product.price.toFixed(2)}` : <span className="text-rose-500 text-sm font-sans font-bold">[Invalid Price]</span>}
            </div>
            <div className="text-xs text-slate-500">
              Stock: {product.stock ?? 50} units available
            </div>
          </div>

          {/* Last updated */}
          <div className="space-y-1 md:text-right">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Audit Timestamp</span>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex md:justify-end items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedTime}</span>
            </div>
            <p className="text-[11px] text-slate-400">Calculated via CatalogIQ Logic Engine</p>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Media & Information vs Quality Breakdown & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Imagery & Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Photo Gallery */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
              <span>Catalog Imagery</span>
              <span className="text-xs text-slate-400 font-medium">
                Score: {product.scoreBreakdown.images.score}/10
              </span>
            </h3>

            <div className="relative aspect-4/3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
              {hasMissingImage ? (
                <div className="flex flex-col items-center justify-center text-rose-400 p-6 text-center">
                  <ImageOff className="w-12 h-12 mb-2" />
                  <span className="text-sm font-bold">No Primary Image Provided</span>
                  <span className="text-xs text-slate-400 mt-1">Image-less products suffer severe drop in click-through rates.</span>
                </div>
              ) : (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Additional gallery thumbnails */}
            {Array.isArray(product.additionalImages) && product.additionalImages.length > 0 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {product.additionalImages.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                    <img src={img} alt={`Gallery thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Product Description
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Score: {product.scoreBreakdown.description.score}/20
              </span>
            </div>
            {product.description ? (
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60 italic">
                Missing product description! A complete description is critical for customer conversion and search clarity.
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Technical Specifications
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Score: {product.scoreBreakdown.specifications.score}/20
              </span>
            </div>

            {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 w-1/3">
                      {spec.key}
                    </span>
                    <span className="text-slate-900 dark:text-white font-medium text-right flex-1">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/60 italic">
                No technical specifications specified. Provide key attributes such as dimensions, material, and warranty.
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Indexing Keywords &amp; Search Tags
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Score: {product.scoreBreakdown.keywords.score}/5
              </span>
            </div>

            {Array.isArray(product.keywords) && product.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {product.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-md font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No search keywords assigned.</p>
            )}
          </div>
        </div>

        {/* Right Column: Score Breakdown, Issues, Recommendations (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Detailed Score Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Scoring Model Breakdown (100 Points)
            </h3>

            <div className="space-y-3.5 text-xs">
              {Object.entries(product.scoreBreakdown).map(([key, item]) => {
                const percent = Math.round((item.score / item.max) * 100);
                const isFull = item.score === item.max;

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="capitalize text-slate-700 dark:text-slate-300">{key}</span>
                      <div className="flex items-center gap-1.5 tabular-nums">
                        <span className={isFull ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                          {item.score} / {item.max} pts
                        </span>
                        {isFull && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{item.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected Issues with "Resolve" action that fixes underlying field */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detected Quality Anomalies ({product.issues.length})
              </h3>
              {product.issues.length === 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Checks Passed
                </span>
              )}
            </div>

            {product.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
                This SKU is completely healthy with 0 open issues. Ready for publication across all digital channels.
              </div>
            ) : (
              <div className="space-y-3">
                {product.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusBadge severity={issue.severity} size="sm" />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {issue.title}
                        </span>
                      </div>
                      <button
                        onClick={() => resolveIssueWithModal(issue)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Fix Field</span>
                      </button>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300">
                      {issue.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-teal-700 dark:text-teal-400">
                      Recommendation: {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Actionable Recommendations
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {product.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
