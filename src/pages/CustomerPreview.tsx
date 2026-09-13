import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  ScanSearch,
  ShoppingCart,
  Heart,
  Share2,
  ImageOff,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const CustomerPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getProductById, openEditModal, settings } = useCatalog();

  // Selected product
  const activeProduct = useMemo(() => {
    if (id) {
      const found = getProductById(id);
      if (found) return found;
    }
    return products[0];
  }, [id, getProductById, products]);

  // Gallery Active Image
  const allImages = useMemo(() => {
    if (!activeProduct) return [];
    const list: string[] = [];
    if (activeProduct.imageUrl && activeProduct.imageUrl.trim()) {
      list.push(activeProduct.imageUrl);
    }
    if (Array.isArray(activeProduct.additionalImages)) {
      list.push(...activeProduct.additionalImages.filter(Boolean));
    }
    return list;
  }, [activeProduct]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Active perspective: 'storefront' or 'comparison'
  const [activeTab, setActiveTab] = useState<'storefront' | 'comparison'>('storefront');

  if (!activeProduct) {
    return (
      <EmptyState
        title="No Products in Catalog"
        description="Add a product to the catalog to inspect the customer storefront preview."
        actionText="Go to Catalog"
        onAction={() => navigate('/catalog')}
      />
    );
  }

  const isCustomerReady = activeProduct.qualityScore >= settings.healthyThreshold;
  const currentImage = allImages[selectedImageIndex] || activeProduct.imageUrl;

  return (
    <div id="customer-preview-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & SKU Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/product/${activeProduct.id}`)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Product Detail"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Storefront Simulator
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                Live Rendering
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Preview how shoppers perceive this listing on production web and mobile channels.
            </p>
          </div>
        </div>

        {/* Product selector & View tab */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Switch SKU:</span>
            <select
              value={activeProduct.id}
              onChange={(e) => {
                setSelectedImageIndex(0);
                navigate(`/product/${e.target.value}/preview`);
              }}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 cursor-pointer max-w-xs truncate"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} — {p.title || 'Untitled'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'storefront'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Storefront View
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Catalog vs Customer Audit
            </button>
          </div>
        </div>
      </div>

      {/* Customer Readiness Verdict Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isCustomerReady
            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
              isCustomerReady ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
          >
            {isCustomerReady ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-tight">
                {isCustomerReady ? 'Customer Ready — High Conversion Likelihood' : 'Not Customer Ready — Conversion Risk Detected'}
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/70 dark:bg-black/30">
                Score: {activeProduct.qualityScore}/100
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isCustomerReady
                ? 'Rich imagery, accurate brand attribution, comprehensive specifications, and transparent pricing.'
                : `Product has ${activeProduct.issues.length} active issues that may confuse customers or cause high bounce rates.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => openEditModal(activeProduct)}
          className="shrink-0 px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
        >
          Fix Listing Fields
        </button>
      </div>

      {activeTab === 'storefront' ? (
        /* Realistic E-Commerce Storefront Simulator */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Simulated E-Commerce Header Bar */}
          <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="font-mono text-[11px] ml-2 text-slate-600 dark:text-slate-300">
                https://storefront.example.com/products/{activeProduct.sku.toLowerCase()}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Storefront Preview
            </span>
          </div>

          <div className="p-6 sm:p-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span>{activeProduct.category || 'All Products'}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">
                {activeProduct.title || 'Untitled Product'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Product Media Column (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-square rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center group">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={activeProduct.title || 'Product'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-rose-400 p-8 text-center">
                      <ImageOff className="w-16 h-16 mb-2" />
                      <span className="text-base font-bold">Image Unavailable</span>
                      <p className="text-xs text-slate-400 mt-1">
                        Shoppers on Amazon / Shopify rarely purchase items without images.
                      </p>
                    </div>
                  )}

                  <button
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-600 hover:text-rose-600 shadow-xs transition-colors"
                    aria-label="Save to wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-18 h-18 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                          selectedImageIndex === idx
                            ? 'border-teal-600 ring-2 ring-teal-600/30'
                            : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information Column (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  {/* Brand & Category */}
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                    <span>{activeProduct.brand || <span className="text-rose-500">[Missing Brand]</span>}</span>
                    <span>•</span>
                    <span className="text-slate-500">{activeProduct.category}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    {activeProduct.title || <span className="text-rose-500 italic">[Product Title Missing]</span>}
                  </h2>

                  {/* Customer Rating Simulation */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">4.8</span>
                    <span className="text-xs text-slate-400">(128 customer reviews)</span>
                  </div>
                </div>

                {/* Price Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                      {typeof activeProduct.price === 'number' && activeProduct.price > 0
                        ? `$${activeProduct.price.toFixed(2)}`
                        : <span className="text-rose-500 text-lg font-sans">[Pricing Not Configured]</span>}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ${((activeProduct.price || 0) * 1.2).toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Save 15%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">In stock ({activeProduct.stock ?? 50} units left). Free 2-day delivery with Prime.</p>
                </div>

                {/* Call to action buttons */}
                <div className="flex items-center gap-3">
                  <button
                    className="flex-1 py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Shipping & Assurance Badges */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <Truck className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">Free Shipping</span>
                    <span className="text-[10px] text-slate-400">On orders over $35</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <RotateCcw className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">30-Day Returns</span>
                    <span className="text-[10px] text-slate-400">Hassle-free policy</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block">Verified Brand</span>
                    <span className="text-[10px] text-slate-400">Direct from maker</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    About this item
                  </h3>
                  {activeProduct.description ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {activeProduct.description}
                    </p>
                  ) : (
                    <p className="text-xs text-rose-500 italic">
                      No product description provided. Customers will bounce to competing listings.
                    </p>
                  )}
                </div>

                {/* Technical Specifications Table */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                    Product Specifications
                  </h3>
                  {Array.isArray(activeProduct.specifications) && activeProduct.specifications.length > 0 ? (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {activeProduct.specifications.map((spec, i) => (
                        <div key={i} className="flex px-4 py-2.5 bg-white dark:bg-slate-900">
                          <span className="w-1/3 font-semibold text-slate-500 dark:text-slate-400">
                            {spec.key}
                          </span>
                          <span className="flex-1 font-medium text-slate-900 dark:text-white">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600 italic">
                      Specifications not specified. Customers may abandon purchase due to uncertainty on size or compatibility.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Catalog vs Customer Comparison Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Perspective Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Eye className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Perspective
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Visual Appeal &amp; Trust:</span>
                {allImages.length >= 2 ? (
                  <p className="text-emerald-700 dark:text-emerald-300">
                    High: {allImages.length} high-resolution photos give customers confidence in product build and dimensions.
                  </p>
                ) : (
                  <p className="text-rose-700 dark:text-rose-300">
                    Weak: Single or missing image creates hesitation and skepticism.
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Price Clarity:</span>
                {typeof activeProduct.price === 'number' && activeProduct.price > 0 ? (
                  <p className="text-emerald-700 dark:text-emerald-300">
                    Transparent: ${activeProduct.price.toFixed(2)} is prominently displayed with savings context.
                  </p>
                ) : (
                  <p className="text-rose-700 dark:text-rose-300">
                    Broken: No valid price means customers cannot buy.
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Feature Confidence:</span>
                {activeProduct.specifications.length >= 3 ? (
                  <p className="text-emerald-700 dark:text-emerald-300">
                    Rich: {activeProduct.specifications.length} clear specifications answer pre-purchase questions.
                  </p>
                ) : (
                  <p className="text-amber-700 dark:text-amber-300">
                    Sparse: Insufficient specifications increase pre-purchase bounce and post-purchase return rates.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Internal Catalog Perspective Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ScanSearch className="w-5 h-5 text-teal-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CatalogIQ Engine Audit
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Quality Score:</span>
                <p className="text-slate-800 dark:text-slate-200">
                  {activeProduct.qualityScore} / 100 points ({activeProduct.status})
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Open Catalog Issues:</span>
                <p className="text-slate-800 dark:text-slate-200">
                  {activeProduct.issues.length} active violations across taxonomy, metadata, and media.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Channel Readiness:</span>
                <p className="text-slate-800 dark:text-slate-200">
                  {isCustomerReady ? 'Approved for global syndication' : 'Flagged: Fix critical anomalies before syndicating to Google Shopping & Amazon.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/product/${activeProduct.id}`)}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  View Full Product Audit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
