import React, { useState, useRef } from 'react';
import { useCatalog } from '../context/CatalogContext';
import {
  Sliders,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetToSampleData, exportCatalogAsJson, importCatalogFromJson, openConfirmModal } = useCatalog();

  const [healthyThreshold, setHealthyThreshold] = useState(settings.healthyThreshold);
  const [needsReviewThreshold, setNeedsReviewThreshold] = useState(settings.needsReviewThreshold);
  const [thresholdError, setThresholdError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    if (healthyThreshold <= needsReviewThreshold) {
      setThresholdError('Healthy threshold must be strictly greater than Needs Review threshold.');
      return;
    }
    if (healthyThreshold > 100 || healthyThreshold < 1) {
      setThresholdError('Thresholds must be between 1 and 100.');
      return;
    }
    if (needsReviewThreshold < 0 || needsReviewThreshold > 99) {
      setThresholdError('Thresholds must be between 0 and 99.');
      return;
    }

    setThresholdError('');
    updateSettings({
      healthyThreshold,
      needsReviewThreshold,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetCatalog = () => {
    openConfirmModal({
      title: 'Reset Catalog to Default Sample Data?',
      message:
        'This will replace all your current custom products and restore the default 24 enterprise sample SKUs. This action cannot be undone.',
      confirmText: 'Reset to Sample Data',
      isDestructive: true,
      onConfirm: () => {
        resetToSampleData();
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importCatalogFromJson(content);
      }
    };
    reader.readAsText(file);
    // Reset file input so user can re-import same file if desired
    e.target.value = '';
  };

  return (
    <div id="settings-page" className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System Governance &amp; Catalog Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure quality classification rules, manage data backup archives, and calibrate catalog scoring thresholds.
        </p>
      </div>

      {/* Thresholds Calibration Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Quality Score Classification Thresholds
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Changes instantly trigger a full recalculation of all product statuses across the catalog.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-6">
          {thresholdError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{thresholdError}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Threshold settings saved! All product statuses have been re-calibrated.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Healthy Threshold */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-healthy-threshold"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Healthy Status Threshold</span>
                </label>
                <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {healthyThreshold} +
                </span>
              </div>

              <input
                id="input-healthy-threshold"
                type="range"
                min="60"
                max="95"
                step="1"
                value={healthyThreshold}
                onChange={(e) => setHealthyThreshold(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Default: 80. Products with scores at or above this value are certified as Healthy and customer-ready.
              </p>
            </div>

            {/* Needs Review Threshold */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-needs-review-threshold"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Needs Review Threshold</span>
                </label>
                <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                  {needsReviewThreshold} - {healthyThreshold - 1}
                </span>
              </div>

              <input
                id="input-needs-review-threshold"
                type="range"
                min="30"
                max="75"
                step="1"
                value={needsReviewThreshold}
                onChange={(e) => setNeedsReviewThreshold(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Default: 50. Products below this value are classified as Critical (&lt;{needsReviewThreshold}).
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply &amp; Recalculate Catalog</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Portability (Export / Import JSON) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Catalog Data Portability &amp; Backups
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export full product catalog state or restore previous snapshots from JSON files.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Export Catalog to JSON
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Download a clean, structured JSON file containing all products, attributes, specifications, and issues.
              </p>
            </div>

            <button
              type="button"
              onClick={exportCatalogAsJson}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Import Catalog from JSON
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload a valid JSON catalog export. All products will be automatically re-audited and scored.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Upload JSON Archive</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Sample Data */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Catalog Data Reset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore the original enterprise sample dataset with intentional anomalies for auditing practice.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-rose-800 dark:text-rose-300">
            Resetting clears custom products in localStorage and re-populates the 24 curated demonstration items.
          </p>

          <button
            type="button"
            onClick={handleResetCatalog}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default Sample SKUs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
