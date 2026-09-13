import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ScanSearch,
  AlertCircle,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { metrics, settings } = useCatalog();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/catalog',
      label: 'Product Catalog',
      icon: Boxes,
      badge: metrics.totalProducts > 0 ? metrics.totalProducts : null,
    },
    {
      to: '/analyzer',
      label: 'Product Analyzer',
      icon: ScanSearch,
      badge: null,
    },
    {
      to: '/issues',
      label: 'Issue Management',
      icon: AlertCircle,
      badge: metrics.totalIssues > 0 ? metrics.totalIssues : null,
      badgeVariant: metrics.criticalIssuesCount > 0 ? 'critical' : 'warning',
    },
    {
      to: '/analytics',
      label: 'Quality Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/settings',
      label: 'System Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Catalog<span className="text-teal-600 dark:text-teal-400">IQ</span>
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Quality Platform
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Catalog Governance
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 font-semibold border-l-2 border-teal-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    item.badgeVariant === 'critical'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : item.badgeVariant === 'warning'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Catalog Health Status Widget in Footer of Sidebar */}
        <div className="p-4 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            <span>Catalog Health</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold tabular-nums">
              {metrics.averageScore} / 100
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.averageScore >= settings.healthyThreshold
                  ? 'bg-emerald-500'
                  : metrics.averageScore >= settings.needsReviewThreshold
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${metrics.averageScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{metrics.healthyCount} Healthy</span>
            <span>{metrics.criticalCount} Critical</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>CatalogIQ v2.4</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Engine Online" />
        </div>
      </aside>
    </>
  );
};
