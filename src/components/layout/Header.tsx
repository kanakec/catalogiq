import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  RotateCw,
  PlusCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { metrics, settings, updateSettings, recalculateCatalog } = useCatalog();

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Catalog Score Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Catalog Health:</span>
          <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
            {metrics.averageScore}/100
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {metrics.totalProducts} Products
          </span>
        </div>

        {/* Critical Issues Warning Pill if any */}
        {metrics.criticalIssuesCount > 0 && (
          <button
            onClick={() => navigate('/issues')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{metrics.criticalIssuesCount} Critical Issues</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Recalculate Catalog button */}
        <button
          id="recalculate-btn"
          onClick={recalculateCatalog}
          title="Recalculate all product scores and issues"
          className="p-2 rounded-lg text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Refresh catalog scores"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleDarkMode}
          title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
          className="p-2 rounded-lg text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {settings.darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Add Product / Analyze Action Button */}
        <button
          id="add-product-btn"
          onClick={() => navigate('/analyzer')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add / Analyze</span>
        </button>
      </div>
    </header>
  );
};
