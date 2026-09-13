import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { calculateProductQuality } from '../../utils/qualityLogic.js';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { ProductSpecification } from '../../types';

export const EditProductModal: React.FC = () => {
  const { editingProduct, targetIssueField, closeEditModal, updateProduct, settings } = useCatalog();

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImagesText, setAdditionalImagesText] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);

  // Synchronize state when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || '');
      setBrand(editingProduct.brand || '');
      setCategory(editingProduct.category || 'Electronics');
      setPrice(
        editingProduct.price !== undefined && editingProduct.price !== null
          ? String(editingProduct.price)
          : ''
      );
      setDescription(editingProduct.description || '');
      setImageUrl(editingProduct.imageUrl || '');
      setAdditionalImagesText(
        Array.isArray(editingProduct.additionalImages)
          ? editingProduct.additionalImages.join('\n')
          : ''
      );
      setKeywordsText(
        Array.isArray(editingProduct.keywords)
          ? editingProduct.keywords.join(', ')
          : ''
      );
      setSpecifications(
        Array.isArray(editingProduct.specifications)
          ? [...editingProduct.specifications]
          : []
      );
    }
  }, [editingProduct]);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeEditModal();
      }
    },
    [closeEditModal]
  );

  useEffect(() => {
    if (editingProduct) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [editingProduct, handleKeyDown]);

  // Live quality score simulation
  const liveEvaluation = useMemo(() => {
    if (!editingProduct) return null;

    const parsedPrice = parseFloat(price);
    const validSpecs = specifications.filter(
      (s) => s && s.key.trim() && s.value.trim()
    );
    const parsedAddlImages = additionalImagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedKeywords = keywordsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const simulatedPayload = {
      ...editingProduct,
      title,
      brand,
      category,
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      description,
      imageUrl,
      additionalImages: parsedAddlImages,
      keywords: parsedKeywords,
      specifications: validSpecs,
    };

    return calculateProductQuality(simulatedPayload, {
      healthyThreshold: settings.healthyThreshold,
      needsReviewThreshold: settings.needsReviewThreshold,
    });
  }, [
    editingProduct,
    title,
    brand,
    category,
    price,
    description,
    imageUrl,
    additionalImagesText,
    keywordsText,
    specifications,
    settings.healthyThreshold,
    settings.needsReviewThreshold,
  ]);

  if (!editingProduct || !liveEvaluation) return null;

  // Specification helpers
  const handleAddSpec = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit and save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = parseFloat(price);
    const validSpecs = specifications.filter(
      (s) => s && s.key.trim() && s.value.trim()
    );
    const parsedAddlImages = additionalImagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedKeywords = keywordsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProduct(editingProduct.id, {
      title: title.trim(),
      brand: brand.trim(),
      category: category.trim(),
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      additionalImages: parsedAddlImages,
      keywords: parsedKeywords,
      specifications: validSpecs,
    });

    closeEditModal();
  };

  const scoreDiff = liveEvaluation.score - editingProduct.qualityScore;

  const categoriesList = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Sports',
    'Beauty',
    'Accessories',
  ];

  return (
    <div
      id="edit-product-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={closeEditModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-heading"
    >
      <div
        id="edit-product-modal-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="edit-modal-heading" className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Product &amp; Quality Audit
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                {editingProduct.sku}
              </span>
            </div>
            {targetIssueField && (
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Target field for resolution: <span className="underline uppercase">{targetIssueField}</span>
              </p>
            )}
          </div>

          <button
            onClick={closeEditModal}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Score Projection Banner */}
        <div className="px-6 py-3 bg-teal-50/70 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/60 flex items-center justify-between shrink-0 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Quality Projection:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-slate-500 line-through tabular-nums">
                {editingProduct.qualityScore}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-teal-700 dark:text-teal-300 text-base tabular-nums">
                {liveEvaluation.score}/100
              </span>
              {scoreDiff !== 0 && (
                <span
                  className={`text-xs px-1.5 py-0.2 rounded font-bold ${
                    scoreDiff > 0
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} pts
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs ${
                liveEvaluation.status === 'Healthy'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : liveEvaluation.status === 'Needs Review'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {liveEvaluation.status}
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className={`p-3 rounded-xl border transition-all ${
            targetIssueField === 'title'
              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-title" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-medium text-slate-400">
                {title.length} chars (Score: {liveEvaluation.breakdown.title.score}/15)
              </span>
            </div>
            <textarea
              id="edit-title"
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Noise Canceling Headphones..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              required
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {liveEvaluation.breakdown.title.feedback}
            </p>
          </div>

          {/* Brand & Category & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Brand */}
            <div className={`p-3 rounded-xl border transition-all ${
              targetIssueField === 'brand'
                ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="edit-brand" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Brand Name <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {liveEvaluation.breakdown.brand.score}/10
                </span>
              </div>
              <input
                id="edit-brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sony, Apple, Nike"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {liveEvaluation.breakdown.brand.feedback}
              </p>
            </div>

            {/* Category */}
            <div className={`p-3 rounded-xl border transition-all ${
              targetIssueField === 'category'
                ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="edit-category" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Category <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {liveEvaluation.breakdown.category.score}/10
                </span>
              </div>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Uncategorized">Uncategorized (Defective)</option>
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {liveEvaluation.breakdown.category.feedback}
              </p>
            </div>

            {/* Price */}
            <div className={`p-3 rounded-xl border transition-all ${
              targetIssueField === 'price'
                ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="edit-price" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Price ($ USD) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {liveEvaluation.breakdown.price.score}/10
                </span>
              </div>
              <input
                id="edit-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {liveEvaluation.breakdown.price.feedback}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className={`p-3 rounded-xl border transition-all ${
            targetIssueField === 'description'
              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-description" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Product Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-medium text-slate-400">
                {description.length} chars (Score: {liveEvaluation.breakdown.description.score}/20)
              </span>
            </div>
            <textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide comprehensive details about features, materials, in-box items..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {liveEvaluation.breakdown.description.feedback}
            </p>
          </div>

          {/* Image URLs */}
          <div className={`p-3 rounded-xl border transition-all ${
            targetIssueField === 'images'
              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-image-url" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Primary Image URL <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-medium text-slate-400">
                {liveEvaluation.breakdown.images.score}/10
              </span>
            </div>
            <input
              id="edit-image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {liveEvaluation.breakdown.images.feedback}
            </p>

            <div className="mt-3">
              <label htmlFor="edit-additional-images" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Secondary Gallery Images (One URL per line)
              </label>
              <textarea
                id="edit-additional-images"
                rows={2}
                value={additionalImagesText}
                onChange={(e) => setAdditionalImagesText(e.target.value)}
                placeholder="https://...&#10;https://..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Keywords */}
          <div className={`p-3 rounded-xl border transition-all ${
            targetIssueField === 'keywords'
              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-keywords" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Search Keywords / Tags (Comma-separated)
              </label>
              <span className="text-xs font-medium text-slate-400">
                {liveEvaluation.breakdown.keywords.score}/5
              </span>
            </div>
            <input
              id="edit-keywords"
              type="text"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="e.g. bluetooth, noise canceling, wireless audio, over-ear"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {liveEvaluation.breakdown.keywords.feedback}
            </p>
          </div>

          {/* Specifications Builder */}
          <div className={`p-3 rounded-xl border transition-all ${
            targetIssueField === 'specifications'
              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Technical Specifications
                </label>
                <p className="text-[11px] text-slate-400">
                  {specifications.length} entries (Score: {liveEvaluation.breakdown.specifications.score}/20)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSpec}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950 dark:hover:bg-teal-900 dark:text-teal-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Specification</span>
              </button>
            </div>

            {specifications.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No technical specifications defined yet. Click "Add Specification" above.
              </div>
            ) : (
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      placeholder="e.g. Dimensions, Battery, Material"
                      className="w-1/3 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      placeholder="e.g. 10 x 8 inches, 30 hours, Aluminum"
                      className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      aria-label="Remove specification"
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {liveEvaluation.breakdown.specifications.feedback}
            </p>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Issues remaining: <span className="font-bold text-slate-800 dark:text-slate-200">{liveEvaluation.issues.length}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Recalculate SKU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
