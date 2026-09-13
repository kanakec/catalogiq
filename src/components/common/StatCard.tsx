import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  accentColor?: 'teal' | 'emerald' | 'amber' | 'rose' | 'indigo';
  onClick?: () => void;
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'teal',
  onClick,
  id,
}) => {
  const accentStyles = {
    teal: {
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border-teal-100 dark:border-teal-900/50',
      borderHover: 'hover:border-teal-300 dark:hover:border-teal-700',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
      borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
      borderHover: 'hover:border-rose-300 dark:hover:border-rose-700',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
      borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    },
  }[accentColor];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-all duration-200 ${
        onClick ? `cursor-pointer ${accentStyles.borderHover} hover:shadow-md` : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg border ${accentStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trend.isNeutral
                ? 'text-slate-500 dark:text-slate-400'
                : trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400 dark:text-slate-500">vs historical baseline</span>
        </div>
      )}
    </div>
  );
};
