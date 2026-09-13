import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { QualityScore } from '../components/common/QualityScore';
import { HISTORICAL_QUALITY_TREND } from '../data/historicalAnalytics';
import {
  Boxes,
  Award,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, settings, resolveIssueWithModal } = useCatalog();

  // Combine historical trend with today's live calculated score
  const trendData = useMemo(() => {
    const historical = [...HISTORICAL_QUALITY_TREND];
    const livePoint = {
      date: 'Today (Live)',
      timestamp: new Date().toISOString(),
      averageScore: metrics.averageScore,
      healthyCount: metrics.healthyCount,
      needsReviewCount: metrics.needsReviewCount,
      criticalCount: metrics.criticalCount,
      totalProducts: metrics.totalProducts,
      resolvedIssuesCount: 38,
    };
    return [...historical, livePoint];
  }, [metrics]);

  // Issue distribution by severity
  const severityDistribution = useMemo(() => {
    return [
      { name: 'Critical', count: metrics.criticalIssuesCount, color: '#f43f5e' }, // rose-500
      { name: 'High', count: metrics.highIssuesCount, color: '#f97316' }, // orange-500
      { name: 'Medium', count: metrics.mediumIssuesCount, color: '#eab308' }, // amber-500
      { name: 'Low', count: metrics.lowIssuesCount, color: '#64748b' }, // slate-500
    ];
  }, [metrics]);

  // Top critical issues for the action table
  const recentCriticalIssues = useMemo(() => {
    return metrics.allIssues
      .filter((i) => i.severity === 'Critical' || i.severity === 'High')
      .slice(0, 5);
  }, [metrics.allIssues]);

  return (
    <div id="dashboard-page" className="space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Catalog Quality Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time catalog health telemetry, anomaly detection, and customer-readiness benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/issues')}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Manage All Issues ({metrics.totalIssues})</span>
          </button>

          <button
            onClick={() => navigate('/catalog')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Boxes className="w-4 h-4" />
            <span>View Catalog</span>
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-total-products"
          title="Total Products"
          value={metrics.totalProducts}
          subtitle="Managed catalog SKUs"
          icon={Boxes}
          accentColor="indigo"
          trend={{ value: '+4 added this month', isPositive: true }}
          onClick={() => navigate('/catalog')}
        />

        <StatCard
          id="stat-avg-score"
          title="Average Quality Score"
          value={`${metrics.averageScore} / 100`}
          subtitle={`Target: ${settings.healthyThreshold}+`}
          icon={Award}
          accentColor="teal"
          trend={{ value: '+13.6 pts vs Q2 baseline', isPositive: true }}
          onClick={() => navigate('/analytics')}
        />

        <StatCard
          id="stat-needs-review"
          title="Products Needing Review"
          value={metrics.needsReviewCount}
          subtitle={`Score ${settings.needsReviewThreshold}-${settings.healthyThreshold - 1}`}
          icon={AlertTriangle}
          accentColor="amber"
          trend={{ value: '-3 vs last audit', isPositive: true }}
          onClick={() => navigate('/catalog?status=Needs+Review')}
        />

        <StatCard
          id="stat-critical-issues"
          title="Critical Issues"
          value={metrics.criticalIssuesCount}
          subtitle="Immediate revenue blockers"
          icon={AlertCircle}
          accentColor="rose"
          trend={{ value: `${metrics.criticalCount} critical SKUs`, isPositive: metrics.criticalIssuesCount === 0 }}
          onClick={() => navigate('/issues?severity=Critical')}
        />
      </div>

      {/* Health Overview & Trend Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quality Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Catalog Quality Score Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly historical audit progress leading up to today's live catalog.
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Upward Trajectory</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
                  formatter={(val: any) => [`${val}/100`, 'Avg Quality']}
                />
                <Line
                  type="monotone"
                  dataKey="averageScore"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Historical Baseline: 61.2</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Current Live: {metrics.averageScore} / 100
            </span>
            <span>Target Goal: {settings.healthyThreshold}.0+</span>
          </div>
        </div>

        {/* Quality Health Overview & Donut Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Quality Health Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of SKUs based on current quality thresholds.
            </p>
          </div>

          <div className="my-4 flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="w-40 h-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Healthy', value: metrics.healthyCount, color: '#10b981' },
                      { name: 'Needs Review', value: metrics.needsReviewCount, color: '#f59e0b' },
                      { name: 'Critical', value: metrics.criticalCount, color: '#f43f5e' },
                    ]}
                    innerRadius={46}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#f43f5e" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                  {metrics.totalProducts}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Products</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between gap-6 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-300">Healthy (80+)</span>
                </div>
                <span className="font-bold tabular-nums text-emerald-800 dark:text-emerald-300">
                  {metrics.healthyCount} SKUs ({Math.round((metrics.healthyCount / (metrics.totalProducts || 1)) * 100)}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-6 p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-amber-900 dark:text-amber-300">Needs Review (50-79)</span>
                </div>
                <span className="font-bold tabular-nums text-amber-800 dark:text-amber-300">
                  {metrics.needsReviewCount} SKUs ({Math.round((metrics.needsReviewCount / (metrics.totalProducts || 1)) * 100)}%)
                </span>
              </div>

              <div className="flex items-center justify-between gap-6 p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-rose-900 dark:text-rose-300">Critical (&lt;50)</span>
                </div>
                <span className="font-bold tabular-nums text-rose-800 dark:text-rose-300">
                  {metrics.criticalCount} SKUs ({Math.round((metrics.criticalCount / (metrics.totalProducts || 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors text-center cursor-pointer"
          >
            Adjust score thresholds in Settings →
          </button>
        </div>
      </div>

      {/* Category Summary & Issue Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Quality Summary (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category Quality Summary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average completeness score and unresolved issue count per catalog category.
              </p>
            </div>
            <button
              onClick={() => navigate('/catalog')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-center">SKUs</th>
                  <th className="py-2.5">Avg Score</th>
                  <th className="py-2.5 text-center">Open Issues</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {metrics.categoryStats.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {cat.category}
                    </td>
                    <td className="py-3 text-center text-slate-500 dark:text-slate-400 font-mono">
                      {cat.count}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                          {cat.avgScore}
                        </span>
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
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
                    </td>
                    <td className="py-3 text-center font-mono">
                      {cat.issueCount > 0 ? (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px]">
                          {cat.issueCount}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">0</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge
                        status={
                          cat.avgScore >= settings.healthyThreshold
                            ? 'Healthy'
                            : cat.avgScore >= settings.needsReviewThreshold
                            ? 'Needs Review'
                            : 'Critical'
                        }
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Issue Distribution by Severity (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Issue Distribution by Severity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total active anomalies across all {metrics.totalProducts} catalog products.
            </p>
          </div>

          <div className="h-56 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Critical</span>
              <span className="text-base font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                {metrics.criticalIssuesCount} issues
              </span>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/60">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">High</span>
              <span className="text-base font-bold text-orange-700 dark:text-orange-400 tabular-nums">
                {metrics.highIssuesCount} issues
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Critical Issues Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Priority Catalog Action Items</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Highest severity issues blocking search indexation or conversion. Resolving them updates the SKU immediately.
            </p>
          </div>

          <button
            onClick={() => navigate('/issues')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Issues ({metrics.totalIssues})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentCriticalIssues.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-center text-xs text-emerald-800 dark:text-emerald-300">
            Great work! There are no critical or high severity issues in the catalog.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentCriticalIssues.map((issue) => (
              <div
                key={issue.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge severity={issue.severity} size="sm" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {issue.title}
                    </span>
                    <span className="text-[11px] text-slate-400">in {issue.field}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-1">
                    {issue.description}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Affected SKU: <span className="font-semibold text-slate-600 dark:text-slate-300">{issue.productName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => resolveIssueWithModal(issue)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>
                  <button
                    onClick={() => navigate(`/product/${issue.productId}`)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View Product"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
