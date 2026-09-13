import React, { useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { HISTORICAL_QUALITY_TREND, TOP_COMMON_ISSUES, COMPLETENESS_BENCHMARKS } from '../data/historicalAnalytics';
import { StatCard } from '../components/common/StatCard';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  CheckCircle2,
  AlertTriangle,
  Award,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from 'recharts';

export const Analytics: React.FC = () => {
  const { metrics, products, settings } = useCatalog();

  // Combine historical trend with today's live calculated score
  const trendData = useMemo(() => {
    const historical = [...HISTORICAL_QUALITY_TREND];
    const livePoint = {
      date: 'Live Now',
      timestamp: new Date().toISOString(),
      averageScore: metrics.averageScore,
      healthyCount: metrics.healthyCount,
      needsReviewCount: metrics.needsReviewCount,
      criticalCount: metrics.criticalCount,
      totalProducts: metrics.totalProducts,
      resolvedIssuesCount: 42,
    };
    return [...historical, livePoint];
  }, [metrics]);

  // Dynamically calculate completeness percentages across the current catalog
  const catalogCompleteness = useMemo(() => {
    const total = products.length || 1;
    let titleComplete = 0;
    let brandComplete = 0;
    let categoryComplete = 0;
    let priceComplete = 0;
    let descComplete = 0;
    let imageComplete = 0;
    let specsComplete = 0;
    let keywordsComplete = 0;

    products.forEach((p) => {
      if (p.title && p.title.trim().length >= 20) titleComplete++;
      if (p.brand && p.brand.trim()) brandComplete++;
      if (p.category && p.category !== 'Uncategorized') categoryComplete++;
      if (typeof p.price === 'number' && p.price > 0) priceComplete++;
      if (p.description && p.description.trim().length >= 100) descComplete++;
      if (p.imageUrl && p.imageUrl.trim()) imageComplete++;
      if (Array.isArray(p.specifications) && p.specifications.length >= 2) specsComplete++;
      if (Array.isArray(p.keywords) && p.keywords.length >= 3) keywordsComplete++;
    });

    return [
      { field: 'Product Title', percent: Math.round((titleComplete / total) * 100), benchmark: 95 },
      { field: 'Brand Name', percent: Math.round((brandComplete / total) * 100), benchmark: 98 },
      { field: 'Category Assignment', percent: Math.round((categoryComplete / total) * 100), benchmark: 100 },
      { field: 'Valid Pricing', percent: Math.round((priceComplete / total) * 100), benchmark: 100 },
      { field: 'Description Depth', percent: Math.round((descComplete / total) * 100), benchmark: 90 },
      { field: 'Primary Media', percent: Math.round((imageComplete / total) * 100), benchmark: 99 },
      { field: 'Technical Specifications', percent: Math.round((specsComplete / total) * 100), benchmark: 85 },
      { field: 'Search Keywords', percent: Math.round((keywordsComplete / total) * 100), benchmark: 80 },
    ];
  }, [products]);

  // Issue frequency chart data
  const dynamicIssueFrequencies = useMemo(() => {
    const counts: Record<string, number> = {};
    metrics.allIssues.forEach((issue) => {
      counts[issue.title] = (counts[issue.title] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [metrics.allIssues]);

  // Overall catalog completeness index
  const completenessIndex = useMemo(() => {
    if (catalogCompleteness.length === 0) return 0;
    const sum = catalogCompleteness.reduce((acc, curr) => acc + curr.percent, 0);
    return Math.round(sum / catalogCompleteness.length);
  }, [catalogCompleteness]);

  return (
    <div id="analytics-page" className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Catalog Quality Analytics &amp; Trends
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep diagnostic metrics, longitudinal quality trends, and catalog completeness benchmarking.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-quality-index"
          title="Completeness Index"
          value={`${completenessIndex}%`}
          subtitle="Cross-attribute catalog benchmark"
          icon={Percent}
          accentColor="teal"
          trend={{ value: '+4.2% this quarter', isPositive: true }}
        />

        <StatCard
          id="stat-catalog-health"
          title="Catalog Health Rate"
          value={`${Math.round((metrics.healthyCount / (metrics.totalProducts || 1)) * 100)}%`}
          subtitle={`${metrics.healthyCount} of ${metrics.totalProducts} SKUs Healthy`}
          icon={Award}
          accentColor="emerald"
          trend={{ value: 'Target: 85%+', isPositive: true }}
        />

        <StatCard
          id="stat-defect-density"
          title="Defect Density"
          value={`${(metrics.totalIssues / (metrics.totalProducts || 1)).toFixed(1)}`}
          subtitle="Avg issues per managed product"
          icon={AlertTriangle}
          accentColor="amber"
          trend={{ value: '-0.8 vs last month', isPositive: true }}
        />

        <StatCard
          id="stat-critical-share"
          title="Critical Blocker Rate"
          value={`${Math.round((metrics.criticalCount / (metrics.totalProducts || 1)) * 100)}%`}
          subtitle={`${metrics.criticalCount} SKUs below 50 score`}
          icon={ShieldAlert}
          accentColor="rose"
          trend={{ value: `${metrics.criticalIssuesCount} total blockers`, isPositive: metrics.criticalIssuesCount === 0 }}
        />
      </div>

      {/* Primary Chart: Quality Score Over Time */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Catalog Quality Score Trajectory (100-Point Standard)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical weekly audit averages culminating in today's live evaluated score.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
              Average Score ({metrics.averageScore})
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-1 bg-slate-300 dark:bg-slate-700 inline-block" />
              Target Goal ({settings.healthyThreshold})
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
                formatter={(val: any) => [`${val} / 100`, 'Quality Score']}
              />
              <Area
                type="monotone"
                dataKey="averageScore"
                stroke="#0d9488"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreAreaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Row: Completeness Percentages & Common Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Catalog Completeness Percentages (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Catalog Attribute Completeness</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Percentage of products across the catalog meeting minimum data quality requirements.
            </p>

            <div className="space-y-4">
              {catalogCompleteness.map((item) => (
                <div key={item.field} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-700 dark:text-slate-200">{item.field}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Goal: {item.benchmark}%</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {item.percent}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.percent >= 90
                          ? 'bg-emerald-500'
                          : item.percent >= 70
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Completeness:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
              {completenessIndex}% compliant
            </span>
          </div>
        </div>

        {/* Most Frequent Issues Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <span>Most Common Detected Defects</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Defect occurrence frequency across all {metrics.totalProducts} catalog products.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dynamicIssueFrequencies}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    width={110}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[0, 6, 6, 0]}>
                    {dynamicIssueFrequencies.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={index === 0 ? '#f43f5e' : index === 1 ? '#f97316' : '#0d9488'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Root Cause: Missing specifications and short titles</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {metrics.totalIssues} open
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table & Charts */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Category Health Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Comparative analysis of product volume, average score, and issue concentration per department.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.categoryStats.map((cat) => (
            <div
              key={cat.category}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {cat.category}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  {cat.count} SKUs
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Quality Average:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {cat.avgScore}/100
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.avgScore >= settings.healthyThreshold
                        ? 'bg-emerald-500'
                        : cat.avgScore >= settings.needsReviewThreshold
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.avgScore}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400">Unresolved Issues:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {cat.issueCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
