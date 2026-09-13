import React from 'react';

interface QualityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showBar?: boolean;
  id?: string;
}

export const QualityScore: React.FC<QualityScoreProps> = ({
  score,
  size = 'md',
  showLabel = false,
  showBar = false,
  id,
}) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score || 0)));

  const getColorClasses = (val: number) => {
    if (val >= 80) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        border: 'border-emerald-200 dark:border-emerald-800',
        bar: 'bg-emerald-500',
        label: 'Healthy',
      };
    }
    if (val >= 50) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        border: 'border-amber-200 dark:border-amber-800',
        bar: 'bg-amber-500',
        label: 'Needs Review',
      };
    }
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      border: 'border-rose-200 dark:border-rose-800',
      bar: 'bg-rose-500',
      label: 'Critical',
    };
  };

  const colors = getColorClasses(safeScore);

  const badgeSizeClass = {
    sm: 'text-xs px-1.5 py-0.5 min-w-[34px] font-semibold',
    md: 'text-sm px-2 py-0.5 min-w-[42px] font-bold',
    lg: 'text-base px-3 py-1 min-w-[56px] font-extrabold',
    xl: 'text-2xl px-4 py-2 min-w-[76px] font-extrabold',
  }[size];

  return (
    <div id={id} className="inline-flex flex-col gap-1 items-start">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center justify-center rounded-md border tabular-nums text-center ${badgeSizeClass} ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {safeScore}
          <span className="text-[10px] font-normal opacity-60 ml-0.5">/100</span>
        </span>
        {showLabel && (
          <span className={`text-xs font-semibold ${colors.text}`}>
            {colors.label}
          </span>
        )}
      </div>

      {showBar && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
      )}
    </div>
  );
};
