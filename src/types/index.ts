export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ProductStatus = 'Healthy' | 'Needs Review' | 'Critical';

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface QualityIssue {
  id: string;
  productId: string;
  productName: string;
  field: 'title' | 'description' | 'brand' | 'category' | 'price' | 'specifications' | 'images' | 'keywords';
  severity: IssueSeverity;
  type: 'Missing Attribute' | 'Content Quality' | 'Data Integrity' | 'Discoverability' | 'Compliance';
  title: string;
  description: string;
  recommendation: string;
}

export interface ScoreBreakdown {
  title: { score: number; max: number; feedback: string };
  description: { score: number; max: number; feedback: string };
  brand: { score: number; max: number; feedback: string };
  category: { score: number; max: number; feedback: string };
  price: { score: number; max: number; feedback: string };
  specifications: { score: number; max: number; feedback: string };
  images: { score: number; max: number; feedback: string };
  keywords: { score: number; max: number; feedback: string };
}

export interface ProductQualityResult {
  score: number;
  status: ProductStatus;
  breakdown: ScoreBreakdown;
  issues: QualityIssue[];
  recommendations: string[];
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  keywords: string[];
  specifications: ProductSpecification[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  qualityScore: number;
  status: ProductStatus;
  issues: QualityIssue[];
  scoreBreakdown: ScoreBreakdown;
  recommendations: string[];
  updatedAt: string;
  createdAt: string;
}

export interface AppSettings {
  healthyThreshold: number; // default 80
  needsReviewThreshold: number; // default 50
  darkMode: boolean;
  autoAnalyzeOnSave: boolean;
  compactView: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}
