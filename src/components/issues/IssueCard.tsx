import React from 'react';
import { QualityIssue } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Wrench, ArrowRight, AlertCircle, FileText, Tag, Image, DollarSign, Layers } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { useNavigate } from 'react-router-dom';

interface IssueCardProps {
  issue: QualityIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const { resolveIssueWithModal } = useCatalog();
  const navigate = useNavigate();

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'title':
      case 'description':
        return <FileText className="w-4 h-4 text-slate-500" />;
      case 'brand':
      case 'category':
        return <Tag className="w-4 h-4 text-slate-500" />;
      case 'price':
        return <DollarSign className="w-4 h-4 text-slate-500" />;
      case 'images':
        return <Image className="w-4 h-4 text-slate-500" />;
      case 'specifications':
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      id={`issue-card-${issue.id}`}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <StatusBadge severity={issue.severity} size="sm" />

          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
            {getFieldIcon(issue.field)}
            <span className="capitalize">{issue.field}</span>
          </span>

          <span className="text-xs px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium">
            {issue.type}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          {issue.title}
        </h4>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          {issue.description}
        </p>

        {/* Product attribution */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-slate-400">Affected SKU:</span>
          <button
            onClick={() => navigate(`/product/${issue.productId}`)}
            className="font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer truncate max-w-xs"
          >
            {issue.productName || issue.productId}
          </button>
        </div>

        {/* Actionable recommendation */}
        <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
          <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">Fix recommendation: </span>
            {issue.recommendation}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="shrink-0 w-full md:w-auto flex md:flex-col items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <button
          id={`resolve-issue-btn-${issue.id}`}
          onClick={() => resolveIssueWithModal(issue)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Wrench className="w-4 h-4" />
          <span>Resolve Issue</span>
        </button>
        <span className="text-[10px] text-slate-400 text-right block w-full">
          Opens product editor
        </span>
      </div>
    </div>
  );
};
