import React from 'react';
import { ProductForm } from '../components/analyzer/ProductForm';

export const Analyzer: React.FC = () => {
  return (
    <div id="analyzer-page" className="max-w-7xl mx-auto">
      <ProductForm />
    </div>
  );
};
