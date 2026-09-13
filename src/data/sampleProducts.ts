import { Product } from '../types';
import { calculateProductQuality } from '../utils/qualityLogic.js';

interface RawSampleProduct {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  keywords: string[];
  specifications: { key: string; value: string }[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_RAW_PRODUCTS: RawSampleProduct[] = [
  // 1. Electronics - High Quality
  {
    id: 'prod-001',
    sku: 'ELEC-WH1000-XM5',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones with Auto NC Optimizer and 30-Hour Battery Life',
    brand: 'Sony',
    category: 'Electronics',
    price: 398.0,
    description: 'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. Newly developed driver with carbon fiber composite material lightweight dome elevates high-frequency sensitivity for more natural sound quality.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['headphones', 'noise canceling', 'wireless', 'bluetooth', 'sony audio', 'over-ear'],
    specifications: [
      { key: 'Connectivity', value: 'Bluetooth 5.2 / 3.5mm AUX' },
      { key: 'Battery Life', value: 'Up to 30 hours' },
      { key: 'Weight', value: '250 grams' },
      { key: 'Driver Unit', value: '30mm, Carbon Fiber Dome' },
      { key: 'Fast Charging', value: '3 mins = 3 hours playback' },
    ],
    rating: 4.8,
    reviewCount: 4210,
    stock: 142,
  },

  // 2. Electronics - Incomplete: Missing Brand, Short Title, No Specs
  {
    id: 'prod-002',
    sku: 'ELEC-USB-C-65W',
    title: 'USB C Charger',
    brand: '', // Missing brand intentional
    category: 'Electronics',
    price: 24.99,
    description: 'Wall plug charger for fast charging phones and laptops.',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['charger', 'usb-c'],
    specifications: [], // Missing specifications intentional
    rating: 3.9,
    reviewCount: 45,
    stock: 890,
  },

  // 3. Electronics - Needs Review: Missing Image, Zero Price anomaly
  {
    id: 'prod-003',
    sku: 'ELEC-4K-WEBCAM-PRO',
    title: 'Ultra HD 4K Pro Streaming Webcam with Dual Noise Reduction Microphones and Privacy Shutter',
    brand: 'Logitech',
    category: 'Electronics',
    price: 0.0, // Zero price intentional
    description: 'Step up to the world’s most technologically advanced webcam and get professional-quality video for conference calls, streaming, or recording. Packed with features that produce stunning video in any environment, including 4K Ultra HD and 5x digital zoom.',
    imageUrl: '', // Missing image intentional
    additionalImages: [],
    keywords: ['webcam', '4k streaming', 'video conference', 'logitech', 'usb camera'],
    specifications: [
      { key: 'Resolution', value: '4K/30fps, 1080p/60fps' },
      { key: 'Field of View', value: '90 / 78 / 65 degrees' },
      { key: 'Focus Type', value: 'Autofocus' },
    ],
    rating: 4.5,
    reviewCount: 312,
    stock: 58,
  },

  // 4. Electronics - Healthy
  {
    id: 'prod-004',
    sku: 'ELEC-KBD-MECH-RGB',
    title: 'Keychron Q1 Pro Custom Mechanical Keyboard Wireless RGB Hot-Swappable Aluminum Body QMK/VIA',
    brand: 'Keychron',
    category: 'Electronics',
    price: 199.99,
    description: 'The Keychron Q1 Pro is an all-metal wireless custom mechanical keyboard supporting QMK/VIA. Along with our signature double-gasket mount design and CNC aluminum body, it delivers a refined typing sensation and full customizability across Mac, Windows, and Linux.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['mechanical keyboard', 'keychron', 'hot-swappable', 'wireless', 'custom typing', 'tenkeyless'],
    specifications: [
      { key: 'Body Material', value: 'Full CNC machined 6063 Aluminum' },
      { key: 'Layout', value: '75% (81 keys)' },
      { key: 'Switches', value: 'Keychron K Pro Red (Lubed)' },
      { key: 'Polling Rate', value: '1000 Hz (Wired) / 90 Hz (Bluetooth)' },
    ],
    rating: 4.9,
    reviewCount: 680,
    stock: 75,
  },

  // 5. Fashion - Healthy
  {
    id: 'prod-005',
    sku: 'FASH-MERINO-SWTR-M',
    title: 'Everlane The Grade-A Cashmere Crewneck Sweater in Heather Charcoal with Ribbed Cuffs',
    brand: 'Everlane',
    category: 'Fashion',
    price: 148.0,
    description: 'Crafted from ultra-soft certified Grade-A Mongolian cashmere, this classic crewneck sweater offers lightweight warmth without the bulk. Designed with a clean relaxed fit, reinforced ribbed collar, and timeless styling that layers seamlessly under blazers or coats.',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['cashmere sweater', 'everlane', 'crewneck', 'mens knitwear', 'winter luxury', 'ethical wool'],
    specifications: [
      { key: 'Material', value: '100% Grade-A Mongolian Cashmere' },
      { key: 'Fit', value: 'Regular / Relaxed' },
      { key: 'Care', value: 'Dry clean or hand wash cold, dry flat' },
      { key: 'Origin', value: 'Ethically spun in Ulaanbaatar, Mongolia' },
    ],
    rating: 4.7,
    reviewCount: 520,
    stock: 94,
  },

  // 6. Fashion - Incomplete: Missing Description & Generic Brand
  {
    id: 'prod-006',
    sku: 'FASH-DENIM-JEAN-01',
    title: 'Blue Mens Slim Jeans Stretch Fabric Casual Daily Wear',
    brand: 'Generic', // Generic brand intentional
    category: 'Fashion',
    price: 39.99,
    description: '', // Missing description intentional
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['jeans', 'denim'],
    specifications: [
      { key: 'Fabric', value: 'Cotton Blend' },
    ],
    rating: 3.5,
    reviewCount: 18,
    stock: 310,
  },

  // 7. Fashion - Healthy
  {
    id: 'prod-007',
    sku: 'FASH-COAT-WTRPRF-F',
    title: 'Patagonia Torrentshell 3L Waterproof Rain Jacket H2No Performance Standard Packable Hood',
    brand: 'Patagonia',
    category: 'Fashion',
    price: 179.0,
    description: 'Simple and unpretentious, our trusted Torrentshell 3L Jacket uses 3-layer H2No Performance Standard technology and a PFC-free DWR finish for exceptional waterproof/breathable performance, all-day comfort and long-lasting waterproof durability. Fair Trade Certified sewn.',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['patagonia', 'rain jacket', 'waterproof', 'h2no', 'outerwear', 'sustainable jacket', 'windbreaker'],
    specifications: [
      { key: 'Membrane', value: '3-layer H2No Performance Standard shell' },
      { key: 'Face Fabric', value: '100% recycled Econyl nylon ripstop' },
      { key: 'Weight', value: '394g (13.9 oz)' },
      { key: 'Certification', value: 'Bluesign approved fabric, Fair Trade' },
    ],
    rating: 4.9,
    reviewCount: 1140,
    stock: 63,
  },

  // 8. Home & Kitchen - Healthy
  {
    id: 'prod-008',
    sku: 'HOME-ESPRSO-PRO-9',
    title: 'Breville Barista Touch Impress Espresso Machine with Assisted Tamping and Automatic Milk Frothing',
    brand: 'Breville',
    category: 'Home & Kitchen',
    price: 1499.95,
    description: 'Create third-wave specialty coffee at home with ease. The Barista Touch Impress features real-time feedback with step-by-step barista guidance, assisted manual tamping with a 7-degree barista twist, and precision digital temperature control (PID) to extract espresso at optimal temperatures.',
    imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['espresso machine', 'breville', 'barista touch', 'coffee maker', 'latte art', 'grinder'],
    specifications: [
      { key: 'Pump Pressure', value: '15 Bar Italian Pump' },
      { key: 'Heating System', value: 'ThermoJet heating system (3 sec heat up)' },
      { key: 'Water Tank', value: '67 fl oz (2L)' },
      { key: 'Portafilter', value: '54mm Stainless Steel with dual/single wall filters' },
      { key: 'Warranty', value: '2-Year Limited Manufacturer Warranty' },
    ],
    rating: 4.8,
    reviewCount: 924,
    stock: 28,
  },

  // 9. Home & Kitchen - Incomplete: Missing Category & Few Keywords
  {
    id: 'prod-009',
    sku: 'HOME-KNIFE-CHEF-8',
    title: 'Wusthof Classic 8-Inch Chef’s Knife High Carbon Stainless Steel Full Tang Triple Riveted',
    brand: 'Wusthof',
    category: '', // Missing category intentional
    price: 170.0,
    description: 'The Wusthof Classic 8-inch chef’s knife is the workhorse of the kitchen. Perfectly balanced, forged from a single piece of high-carbon stain-free steel, it chops, slices, and dices with precision.',
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: [], // Missing keywords intentional
    specifications: [
      { key: 'Blade Length', value: '8 Inches (20cm)' },
      { key: 'Material', value: 'X50CrMoV15 High-Carbon German Steel' },
    ],
    rating: 4.9,
    reviewCount: 1650,
    stock: 110,
  },

  // 10. Home & Kitchen - Incomplete: Missing specs, brief title
  {
    id: 'prod-010',
    sku: 'HOME-FRYPAN-NONSTK',
    title: 'Nonstick Frying Pan',
    brand: 'T-fal',
    category: 'Home & Kitchen',
    price: 29.99,
    description: 'Everyday nonstick skillet with Thermo-Spot heat indicator. Even heat base and dishwasher safe.',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['pan', 'skillet'],
    specifications: [], // Missing specifications intentional
    rating: 4.1,
    reviewCount: 340,
    stock: 450,
  },

  // 11. Sports - Healthy
  {
    id: 'prod-011',
    sku: 'SPRT-GARMIN-FORERUN',
    title: 'Garmin Forerunner 965 Premium GPS Running Smartwatch with Vibrant AMOLED Touchscreen Display',
    brand: 'Garmin',
    category: 'Sports',
    price: 599.99,
    description: 'Run with purpose using the Garmin Forerunner 965. Features a brilliant 1.4-inch AMOLED display with traditional button controls, lightweight titanium bezel, multi-band GPS with SatIQ technology, and full-color built-in mapping to keep you on track through the longest ultras.',
    imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['garmin', 'running watch', 'gps', 'triathlon', 'heart rate', 'amoled smartwatch', 'fitness tracker'],
    specifications: [
      { key: 'Display Size', value: '1.4" AMOLED (454 x 454 pixels)' },
      { key: 'Battery Life', value: 'Up to 23 days (smartwatch mode) / 31 hours (GPS)' },
      { key: 'Water Rating', value: '5 ATM (50 meters)' },
      { key: 'Bezel Material', value: 'Titanium' },
      { key: 'Sensors', value: 'Wrist HR, Pulse Ox, Compass, Barometric Altimeter' },
    ],
    rating: 4.8,
    reviewCount: 780,
    stock: 42,
  },

  // 12. Sports - Critical: Missing Title, Missing Brand, Malformed Price
  {
    id: 'prod-012',
    sku: 'SPRT-DUMBELL-SET-ERR',
    title: '', // Missing title intentional
    brand: '', // Missing brand intentional
    category: 'Sports',
    price: -15.0, // Negative price intentional
    description: 'Iron weights for gym workouts.',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['weights', 'gym'],
    specifications: [],
    rating: 2.1,
    reviewCount: 6,
    stock: 12,
  },

  // 13. Sports - Healthy
  {
    id: 'prod-013',
    sku: 'SPRT-YOGA-MAT-ECO',
    title: 'Manduka PRO Yoga Mat 6mm High-Density Cushioning Non-Slip Textured Surface Lifetime Guarantee',
    brand: 'Manduka',
    category: 'Sports',
    price: 138.0,
    description: 'An ultra-dense and spacious performance yoga mat that has unmatched comfort and cushioning. The Manduka PRO will never wear out, guaranteed. Closed-cell material seals out moisture and bacteria, while the proprietary dot pattern prevents slipping on wood or studio floors.',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['yoga mat', 'manduka pro', 'pilates', 'thick workout mat', 'non-slip', 'eco-certified'],
    specifications: [
      { key: 'Thickness', value: '6mm (0.24 inches)' },
      { key: 'Dimensions', value: '71" x 26" (180cm x 66cm)' },
      { key: 'Weight', value: '7.5 lbs' },
      { key: 'Sustainability', value: 'OEKO-TEX certified, emission-free manufacturing' },
    ],
    rating: 4.9,
    reviewCount: 2310,
    stock: 85,
  },

  // 14. Beauty - Healthy
  {
    id: 'prod-014',
    sku: 'BEAU-SERUM-VITC-30',
    title: 'SkinCeuticals C E Ferulic Combination Antioxidant Treatment Serum 15% Pure Vitamin C 30ml',
    brand: 'SkinCeuticals',
    category: 'Beauty',
    price: 182.0,
    description: 'A patented daytime vitamin C serum that delivers advanced environmental protection and improves the appearance of fine lines and wrinkles, loss of firmness, and brightens skin’s complexion. Now clinically proven to reduce combined oxidative damage from free radicals generated by UV, ozone, and diesel exhaust by up to 41%.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['vitamin c serum', 'skinceuticals', 'antioxidant', 'anti-aging', 'dermatologist recommended', 'ferulic acid'],
    specifications: [
      { key: 'Key Ingredients', value: '15% L-Ascorbic Acid, 1% Alpha Tocopherol, 0.5% Ferulic Acid' },
      { key: 'Volume', value: '30 ml / 1.0 fl oz' },
      { key: 'Skin Type', value: 'Dry, Normal, Combination, Sensitive' },
      { key: 'Formulation', value: 'Fast-absorbing serum, fragrance-free' },
    ],
    rating: 4.8,
    reviewCount: 3150,
    stock: 67,
  },

  // 15. Beauty - Incomplete: Missing Image & Brief Description
  {
    id: 'prod-015',
    sku: 'BEAU-LIP-BALM-NAT',
    title: 'Organic Beeswax Peppermint Moisturizing Lip Balm Twin Pack',
    brand: 'Burt’s Bees',
    category: 'Beauty',
    price: 9.99,
    description: 'Natural lip balm made with beeswax.', // Short description intentional
    imageUrl: '', // Missing image intentional
    additionalImages: [],
    keywords: ['lip balm', 'beeswax'],
    specifications: [
      { key: 'Flavor', value: 'Peppermint' },
    ],
    rating: 4.6,
    reviewCount: 890,
    stock: 540,
  },

  // 16. Beauty - Healthy
  {
    id: 'prod-016',
    sku: 'BEAU-DYSON-AIRWRAP',
    title: 'Dyson Airwrap Multi-Styler Complete Long for Multiple Hair Types with Coanda Smoothing Dryer',
    brand: 'Dyson',
    category: 'Beauty',
    price: 599.99,
    description: 'Curl, shape, smooth, and hide flyaways with no extreme heat. Re-engineered attachments harness Enhanced Coanda airflow for faster, better, and easier styling. Includes 1.2" and 1.6" barrels, firm and soft smoothing brushes, round volumizing brush, and presentation storage case.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['dyson airwrap', 'hair styler', 'curling iron', 'no heat damage', 'blowout brush', 'dyson hair'],
    specifications: [
      { key: 'Power', value: '1300 Watts' },
      { key: 'Airflow', value: '13.5 liters/second' },
      { key: 'Heat Settings', value: '3 precise heat settings + Cold Shot' },
      { key: 'Cable Length', value: '8.5 feet (2.6m)' },
      { key: 'Attachments', value: '6 styling tools + storage case' },
    ],
    rating: 4.7,
    reviewCount: 4200,
    stock: 31,
  },

  // 17. Accessories - Healthy
  {
    id: 'prod-017',
    sku: 'ACC-BELLROY-SLIM',
    title: 'Bellroy Hide & Seek Premium Leather RFID-Blocking Slim Bifold Wallet with Hidden Coin Pouch',
    brand: 'Bellroy',
    category: 'Accessories',
    price: 89.0,
    description: 'An understated classic for men who want more out of their wallet while keeping their silhouette slim. Holds 5–12+ cards, flat bills, and features a hidden bill section with a discrete flap to conceal large notes and emergency business cards. Crafted from environmentally certified leather.',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['leather wallet', 'bellroy', 'rfid blocking', 'slim bifold', 'mens accessories', 'minimalist wallet'],
    specifications: [
      { key: 'Capacity', value: '5-12 cards + flat bills' },
      { key: 'Dimensions', value: '115mm x 95mm (4.5" x 3.7")' },
      { key: 'Leather Type', value: 'Premium LWG Gold-rated tanned leather' },
      { key: 'Security', value: 'RFID protective lining' },
      { key: 'Warranty', value: '3-Year Bellroy Warranty' },
    ],
    rating: 4.8,
    reviewCount: 1480,
    stock: 120,
  },

  // 18. Accessories - Incomplete: All Caps Title, Missing Specs, Few Keywords
  {
    id: 'prod-018',
    sku: 'ACC-SUNGLASS-POLAR',
    title: 'AVIATOR SUNGLASSES POLARIZED UV400 PROTECTION VINTAGE METAL FRAME MEN WOMEN',
    brand: 'Ray-Ban',
    category: 'Accessories',
    price: 163.0,
    description: 'Timeless aviator sunglasses designed for pilots in 1937. Metal frame with crystal green lenses and 100% UV protection for glare reduction.',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['sunglasses'],
    specifications: [], // Missing specifications intentional
    rating: 4.4,
    reviewCount: 950,
    stock: 74,
  },

  // 19. Accessories - Needs Review: Missing Brand & Missing Description
  {
    id: 'prod-019',
    sku: 'ACC-CANVAS-TOTE-ECO',
    title: 'Heavy Duty Organic Cotton Canvas Tote Bag Reinforced Handles Eco Friendly Grocery Bag',
    brand: '', // Missing brand intentional
    category: 'Accessories',
    price: 16.5,
    description: '', // Missing description intentional
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['tote bag', 'canvas', 'shopping bag', 'cotton bag'],
    specifications: [
      { key: 'Material', value: '100% GOTS Certified Organic Cotton (12oz canvas)' },
      { key: 'Dimensions', value: '15" x 16" with 6" bottom gusset' },
    ],
    rating: 4.2,
    reviewCount: 180,
    stock: 420,
  },

  // 20. Electronics - Healthy
  {
    id: 'prod-020',
    sku: 'ELEC-SONOS-ERA-300',
    title: 'Sonos Era 300 Spatial Audio Smart Speaker with Dolby Atmos, Wi-Fi 6, Bluetooth, and Trueplay Tuning',
    brand: 'Sonos',
    category: 'Electronics',
    price: 449.0,
    description: 'Featuring six optimally positioned drivers all around the front, sides, and top to support Dolby Atmos Music, the breakthrough acoustic design of the Sonos Era 300 projects sound from wall to wall and floor to ceiling, immersing you in every dimension of the track.',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['sonos speaker', 'spatial audio', 'dolby atmos', 'smart speaker', 'wifi audio', 'era 300'],
    specifications: [
      { key: 'Amplifiers', value: 'Six Class-D digital amplifiers' },
      { key: 'Connectivity', value: 'Wi-Fi 6, Bluetooth 5.0, Apple AirPlay 2, USB-C Line-In' },
      { key: 'Dimensions', value: '6.30 x 10.24 x 7.28 in (160 x 260 x 185 mm)' },
      { key: 'Microphones', value: 'Far-field microphone array with beamforming' },
      { key: 'Voice Control', value: 'Sonos Voice Control, Amazon Alexa' },
    ],
    rating: 4.7,
    reviewCount: 640,
    stock: 35,
  },

  // 21. Fashion - Critical: Uncategorized, no specs, no brand
  {
    id: 'prod-021',
    sku: 'FASH-SOCKS-ANON',
    title: 'Socks 6 Pack',
    brand: '', // Missing brand intentional
    category: 'Uncategorized', // Uncategorized intentional
    price: 12.0,
    description: 'Pack of 6 soft cotton socks for running.',
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: [],
    specifications: [],
    rating: 3.8,
    reviewCount: 14,
    stock: 600,
  },

  // 22. Home & Kitchen - Healthy
  {
    id: 'prod-022',
    sku: 'HOME-LECREUSET-OVEN',
    title: 'Le Creuset Enameled Cast Iron Signature Round Dutch Oven 5.5 Quart in Flame Cerise with Stainless Knob',
    brand: 'Le Creuset',
    category: 'Home & Kitchen',
    price: 420.0,
    description: 'The iconic Le Creuset Dutch oven is an indispensable culinary classic beloved by cooks across the world for nearly a century. Expertly crafted from enameled cast iron, the everyday versatility makes it ideal for everything from slow-cooking stews and braising meats to baking sourdough bread.',
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-a681340156d9?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['le creuset', 'dutch oven', 'cast iron', 'enameled cookware', 'french oven', 'signature round'],
    specifications: [
      { key: 'Capacity', value: '5.5 Quarts (5.2 Liters)' },
      { key: 'Heat Source', value: 'Induction, Gas, Electric, Ceramic, Halogen, Oven (up to 500°F)' },
      { key: 'Material', value: 'Enameled Cast Iron' },
      { key: 'Origin', value: 'Made in Fresnoy-le-Grand, France' },
      { key: 'Cleaning', value: 'Dishwasher safe; hand washing recommended' },
    ],
    rating: 4.9,
    reviewCount: 3890,
    stock: 45,
  },

  // 23. Electronics - Needs Review: Missing Specs & Single Image
  {
    id: 'prod-023',
    sku: 'ELEC-POWERBANK-20K',
    title: 'Anker PowerCore 20000mAh Ultra-High Capacity Portable Charger with PowerIQ and VoltageBoost',
    brand: 'Anker',
    category: 'Electronics',
    price: 49.99,
    description: 'Immense capacity that provides up to 5 full charges for modern smartphones. MultiProtect safety system combines surge protection and short circuit prevention to keep your devices safe.',
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    keywords: ['power bank', 'portable charger', 'anker powercore', 'battery pack'],
    specifications: [], // Missing specifications intentional
    rating: 4.6,
    reviewCount: 8400,
    stock: 220,
  },

  // 24. Beauty - Healthy
  {
    id: 'prod-024',
    sku: 'BEAU-CHANEL-NO5-EDP',
    title: 'Chanel No. 5 Eau de Parfum Vaporisateur Spray 100ml Timeless Floral Aldehydic Fragrance',
    brand: 'Chanel',
    category: 'Beauty',
    price: 172.0,
    description: 'Since its creation in 1921, N°5 has exuded the very essence of femininity. An abstract fragrance that unfurls an intoxicating floral bouquet, N°5 Eau de Parfum features blooming notes of May Rose and Jasmine bolstered by bright citrus top notes and smooth vanilla warmth.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    keywords: ['chanel no 5', 'perfume', 'eau de parfum', 'luxury fragrance', 'floral aldehyde', 'french perfume'],
    specifications: [
      { key: 'Fragrance Family', value: 'Floral Aldehydic' },
      { key: 'Volume', value: '100 ml (3.4 fl oz)' },
      { key: 'Key Notes', value: 'Aldehydes, Jasmine, May Rose, Bourbon Vanilla, Sandalwood' },
      { key: 'Concentration', value: 'Eau de Parfum (EDP)' },
    ],
    rating: 4.9,
    reviewCount: 5120,
    stock: 50,
  },
];

/**
 * Initializes and computes full quality metadata for every sample product
 */
export function generateInitialProducts(thresholds = { healthyThreshold: 80, needsReviewThreshold: 50 }): Product[] {
  const now = new Date().toISOString();
  return INITIAL_RAW_PRODUCTS.map((raw) => {
    const quality = calculateProductQuality(raw, thresholds);
    return {
      ...raw,
      qualityScore: quality.score,
      status: quality.status,
      issues: quality.issues,
      scoreBreakdown: quality.breakdown,
      recommendations: quality.recommendations,
      updatedAt: raw.updatedAt || now,
      createdAt: raw.createdAt || '2026-08-01T00:00:00.000Z',
    };
  });
}
