import React from 'react';
import { ProductStatus, IssueSeverity } from '../../types';

interface StatusBadgeProps {
  status?: ProductStatus;
  severity?: IssueSeverity;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, severity, size = 'md', id }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size];

  if (status) {
    switch (status) {
      case 'Healthy':
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Healthy
          </span>
        );
      case 'Needs Review':
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Needs Review
          </span>
        );
      case 'Critical':
      default:
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60 ${sizeClasses}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical
          </span>
        );
    }
  }

  if (severity) {
    switch (severity) {
      case 'Critical':
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1 font-semibold rounded-full border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 ${sizeClasses}`}
          >
            Critical
          </span>
        );
      case 'High':
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1 font-semibold rounded-full border bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60 ${sizeClasses}`}
          >
            High
          </span>
        );
      case 'Medium':
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1 font-semibold rounded-full border bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 ${sizeClasses}`}
          >
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span
            id={id}
            className={`inline-flex items-center gap-1 font-semibold rounded-full border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${sizeClasses}`}
          >
            Low
          </span>
        );
    }
  }

  return null;
};
