import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, AppSettings, ToastNotification, QualityIssue } from '../types';
import { generateInitialProducts } from '../data/sampleProducts';
import { calculateProductQuality, calculateStatus } from '../utils/qualityLogic.js';

interface ConfirmModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface CatalogContextType {
  products: Product[];
  settings: AppSettings;
  toasts: ToastNotification[];
  editingProduct: Product | null;
  targetIssueField: string | null;
  confirmModal: ConfirmModalConfig;
  // Product actions
  addProduct: (productData: Omit<Product, 'id' | 'sku' | 'qualityScore' | 'status' | 'issues' | 'scoreBreakdown' | 'recommendations' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => Product | null;
  deleteProduct: (id: string) => boolean;
  getProductById: (id: string) => Product | undefined;
  // Issue & Modal resolution
  openEditModal: (product: Product, targetField?: string) => void;
  closeEditModal: () => void;
  openConfirmModal: (config: Omit<ConfirmModalConfig, 'isOpen'>) => void;
  closeConfirmModal: () => void;
  resolveIssueWithModal: (issue: QualityIssue) => void;
  // Settings & System
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetCatalog: () => void;
  resetToSampleData: () => void;
  exportCatalogAsJson: () => void;
  importCatalogFromJson: (jsonString: string) => boolean;
  recalculateCatalog: () => void;
  // Toast notifications
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  // Dynamic Dashboard and catalog metrics
  metrics: {
    totalProducts: number;
    averageScore: number;
    healthyCount: number;
    needsReviewCount: number;
    criticalCount: number;
    totalIssues: number;
    criticalIssuesCount: number;
    highIssuesCount: number;
    mediumIssuesCount: number;
    lowIssuesCount: number;
    allIssues: QualityIssue[];
    categoryStats: { category: string; count: number; avgScore: number; issueCount: number }[];
  };
}

const STORAGE_KEYS = {
  PRODUCTS: 'catalogiq_products_v1',
  SETTINGS: 'catalogiq_settings_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  healthyThreshold: 80,
  needsReviewThreshold: 50,
  darkMode: false,
  autoAnalyzeOnSave: true,
  compactView: false,
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Settings from LocalStorage with safe defensive fallback
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      // malformed JSON fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Load Products from LocalStorage with safe defensive fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Re-verify quality logic on load to maintain strict consistency
          return parsed.map((p) => {
            const quality = calculateProductQuality(p, {
              healthyThreshold: settings.healthyThreshold,
              needsReviewThreshold: settings.needsReviewThreshold,
            });
            return {
              ...p,
              qualityScore: quality.score,
              status: quality.status,
              issues: quality.issues,
              scoreBreakdown: quality.breakdown,
              recommendations: quality.recommendations,
            };
          });
        }
      }
    } catch {
      // malformed JSON fallback
    }
    return generateInitialProducts({
      healthyThreshold: settings.healthyThreshold,
      needsReviewThreshold: settings.needsReviewThreshold,
    });
  });

  // Modal & Toast state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [targetIssueField, setTargetIssueField] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toast Helpers
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type }: Omit<ToastNotification, 'id' | 'timestamp'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: ToastNotification = { id, title, message, type, timestamp: Date.now() };
      setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  // Sync products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Sync settings to LocalStorage & Dark Mode classes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }

    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Recalculate all products when thresholds change
  useEffect(() => {
    setProducts((prev) =>
      prev.map((p) => {
        const quality = calculateProductQuality(p, {
          healthyThreshold: settings.healthyThreshold,
          needsReviewThreshold: settings.needsReviewThreshold,
        });
        return {
          ...p,
          qualityScore: quality.score,
          status: quality.status,
          issues: quality.issues,
          scoreBreakdown: quality.breakdown,
          recommendations: quality.recommendations,
        };
      })
    );
  }, [settings.healthyThreshold, settings.needsReviewThreshold]);

  // Master recalculate catalog trigger
  const recalculateCatalog = useCallback(() => {
    setProducts((prev) =>
      prev.map((p) => {
        const quality = calculateProductQuality(p, {
          healthyThreshold: settings.healthyThreshold,
          needsReviewThreshold: settings.needsReviewThreshold,
        });
        return {
          ...p,
          qualityScore: quality.score,
          status: quality.status,
          issues: quality.issues,
          scoreBreakdown: quality.breakdown,
          recommendations: quality.recommendations,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addToast({
      title: 'Catalog Recalculated',
      message: 'All product quality scores, issues, and status flags have been refreshed.',
      type: 'info',
    });
  }, [settings.healthyThreshold, settings.needsReviewThreshold, addToast]);

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      addToast({
        title: 'Settings Updated',
        message: 'Platform preferences have been saved.',
        type: 'success',
      });
    },
    [addToast]
  );

  // Reset Catalog to pristine defaults
  const resetCatalog = useCallback(() => {
    const defaultProducts = generateInitialProducts({
      healthyThreshold: settings.healthyThreshold,
      needsReviewThreshold: settings.needsReviewThreshold,
    });
    setProducts(defaultProducts);
    addToast({
      title: 'Catalog Reset Complete',
      message: 'Restored 24 baseline benchmark products across all categories.',
      type: 'warning',
    });
  }, [settings.healthyThreshold, settings.needsReviewThreshold, addToast]);

  // Export Catalog as JSON file
  const exportCatalogAsJson = useCallback(() => {
    try {
      const dataStr = JSON.stringify(products, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalogiq_products_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast({
        title: 'Export Successful',
        message: `Exported ${products.length} catalog products to JSON file.`,
        type: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Export Failed',
        message: 'Could not generate JSON export file.',
        type: 'error',
      });
    }
  }, [products, addToast]);

  // Import Catalog from JSON string
  const importCatalogFromJson = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('Invalid format: expected non-empty array of products');
        }

        // Re-evaluate each product to guarantee consistent score and issues
        const reEvaluated: Product[] = parsed.map((item: any, index: number) => {
          const payload = {
            id: item.id || `imported-${Date.now()}-${index}`,
            sku: item.sku || `SKU-IMP-${1000 + index}`,
            title: String(item.title || ''),
            brand: String(item.brand || ''),
            category: String(item.category || 'Electronics'),
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
            description: String(item.description || ''),
            imageUrl: String(item.imageUrl || ''),
            additionalImages: Array.isArray(item.additionalImages) ? item.additionalImages : [],
            keywords: Array.isArray(item.keywords) ? item.keywords : [],
            specifications: Array.isArray(item.specifications) ? item.specifications : [],
            stock: typeof item.stock === 'number' ? item.stock : 50,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const quality = calculateProductQuality(payload, {
            healthyThreshold: settings.healthyThreshold,
            needsReviewThreshold: settings.needsReviewThreshold,
          });

          return {
            ...payload,
            qualityScore: quality.score,
            status: quality.status,
            issues: quality.issues,
            scoreBreakdown: quality.breakdown,
            recommendations: quality.recommendations,
          };
        });

        setProducts(reEvaluated);
        addToast({
          title: 'Import Successful',
          message: `Imported and validated ${reEvaluated.length} products.`,
          type: 'success',
        });
        return true;
      } catch (err: any) {
        addToast({
          title: 'Import Failed',
          message: err?.message || 'Invalid JSON file structure. Ensure array of products.',
          type: 'error',
        });
        return false;
      }
    },
    [settings.healthyThreshold, settings.needsReviewThreshold, addToast]
  );

  // Find product by ID
  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  // Add Product
  const addProduct = useCallback(
    (
      productData: Omit<
        Product,
        'id' | 'sku' | 'qualityScore' | 'status' | 'issues' | 'scoreBreakdown' | 'recommendations' | 'createdAt' | 'updatedAt'
      >
    ): Product => {
      const id = `prod-${Date.now()}`;
      const skuPrefix = (productData.category || 'GEN').substring(0, 4).toUpperCase();
      const skuRandom = Math.floor(1000 + Math.random() * 9000);
      const sku = `${skuPrefix}-${skuRandom}`;
      const now = new Date().toISOString();

      const quality = calculateProductQuality(productData, {
        healthyThreshold: settings.healthyThreshold,
        needsReviewThreshold: settings.needsReviewThreshold,
      });

      const newProduct: Product = {
        ...productData,
        id,
        sku,
        rating: 4.5,
        reviewCount: 0,
        stock: productData.stock ?? 50,
        qualityScore: quality.score,
        status: quality.status,
        issues: quality.issues,
        scoreBreakdown: quality.breakdown,
        recommendations: quality.recommendations,
        createdAt: now,
        updatedAt: now,
      };

      setProducts((prev) => [newProduct, ...prev]);

      addToast({
        title: 'Product Created',
        message: `Added "${newProduct.title || 'New Product'}" with Quality Score ${quality.score}/100.`,
        type: 'success',
      });

      return newProduct;
    },
    [settings.healthyThreshold, settings.needsReviewThreshold, addToast]
  );

  // Update Product (automatically recalculates score, breakdown, issues, and status)
  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>): Product | null => {
      let updatedProduct: Product | null = null;

      setProducts((prev) => {
        const index = prev.findIndex((p) => p.id === id);
        if (index === -1) return prev;

        const current = prev[index];
        const merged = {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const quality = calculateProductQuality(merged, {
          healthyThreshold: settings.healthyThreshold,
          needsReviewThreshold: settings.needsReviewThreshold,
        });

        updatedProduct = {
          ...merged,
          qualityScore: quality.score,
          status: quality.status,
          issues: quality.issues,
          scoreBreakdown: quality.breakdown,
          recommendations: quality.recommendations,
        };

        const next = [...prev];
        next[index] = updatedProduct;
        return next;
      });

      if (updatedProduct) {
        addToast({
          title: 'Product Updated',
          message: `Recalculated Quality Score: ${(updatedProduct as Product).qualityScore}/100.`,
          type: 'success',
        });
      }

      return updatedProduct;
    },
    [settings.healthyThreshold, settings.needsReviewThreshold, addToast]
  );

  // Delete Product
  const deleteProduct = useCallback(
    (id: string): boolean => {
      const prod = products.find((p) => p.id === id);
      if (!prod) return false;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast({
        title: 'Product Deleted',
        message: `Removed "${prod.title || prod.sku}" from catalog.`,
        type: 'info',
      });
      return true;
    },
    [products, addToast]
  );

  // Modal Actions
  const openEditModal = useCallback((product: Product, targetField?: string) => {
    setEditingProduct(product);
    setTargetIssueField(targetField || null);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditingProduct(null);
    setTargetIssueField(null);
  }, []);

  const openConfirmModal = useCallback((config: Omit<ConfirmModalConfig, 'isOpen'>) => {
    setConfirmModal({
      ...config,
      isOpen: true,
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Resolve issue by opening edit modal targeting the specific product and field
  const resolveIssueWithModal = useCallback(
    (issue: QualityIssue) => {
      const product = products.find((p) => p.id === issue.productId);
      if (product) {
        openEditModal(product, issue.field);
      } else {
        addToast({
          title: 'Product Not Found',
          message: 'The product associated with this issue could not be found.',
          type: 'error',
        });
      }
    },
    [products, openEditModal, addToast]
  );

  // Derived Dynamic Dashboard Metrics
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    let totalScoreSum = 0;
    let healthyCount = 0;
    let needsReviewCount = 0;
    let criticalCount = 0;

    const allIssues: QualityIssue[] = [];
    let criticalIssuesCount = 0;
    let highIssuesCount = 0;
    let mediumIssuesCount = 0;
    let lowIssuesCount = 0;

    const categoryMap: Record<string, { count: number; scoreSum: number; issuesCount: number }> = {};

    products.forEach((p) => {
      totalScoreSum += p.qualityScore;
      if (p.status === 'Healthy') healthyCount++;
      else if (p.status === 'Needs Review') needsReviewCount++;
      else criticalCount++;

      // Tally issues
      p.issues.forEach((issue) => {
        allIssues.push(issue);
        if (issue.severity === 'Critical') criticalIssuesCount++;
        else if (issue.severity === 'High') highIssuesCount++;
        else if (issue.severity === 'Medium') mediumIssuesCount++;
        else if (issue.severity === 'Low') lowIssuesCount++;
      });

      // Category breakdown
      const cat = p.category?.trim() || 'Uncategorized';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, scoreSum: 0, issuesCount: 0 };
      }
      categoryMap[cat].count += 1;
      categoryMap[cat].scoreSum += p.qualityScore;
      categoryMap[cat].issuesCount += p.issues.length;
    });

    const averageScore = totalProducts > 0 ? Math.round((totalScoreSum / totalProducts) * 10) / 10 : 0;

    const categoryStats = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      avgScore: Math.round((data.scoreSum / data.count) * 10) / 10,
      issueCount: data.issuesCount,
    })).sort((a, b) => b.count - a.count);

    return {
      totalProducts,
      averageScore,
      healthyCount,
      needsReviewCount,
      criticalCount,
      totalIssues: allIssues.length,
      criticalIssuesCount,
      highIssuesCount,
      mediumIssuesCount,
      lowIssuesCount,
      allIssues,
      categoryStats,
    };
  }, [products]);

  const value = {
    products,
    settings,
    toasts,
    editingProduct,
    targetIssueField,
    confirmModal,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    openEditModal,
    closeEditModal,
    openConfirmModal,
    closeConfirmModal,
    resolveIssueWithModal,
    updateSettings,
    resetCatalog,
    resetToSampleData: resetCatalog,
    exportCatalogAsJson,
    importCatalogFromJson,
    recalculateCatalog,
    addToast,
    removeToast,
    metrics,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = (): CatalogContextType => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
