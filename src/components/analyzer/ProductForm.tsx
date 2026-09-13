import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { calculateProductQuality } from '../../utils/qualityLogic.js';
import { QualityScore } from '../common/QualityScore';
import { StatusBadge } from '../common/StatusBadge';
import { ProductSpecification, QualityIssue } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  RotateCcw,
  Save,
  Check,
  Zap,
} from 'lucide-react';

export const ProductForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, settings } = useCatalog();

  const prefillId = searchParams.get('id');

  // Form Fields
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImagesText, setAdditionalImagesText] = useState('');
  const [keywordsText, setKeywordsText] = useState('');
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([
    { key: 'Dimensions', value: '' },
    { key: 'Material', value: '' },
    { key: 'Warranty', value: '' },
  ]);

  // Load existing product if prefillId exists
  useEffect(() => {
    if (prefillId) {
      const existing = products.find((p) => p.id === prefillId);
      if (existing) {
        setTitle(existing.title || '');
        setBrand(existing.brand || '');
        setCategory(existing.category || 'Electronics');
        setPrice(
          existing.price !== undefined && existing.price !== null
            ? String(existing.price)
            : ''
        );
        setDescription(existing.description || '');
        setImageUrl(existing.imageUrl || '');
        setAdditionalImagesText(
          Array.isArray(existing.additionalImages)
            ? existing.additionalImages.join('\n')
            : ''
        );
        setKeywordsText(
          Array.isArray(existing.keywords)
            ? existing.keywords.join(', ')
            : ''
        );
        if (Array.isArray(existing.specifications) && existing.specifications.length > 0) {
          setSpecifications([...existing.specifications]);
        }
      }
    }
  }, [prefillId, products]);

  // Quick Preset / Template loader
  const loadPreset = (type: 'healthy' | 'incomplete') => {
    if (type === 'healthy') {
      setTitle('Bose QuietComfort Ultra Wireless Noise Cancelling Headphones with Spatial Audio');
      setBrand('Bose');
      setCategory('Electronics');
      setPrice('429.00');
      setDescription('World-class noise cancellation, quieter than ever before. Breakthrough spatialized audio for more immersive listening. Elevated design and luxe materials for unmatched comfort. CustomTune technology personalizes sound to the shape of your ears.');
      setImageUrl('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80');
      setAdditionalImagesText('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80\nhttps://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80');
      setKeywordsText('headphones, bose, noise canceling, wireless, bluetooth, over-ear, spatial audio');
      setSpecifications([
        { key: 'Battery Life', value: 'Up to 24 hours playback' },
        { key: 'Bluetooth Version', value: 'Bluetooth 5.3' },
        { key: 'Weight', value: '252 grams' },
        { key: 'Charging Cable', value: 'USB-C (included)' },
      ]);
    } else {
      setTitle('Smart Watch');
      setBrand('');
      setCategory('Uncategorized');
      setPrice('0');
      setDescription('Basic fitness tracker.');
      setImageUrl('');
      setAdditionalImagesText('');
      setKeywordsText('');
      setSpecifications([]);
    }
  };

  const handleReset = () => {
    setTitle('');
    setBrand('');
    setCategory('Electronics');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setAdditionalImagesText('');
    setKeywordsText('');
    setSpecifications([
      { key: 'Dimensions', value: '' },
      { key: 'Material', value: '' },
      { key: 'Warranty', value: '' },
    ]);
  };

  // Live Score Engine Calculation
  const evaluation = useMemo(() => {
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

    const payload = {
      id: prefillId || 'analyzer-temp',
      title,
      brand,
      category,
      price: isNaN(parsedPrice) ? null : parsedPrice,
      description,
      imageUrl,
      additionalImages: parsedAddlImages,
      keywords: parsedKeywords,
      specifications: validSpecs,
    };

    return calculateProductQuality(payload, {
      healthyThreshold: settings.healthyThreshold,
      needsReviewThreshold: settings.needsReviewThreshold,
    });
  }, [
    prefillId,
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

  // Specifications helpers
  const handleAddSpec = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    setSpecifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Save to Catalog
  const handleSaveToCatalog = () => {
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

    const payload = {
      title: title.trim(),
      brand: brand.trim(),
      category: category.trim(),
      price: isNaN(parsedPrice) ? 0 : parsedPrice,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      additionalImages: parsedAddlImages,
      keywords: parsedKeywords,
      specifications: validSpecs,
      stock: 50,
    };

    if (prefillId) {
      updateProduct(prefillId, payload);
      navigate(`/product/${prefillId}`);
    } else {
      const created = addProduct(payload);
      navigate(`/product/${created.id}`);
    }
  };

  const categoriesList = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Sports',
    'Beauty',
    'Accessories',
  ];

  return (
    <div id="product-analyzer-page" className="space-y-8">
      {/* Top Banner & Quick Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Product Quality Analyzer &amp; Ingestion
            </h2>
            {prefillId && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Editing Existing SKU
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-dimensional scoring against the 100-point catalog completeness standard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadPreset('healthy')}
            className="px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Load Healthy Preset</span>
          </button>

          <button
            type="button"
            onClick={() => loadPreset('incomplete')}
            className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Load Defective Preset</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: The Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <span>Product Attributes</span>
          </h3>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="analyzer-title" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Product Title / Name (Max 15 pts) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                Score: {evaluation.breakdown.title.score}/15
              </span>
            </div>
            <textarea
              id="analyzer-title"
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Noise Canceling Headphones with Auto NC Optimizer..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Optimal title length is 50-150 characters with brand, model, and key specs. Current: {title.length} chars.
            </p>
          </div>

          {/* Brand, Category, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="analyzer-brand" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Brand (10 pts) <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {evaluation.breakdown.brand.score}/10
                </span>
              </div>
              <input
                id="analyzer-brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sony, Apple"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="analyzer-category" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Category (10 pts) <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {evaluation.breakdown.category.score}/10
                </span>
              </div>
              <select
                id="analyzer-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Uncategorized">Uncategorized (Faulty)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="analyzer-price" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Price ($) (10 pts) <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {evaluation.breakdown.price.score}/10
                </span>
              </div>
              <input
                id="analyzer-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="analyzer-description" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Product Description (Max 20 pts) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                Score: {evaluation.breakdown.description.score}/20
              </span>
            </div>
            <textarea
              id="analyzer-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the materials, ergonomics, warranty, what is in the box, and value proposition..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Minimum 150 characters recommended. Current: {description.length} chars.
            </p>
          </div>

          {/* Image URLs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="analyzer-image-url" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Primary Image URL (Max 10 pts) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                Score: {evaluation.breakdown.images.score}/10
              </span>
            </div>
            <input
              id="analyzer-image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />

            <div className="mt-2.5">
              <label htmlFor="analyzer-additional-images" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Additional Gallery URLs (One per line)
              </label>
              <textarea
                id="analyzer-additional-images"
                rows={2}
                value={additionalImagesText}
                onChange={(e) => setAdditionalImagesText(e.target.value)}
                placeholder="https://...&#10;https://..."
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="analyzer-keywords" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Search Keywords (Max 5 pts)
              </label>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                Score: {evaluation.breakdown.keywords.score}/5
              </span>
            </div>
            <input
              id="analyzer-keywords"
              type="text"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="e.g. bluetooth, noise canceling, wireless, over-ear"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Specifications (Max 20 pts)
                </label>
                <p className="text-[11px] text-slate-400">3+ detailed specifications required for full marks.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Score: {evaluation.breakdown.specifications.score}/20
                </span>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950 dark:hover:bg-teal-900 dark:text-teal-300 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {specifications.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                    placeholder="Attribute (e.g. Battery Life)"
                    className="w-1/3 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                    placeholder="Value (e.g. 30 Hours)"
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(i)}
                    aria-label="Remove spec"
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Save to Catalog */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              id="save-to-catalog-btn"
              onClick={handleSaveToCatalog}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{prefillId ? 'Update & Commit SKU' : 'Save SKU to Catalog'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Quality Diagnosis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Score Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Live Quality Score
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {evaluation.score}
                  <span className="text-xl text-slate-400 font-normal">/100</span>
                </div>
                <div className="mt-2">
                  <StatusBadge status={evaluation.status} size="md" />
                </div>
              </div>

              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl border bg-slate-50 dark:bg-slate-800/80">
                <span
                  className={
                    evaluation.score >= settings.healthyThreshold
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : evaluation.score >= settings.needsReviewThreshold
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }
                >
                  {evaluation.score}
                </span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="mt-5 w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  evaluation.score >= settings.healthyThreshold
                    ? 'bg-emerald-500'
                    : evaluation.score >= settings.needsReviewThreshold
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${evaluation.score}%` }}
              />
            </div>

            {/* Threshold guide */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>0 (Critical)</span>
              <span>Needs Review ({settings.needsReviewThreshold}+)</span>
              <span>Healthy ({settings.healthyThreshold}+)</span>
            </div>
          </div>

          {/* 8-Dimensional Score Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Scoring Model Breakdown (100 Points)
            </h4>

            <div className="space-y-3.5 text-xs">
              {Object.entries(evaluation.breakdown).map(([key, item]: [string, any]) => {
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected Issues */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detected Quality Issues ({evaluation.issues.length})
              </h4>
              {evaluation.issues.length === 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pristine SKU
                </span>
              )}
            </div>

            {evaluation.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Zero catalog issues detected! All standard attributes, specifications, and media exceed platform quality benchmarks.
              </div>
            ) : (
              <div className="space-y-2.5">
                {evaluation.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {issue.title}
                      </span>
                      <StatusBadge severity={issue.severity} size="sm" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {issue.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Actionable Recommendations
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {evaluation.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
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
