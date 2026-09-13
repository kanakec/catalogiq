export interface HistoricalTrendPoint {
  date: string;
  timestamp: string;
  averageScore: number;
  healthyCount: number;
  needsReviewCount: number;
  criticalCount: number;
  totalProducts: number;
  resolvedIssuesCount: number;
}

export const HISTORICAL_QUALITY_TREND: HistoricalTrendPoint[] = [
  {
    date: 'Aug 14',
    timestamp: '2026-08-14',
    averageScore: 61.2,
    healthyCount: 7,
    needsReviewCount: 11,
    criticalCount: 6,
    totalProducts: 24,
    resolvedIssuesCount: 4,
  },
  {
    date: 'Aug 21',
    timestamp: '2026-08-21',
    averageScore: 64.5,
    healthyCount: 9,
    needsReviewCount: 10,
    criticalCount: 5,
    totalProducts: 24,
    resolvedIssuesCount: 9,
  },
  {
    date: 'Aug 28',
    timestamp: '2026-08-28',
    averageScore: 68.0,
    healthyCount: 11,
    needsReviewCount: 9,
    criticalCount: 4,
    totalProducts: 24,
    resolvedIssuesCount: 15,
  },
  {
    date: 'Sep 04',
    timestamp: '2026-09-04',
    averageScore: 71.4,
    healthyCount: 13,
    needsReviewCount: 8,
    criticalCount: 3,
    totalProducts: 24,
    resolvedIssuesCount: 22,
  },
  {
    date: 'Sep 11',
    timestamp: '2026-09-11',
    averageScore: 74.8,
    healthyCount: 15,
    needsReviewCount: 7,
    criticalCount: 2,
    totalProducts: 24,
    resolvedIssuesCount: 31,
  },
];

export const CATEGORY_BENCHMARKS = [
  { category: 'Electronics', targetScore: 85, industryAverage: 72 },
  { category: 'Fashion', targetScore: 80, industryAverage: 68 },
  { category: 'Home & Kitchen', targetScore: 82, industryAverage: 70 },
  { category: 'Sports', targetScore: 78, industryAverage: 65 },
  { category: 'Beauty', targetScore: 88, industryAverage: 74 },
  { category: 'Accessories', targetScore: 75, industryAverage: 62 },
];

export const TOP_COMMON_ISSUES = [
  { name: 'Missing Brand', count: 8, severity: 'Critical' },
  { name: 'Missing Image', count: 6, severity: 'Critical' },
  { name: 'Short Description', count: 12, severity: 'High' },
  { name: 'No Specifications', count: 9, severity: 'High' },
  { name: 'Invalid Price', count: 4, severity: 'Critical' },
  { name: 'Missing Keywords', count: 14, severity: 'Low' },
  { name: 'Uncategorized SKU', count: 5, severity: 'Medium' },
];

export const COMPLETENESS_BENCHMARKS = [
  { field: 'Product Title', industryRate: 98, platformAverage: 92 },
  { field: 'Brand Name', industryRate: 95, platformAverage: 88 },
  { field: 'Category', industryRate: 100, platformAverage: 94 },
  { field: 'Price', industryRate: 100, platformAverage: 96 },
  { field: 'Description', industryRate: 90, platformAverage: 81 },
  { field: 'Images', industryRate: 99, platformAverage: 89 },
  { field: 'Specifications', industryRate: 85, platformAverage: 73 },
  { field: 'Keywords', industryRate: 80, platformAverage: 68 },
];
