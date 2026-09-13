import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';
import { EditProductModal } from './components/catalog/EditProductModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { Analyzer } from './pages/Analyzer';
import { ProductDetail } from './pages/ProductDetail';
import { CustomerPreview } from './pages/CustomerPreview';
import { Issues } from './pages/Issues';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

// Helper component to scroll to top on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Layout container
const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { confirmModal, closeConfirmModal } = useCatalog();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
      <ScrollToTop />

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <ConfirmModal modalState={confirmModal} onClose={closeConfirmModal} />
      <EditProductModal />

      {/* Responsive Navigation Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product/:id/preview" element={<CustomerPreview />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="py-6 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>CatalogIQ &bull; E-Commerce Catalog Quality Platform</span>
            <span>100-Point Audit Engine &bull; Enterprise Compliance Standard</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <AppLayout />
      </CatalogProvider>
    </BrowserRouter>
  );
}
