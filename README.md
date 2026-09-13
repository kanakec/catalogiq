# CatalogIQ — E-Commerce Catalog Quality Platform

CatalogIQ is a React-based catalog quality management platform designed to help teams monitor, evaluate, and improve the quality of product listings.

The platform automatically evaluates product information, identifies catalog issues, provides quality scores, and presents actionable analytics through an enterprise-style dashboard.

## 🚀 Features

- Product catalog with search, filtering, sorting, and pagination
- Automated 100-point product quality scoring
- Product quality classification:
  - Healthy
  - Needs Review
  - Critical
- Automated issue detection for incomplete or low-quality product data
- Product editing and real-time quality-score recalculation
- Issue management with direct resolution workflow
- Catalog quality analytics and trend visualization
- Category-wise catalog health analysis
- Configurable quality-score thresholds
- JSON catalog backup and restore
- Persistent catalog state using browser local storage
- Responsive enterprise dashboard UI
- Reusable React components

## 🛠️ Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- React Hooks
- Local Storage
- Git & GitHub

## 📊 Quality Scoring

CatalogIQ evaluates products using multiple catalog attributes, including:

- Product title
- Description
- Brand
- Category
- Price
- Technical specifications
- Product images
- Search keywords

The resulting score is used to classify products and identify areas requiring attention.

## 🖥️ Core Modules

### Dashboard
Provides an overview of catalog health, quality scores, critical issues, and category performance.

### Product Catalog
Allows users to search, filter, sort, inspect, and edit catalog products.

### Product Analyzer
Evaluates product information and identifies quality gaps.

### Issues
Displays detected catalog defects and provides a workflow for resolving them.

### Analytics
Provides catalog completeness metrics, quality trends, defect analysis, and category-level insights.

### Settings
Allows administrators to configure quality thresholds and manage catalog backups.

## 📁 Project Structure

```text
src/
├── components/
├── context/
├── pages/
├── utils/
└── App.tsx
