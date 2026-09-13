import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { IssueCard } from '../components/issues/IssueCard';
import { EmptyState } from '../components/common/EmptyState';
import {
  AlertCircle,
  AlertTriangle,
  Filter,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export const Issues: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { metrics, products, settings } = useCatalog();
  const isDark = Boolean(settings?.darkMode);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>(
    searchParams.get('severity') || 'all'
  );
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>(
    searchParams.get('productId') || 'all'
  );

  // Extract unique issue types
  const issueTypes = useMemo(() => {
    const set = new Set<string>();
    metrics.allIssues.forEach((issue) => {
      if (issue.type) set.add(issue.type);
    });
    return Array.from(set).sort();
  }, [metrics.allIssues]);

  // Extract products with issues
  const productsWithIssues = useMemo(() => {
    return products
      .filter((p) => p.issues.length > 0)
      .map((p) => ({ id: p.id, title: p.title || p.sku }));
  }, [products]);

  // Filter issues
  const filteredIssues = useMemo(() => {
    return metrics.allIssues.filter((issue) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesDesc = issue.description.toLowerCase().includes(q);
        const matchesProd = (issue.productName || '').toLowerCase().includes(q);
        const matchesField = issue.field.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesProd && !matchesField) {
          return false;
        }
      }

      // Severity
      if (severityFilter !== 'all' && issue.severity !== severityFilter) {
        return false;
      }

      // Type
      if (typeFilter !== 'all' && issue.type !== typeFilter) {
        return false;
      }

      // Product
      if (productFilter !== 'all' && issue.productId !== productFilter) {
        return false;
      }

      return true;
    });
  }, [metrics.allIssues, searchQuery, severityFilter, typeFilter, productFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    severityFilter !== 'all' ||
    typeFilter !== 'all' ||
    productFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setTypeFilter('all');
    setProductFilter('all');
  };

  return (
    <div id="issues-page" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Issue Governance &amp; Remediation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resolve catalog defects by correcting underlying product fields to regenerate clean telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold text-amber-900 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{metrics.totalIssues} Active Catalog Anomalies</span>
        </div>
      </div>

      {/* Severity Ticker Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSeverityFilter('Critical')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'Critical'
              ? 'ring-2 ring-rose-500 bg-rose-50/70 dark:bg-rose-950/60 border-rose-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
            Critical
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5 block">
            {metrics.criticalIssuesCount}
          </span>
          <span className="text-[11px] text-slate-400">Blocks listings</span>
        </button>

        <button
          onClick={() => setSeverityFilter('High')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'High'
              ? 'ring-2 ring-orange-500 bg-orange-50/70 dark:bg-orange-950/60 border-orange-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
            High
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5 block">
            {metrics.highIssuesCount}
          </span>
          <span className="text-[11px] text-slate-400">Impacts search rank</span>
        </button>

        <button
          onClick={() => setSeverityFilter('Medium')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'Medium'
              ? 'ring-2 ring-amber-500 bg-amber-50/70 dark:bg-amber-950/60 border-amber-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Medium
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5 block">
            {metrics.mediumIssuesCount}
          </span>
          <span className="text-[11px] text-slate-400">Degrades trust</span>
        </button>

        <button
          onClick={() => setSeverityFilter('Low')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'Low'
              ? 'ring-2 ring-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-300'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Low
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5 block">
            {metrics.lowIssuesCount}
          </span>
          <span className="text-[11px] text-slate-400">Formatting &amp; tags</span>
        </button>
      </div>

      {/* Filter and Search Controller */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="issues-search-input"
              name="issues-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchQuery ? '' : 'Search issues by keyword, title, field, or product name...'}
              style={{
                color: isDark ? '#f8fafc' : '#0f172a',
                WebkitTextFillColor: isDark ? '#f8fafc' : '#0f172a',
                caretColor: isDark ? '#2dd4bf' : '#0f172a',
                opacity: 1,
                visibility: 'visible',
              }}
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-2xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Issue Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">All Issue Types</option>
            {issueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 cursor-pointer max-w-xs truncate"
          >
            <option value="all">All Affected Products</option>
            {productsWithIssues.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredIssues.length}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{metrics.totalIssues}</strong> issues
          </span>
          <span className="italic">
            Tip: Resolving an issue directly opens the product editor to fix the underlying data.
          </span>
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          title={metrics.totalIssues === 0 ? 'Catalog is Issue-Free!' : 'No Issues Match Current Filter'}
          description={
            metrics.totalIssues === 0
              ? 'Every product in the catalog satisfies the high-quality standards with zero detected anomalies.'
              : 'Try clearing your search query or selecting "All Severities" to view active issues.'
          }
          icon={CheckCircle2}
          actionText={hasActiveFilters ? 'Clear Filters' : undefined}
          onAction={resetFilters}
        />
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};
