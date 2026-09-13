/**
 * CatalogIQ Quality Logic Engine
 * Enterprise product catalog quality evaluation and scoring engine.
 * Safely handles null, undefined, malformed values, empty structures, and defensive edge cases.
 */

export const MAX_POINTS = {
  TITLE: 15,
  DESCRIPTION: 20,
  BRAND: 10,
  CATEGORY: 10,
  PRICE: 10,
  SPECIFICATIONS: 20,
  IMAGES: 10,
  KEYWORDS: 5,
};

export const DEFAULT_THRESHOLDS = {
  HEALTHY: 80,
  NEEDS_REVIEW: 50,
};

/**
 * Determines product status based on score and user-configured thresholds.
 * @param {number} score 
 * @param {{ healthyThreshold?: number, needsReviewThreshold?: number }} thresholds 
 * @returns {'Healthy' | 'Needs Review' | 'Critical'}
 */
export function calculateStatus(score, thresholds = {}) {
  const healthyThreshold = typeof thresholds?.healthyThreshold === 'number' ? thresholds.healthyThreshold : DEFAULT_THRESHOLDS.HEALTHY;
  const needsReviewThreshold = typeof thresholds?.needsReviewThreshold === 'number' ? thresholds.needsReviewThreshold : DEFAULT_THRESHOLDS.NEEDS_REVIEW;

  if (score >= healthyThreshold) {
    return 'Healthy';
  } else if (score >= needsReviewThreshold) {
    return 'Needs Review';
  } else {
    return 'Critical';
  }
}

/**
 * Validates whether an image URL looks legitimate
 * @param {string} url 
 * @returns {boolean}
 */
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length < 8) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return trimmed.startsWith('/') || trimmed.startsWith('data:image/');
  }
}

/**
 * Evaluates the Title (Max: 15 pts)
 */
function evaluateTitle(title, productId, productName) {
  const safeTitle = typeof title === 'string' ? title.trim() : '';
  const issues = [];
  let score = 0;
  let feedback = '';

  if (!safeTitle) {
    score = 0;
    feedback = 'Missing title completely.';
    issues.push({
      id: `issue-${productId}-title-missing`,
      productId,
      productName,
      field: 'title',
      severity: 'Critical',
      type: 'Missing Attribute',
      title: 'Missing Product Title',
      description: 'The product does not have a title. A title is the most vital attribute for catalog indexing and buyer navigation.',
      recommendation: 'Add a clear, standard title formatted as: [Brand] + [Model/Series] + [Key Feature] + [Color/Size].',
    });
  } else if (safeTitle.length < 20) {
    score = 6;
    feedback = `Title is very brief (${safeTitle.length} chars). Recommend at least 30-80 chars.`;
    issues.push({
      id: `issue-${productId}-title-short`,
      productId,
      productName,
      field: 'title',
      severity: 'High',
      type: 'Content Quality',
      title: 'Title Too Short',
      description: `Current title is only ${safeTitle.length} characters long. Search algorithms and customers require more context.`,
      recommendation: 'Expand title with product line, material, key specification, and size/color attributes.',
    });
  } else if (safeTitle.length < 50) {
    score = 11;
    feedback = `Title length (${safeTitle.length} chars) is acceptable but could include more searchable attributes.`;
    issues.push({
      id: `issue-${productId}-title-medium`,
      productId,
      productName,
      field: 'title',
      severity: 'Low',
      type: 'Discoverability',
      title: 'Sub-optimal Title Length',
      description: 'The title is good but under 50 characters, potentially missing high-intent buyer search terms.',
      recommendation: 'Incorporate primary keywords and model numbers to boost search visibility.',
    });
  } else {
    // Check for excessive ALL CAPS
    const letters = safeTitle.replace(/[^a-zA-Z]/g, '');
    const upper = safeTitle.replace(/[^A-Z]/g, '');
    const isAllCaps = letters.length > 8 && (upper.length / letters.length) > 0.75;

    if (isAllCaps) {
      score = 12;
      feedback = 'Title is thorough but contains excessive ALL-CAPS styling.';
      issues.push({
        id: `issue-${productId}-title-caps`,
        productId,
        productName,
        field: 'title',
        severity: 'Low',
        type: 'Compliance',
        title: 'Excessive Capitalization in Title',
        description: 'Titles in all caps violate standard marketplace listing guidelines and look spammy to shoppers.',
        recommendation: 'Convert title to Title Case or Sentence case formatting.',
      });
    } else {
      score = MAX_POINTS.TITLE;
      feedback = 'Excellent title length and structure.';
    }
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Description (Max: 20 pts)
 */
function evaluateDescription(description, productId, productName) {
  const safeDesc = typeof description === 'string' ? description.trim() : '';
  const issues = [];
  let score = 0;
  let feedback = '';

  if (!safeDesc) {
    score = 0;
    feedback = 'Missing product description.';
    issues.push({
      id: `issue-${productId}-desc-missing`,
      productId,
      productName,
      field: 'description',
      severity: 'Critical',
      type: 'Missing Attribute',
      title: 'Missing Product Description',
      description: 'The product has no description. Listings without descriptions fail conversion checks and increase bounce rates.',
      recommendation: 'Provide an engaging 2-4 paragraph overview detailing product utility, construction, and value proposition.',
    });
  } else if (safeDesc.length < 60) {
    score = 6;
    feedback = `Description is too short (${safeDesc.length} chars). Under 60 characters provides little customer assurance.`;
    issues.push({
      id: `issue-${productId}-desc-short`,
      productId,
      productName,
      field: 'description',
      severity: 'High',
      type: 'Content Quality',
      title: 'Insufficient Product Description',
      description: `Current description is only ${safeDesc.length} characters long. Missing key benefits and usage details.`,
      recommendation: 'Elaborate on features, design considerations, what is included in the box, and warranty details.',
    });
  } else if (safeDesc.length < 150) {
    score = 14;
    feedback = `Description is moderate (${safeDesc.length} chars). Recommend 150+ chars for comprehensive coverage.`;
    issues.push({
      id: `issue-${productId}-desc-moderate`,
      productId,
      productName,
      field: 'description',
      severity: 'Medium',
      type: 'Content Quality',
      title: 'Brief Product Description',
      description: 'The description is readable but could provide deeper context to answer customer questions before purchasing.',
      recommendation: 'Add bullet points highlighting compatibility, materials, and care instructions.',
    });
  } else {
    score = MAX_POINTS.DESCRIPTION;
    feedback = 'Comprehensive, customer-ready description.';
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Brand (Max: 10 pts)
 */
function evaluateBrand(brand, productId, productName) {
  const safeBrand = typeof brand === 'string' ? brand.trim() : '';
  const issues = [];
  let score = 0;
  let feedback = '';

  const invalidBrands = ['generic', 'unbranded', 'n/a', 'na', 'unknown', 'none', 'placeholder'];

  if (!safeBrand) {
    score = 0;
    feedback = 'Brand attribute is empty.';
    issues.push({
      id: `issue-${productId}-brand-missing`,
      productId,
      productName,
      field: 'brand',
      severity: 'High',
      type: 'Missing Attribute',
      title: 'Missing Brand Name',
      description: 'Product brand is missing. Brand filtering is one of the top faceted search methods for e-commerce buyers.',
      recommendation: 'Assign the official manufacturer or private label brand name.',
    });
  } else if (invalidBrands.includes(safeBrand.toLowerCase())) {
    score = 3;
    feedback = `Generic or placeholder brand name ("${safeBrand}").`;
    issues.push({
      id: `issue-${productId}-brand-generic`,
      productId,
      productName,
      field: 'brand',
      severity: 'Medium',
      type: 'Data Integrity',
      title: 'Generic Brand Designation',
      description: `The brand "${safeBrand}" is flagged as generic or unverified. This degrades catalog trust.`,
      recommendation: 'Replace generic placeholders with the verified registered trademark or manufacturer name.',
    });
  } else {
    score = MAX_POINTS.BRAND;
    feedback = `Valid brand attribution: ${safeBrand}.`;
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Category (Max: 10 pts)
 */
function evaluateCategory(category, productId, productName) {
  const safeCategory = typeof category === 'string' ? category.trim() : '';
  const issues = [];
  let score = 0;
  let feedback = '';

  const invalidCategories = ['uncategorized', 'other', 'general', 'misc', 'miscellaneous', 'default', 'n/a'];

  if (!safeCategory) {
    score = 0;
    feedback = 'Product category is missing.';
    issues.push({
      id: `issue-${productId}-cat-missing`,
      productId,
      productName,
      field: 'category',
      severity: 'High',
      type: 'Missing Attribute',
      title: 'Unassigned Category',
      description: 'Category taxonomy node is missing. Products without categories cannot be found via category browse trees.',
      recommendation: 'Assign the product to a specific standard catalog category (e.g., Electronics, Fashion, Home).',
    });
  } else if (invalidCategories.includes(safeCategory.toLowerCase())) {
    score = 4;
    feedback = `Broad/uncategorized taxonomy node ("${safeCategory}").`;
    issues.push({
      id: `issue-${productId}-cat-vague`,
      productId,
      productName,
      field: 'category',
      severity: 'Medium',
      type: 'Data Integrity',
      title: 'Vague Category Mapping',
      description: `Category is set to "${safeCategory}". Vague categorization hurts search ranking and faceted navigation.`,
      recommendation: 'Re-map this SKU to a leaf or standard category node.',
    });
  } else {
    score = MAX_POINTS.CATEGORY;
    feedback = `Correctly mapped to ${safeCategory}.`;
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Price (Max: 10 pts)
 */
function evaluatePrice(price, productId, productName) {
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  const issues = [];
  let score = 0;
  let feedback = '';

  if (price === null || price === undefined || price === '' || isNaN(numPrice)) {
    score = 0;
    feedback = 'Price is missing or not a valid number.';
    issues.push({
      id: `issue-${productId}-price-missing`,
      productId,
      productName,
      field: 'price',
      severity: 'Critical',
      type: 'Data Integrity',
      title: 'Invalid or Missing Price',
      description: 'Price is missing or invalid. Items without valid pricing cannot be listed or added to shopping carts.',
      recommendation: 'Specify a valid numeric price greater than $0.00.',
    });
  } else if (numPrice <= 0) {
    score = 0;
    feedback = `Price is $${numPrice.toFixed(2)} (must be greater than 0).`;
    issues.push({
      id: `issue-${productId}-price-zero`,
      productId,
      productName,
      field: 'price',
      severity: 'Critical',
      type: 'Data Integrity',
      title: 'Zero or Negative Price',
      description: `Price is entered as $${numPrice.toFixed(2)}. Zero-dollar listings pose severe revenue risk.`,
      recommendation: 'Update price to accurate retail selling value.',
    });
  } else if (numPrice > 50000) {
    score = 6;
    feedback = `Unusually high price flag ($${numPrice.toLocaleString()}).`;
    issues.push({
      id: `issue-${productId}-price-high`,
      productId,
      productName,
      field: 'price',
      severity: 'Low',
      type: 'Compliance',
      title: 'High Price Anomaly',
      description: `Price exceeds $50,000. Verify that this is not a decimal or currency misplacement error.`,
      recommendation: 'Confirm high price or correct decimal formatting.',
    });
  } else {
    score = MAX_POINTS.PRICE;
    feedback = `Valid retail price: $${numPrice.toFixed(2)}.`;
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Specifications (Max: 20 pts)
 */
function evaluateSpecifications(specifications, productId, productName) {
  const issues = [];
  let score = 0;
  let feedback = '';

  let validSpecsCount = 0;

  if (Array.isArray(specifications)) {
    validSpecsCount = specifications.filter(
      (s) => s && typeof s.key === 'string' && s.key.trim() && typeof s.value === 'string' && s.value.trim()
    ).length;
  } else if (specifications && typeof specifications === 'object') {
    validSpecsCount = Object.entries(specifications).filter(
      ([k, v]) => k && k.trim() && v !== null && v !== undefined && String(v).trim()
    ).length;
  }

  if (validSpecsCount === 0) {
    score = 0;
    feedback = 'Missing technical specifications.';
    issues.push({
      id: `issue-${productId}-spec-missing`,
      productId,
      productName,
      field: 'specifications',
      severity: 'High',
      type: 'Missing Attribute',
      title: 'Missing Technical Specifications',
      description: 'No technical specifications provided. Buyers rely on specifications to confirm product compatibility and dimensions.',
      recommendation: 'Add key specifications such as Material, Dimensions, Weight, Model Number, and Warranty.',
    });
  } else if (validSpecsCount < 3) {
    score = 10;
    feedback = `Limited specifications (${validSpecsCount} provided). Recommended at least 3-5 specs.`;
    issues.push({
      id: `issue-${productId}-spec-few`,
      productId,
      productName,
      field: 'specifications',
      severity: 'Medium',
      type: 'Content Quality',
      title: 'Sparse Technical Specifications',
      description: `Only ${validSpecsCount} specification item(s) found. Incomplete specs result in higher customer return rates.`,
      recommendation: 'Add at least 3 distinct specifications to give customers confidence.',
    });
  } else {
    score = MAX_POINTS.SPECIFICATIONS;
    feedback = `Well-specified product (${validSpecsCount} specifications provided).`;
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Images (Max: 10 pts)
 */
function evaluateImages(imageUrl, additionalImages, productId, productName) {
  const issues = [];
  let score = 0;
  let feedback = '';

  const hasMainImage = isValidImageUrl(imageUrl);
  const addlCount = Array.isArray(additionalImages)
    ? additionalImages.filter((img) => isValidImageUrl(img)).length
    : 0;

  if (!imageUrl || !imageUrl.trim()) {
    score = 0;
    feedback = 'Missing primary product image.';
    issues.push({
      id: `issue-${productId}-img-missing`,
      productId,
      productName,
      field: 'images',
      severity: 'Critical',
      type: 'Missing Attribute',
      title: 'Missing Main Product Image',
      description: 'Product has no primary image URL. Image-less products cannot be merchandised and are hidden from most storefront views.',
      recommendation: 'Provide a high-resolution primary image URL (PNG/JPG/WebP, minimum 1000x1000px).',
    });
  } else if (!hasMainImage) {
    score = 4;
    feedback = 'Main image URL format appears invalid or insecure.';
    issues.push({
      id: `issue-${productId}-img-invalid`,
      productId,
      productName,
      field: 'images',
      severity: 'High',
      type: 'Data Integrity',
      title: 'Malformed Image URL',
      description: 'The primary image URL is not a valid accessible web address.',
      recommendation: 'Ensure image URL begins with https:// and points to a hosted image asset.',
    });
  } else if (addlCount === 0) {
    score = 7;
    feedback = 'Primary image present, but no secondary/gallery images.';
    issues.push({
      id: `issue-${productId}-img-single`,
      productId,
      productName,
      field: 'images',
      severity: 'Low',
      type: 'Discoverability',
      title: 'Single Product Image Only',
      description: 'Only 1 image provided. Listings with 3+ images experience up to 40% higher conversion rates.',
      recommendation: 'Add 2 or more supplementary lifestyle or detail angle shots in the gallery.',
    });
  } else {
    score = MAX_POINTS.IMAGES;
    feedback = `High quality image gallery (${1 + addlCount} total images).`;
  }

  return { score, feedback, issues };
}

/**
 * Evaluates Keywords (Max: 5 pts)
 */
function evaluateKeywords(keywords, productId, productName) {
  const issues = [];
  let score = 0;
  let feedback = '';

  let validKeywords = [];
  if (Array.isArray(keywords)) {
    validKeywords = keywords.filter((k) => typeof k === 'string' && k.trim());
  } else if (typeof keywords === 'string') {
    validKeywords = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }

  if (validKeywords.length === 0) {
    score = 0;
    feedback = 'No search keywords or tags provided.';
    issues.push({
      id: `issue-${productId}-kw-missing`,
      productId,
      productName,
      field: 'keywords',
      severity: 'Low',
      type: 'Discoverability',
      title: 'Missing Search Keywords',
      description: 'Product has no indexing keywords. Keywords ensure products appear for customer synonym searches.',
      recommendation: 'Add 4 to 8 search keywords separated by commas.',
    });
  } else if (validKeywords.length < 3) {
    score = 3;
    feedback = `Few keywords (${validKeywords.length} tags). Recommended 3-8 keywords.`;
    issues.push({
      id: `issue-${productId}-kw-few`,
      productId,
      productName,
      field: 'keywords',
      severity: 'Low',
      type: 'Discoverability',
      title: 'Limited Keyword Coverage',
      description: `Only ${validKeywords.length} keyword(s) defined. Additional tags help capture long-tail search intent.`,
      recommendation: 'Add common customer search queries, material tags, or usage context.',
    });
  } else {
    score = MAX_POINTS.KEYWORDS;
    feedback = `Rich keyword coverage (${validKeywords.length} tags defined).`;
  }

  return { score, feedback, issues };
}

/**
 * Master Product Quality Calculation Function
 * Computes the score out of 100, assigns status, constructs breakdown, and generates issues.
 * @param {object} product - Raw or partial product object
 * @param {object} thresholds - { healthyThreshold, needsReviewThreshold }
 * @returns {object} { score, status, breakdown, issues, recommendations }
 */
export function calculateProductQuality(product, thresholds = {}) {
  // Safe defensive extraction
  const safeProduct = product || {};
  const productId = safeProduct.id ? String(safeProduct.id) : `temp-${Date.now()}`;
  const productName = safeProduct.title ? String(safeProduct.title) : 'Untitled Product';

  const titleEval = evaluateTitle(safeProduct.title, productId, productName);
  const descEval = evaluateDescription(safeProduct.description, productId, productName);
  const brandEval = evaluateBrand(safeProduct.brand, productId, productName);
  const catEval = evaluateCategory(safeProduct.category, productId, productName);
  const priceEval = evaluatePrice(safeProduct.price, productId, productName);
  const specEval = evaluateSpecifications(safeProduct.specifications, productId, productName);
  const imgEval = evaluateImages(safeProduct.imageUrl, safeProduct.additionalImages, productId, productName);
  const kwEval = evaluateKeywords(safeProduct.keywords, productId, productName);

  const totalScore = Math.min(
    100,
    Math.max(
      0,
      titleEval.score +
        descEval.score +
        brandEval.score +
        catEval.score +
        priceEval.score +
        specEval.score +
        imgEval.score +
        kwEval.score
    )
  );

  const status = calculateStatus(totalScore, thresholds);

  const breakdown = {
    title: { score: titleEval.score, max: MAX_POINTS.TITLE, feedback: titleEval.feedback },
    description: { score: descEval.score, max: MAX_POINTS.DESCRIPTION, feedback: descEval.feedback },
    brand: { score: brandEval.score, max: MAX_POINTS.BRAND, feedback: brandEval.feedback },
    category: { score: catEval.score, max: MAX_POINTS.CATEGORY, feedback: catEval.feedback },
    price: { score: priceEval.score, max: MAX_POINTS.PRICE, feedback: priceEval.feedback },
    specifications: { score: specEval.score, max: MAX_POINTS.SPECIFICATIONS, feedback: specEval.feedback },
    images: { score: imgEval.score, max: MAX_POINTS.IMAGES, feedback: imgEval.feedback },
    keywords: { score: kwEval.score, max: MAX_POINTS.KEYWORDS, feedback: kwEval.feedback },
  };

  const issues = [
    ...titleEval.issues,
    ...descEval.issues,
    ...brandEval.issues,
    ...catEval.issues,
    ...priceEval.issues,
    ...specEval.issues,
    ...imgEval.issues,
    ...kwEval.issues,
  ];

  // Extract actionable recommendations
  const recommendations = issues.map((issue) => issue.recommendation);
  if (recommendations.length === 0) {
    recommendations.push('Listing meets high-quality catalog standards! Keep specifications and images updated regularly.');
  }

  return {
    score: totalScore,
    status,
    breakdown,
    issues,
    recommendations,
  };
}
