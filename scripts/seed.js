const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper function to generate products
const generateProducts = (categoryId, categoryName, startIndex, count) => {
  const products = [];
  const productData = getProductDataByCategory(categoryName);

  for (let i = 0; i < count; i++) {
    const idx = i % productData.length;
    const product = productData[idx];
    const uniqueId = startIndex + i;

    products.push({
      name: `${product.name} ${uniqueId > productData.length ? `Model ${uniqueId}` : ''}`.trim(),
      slug: `${product.slug}-${uniqueId}`,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price + (i * 100),
      salePrice: product.salePrice ? product.salePrice + (i * 80) : null,
      stock: Math.floor(Math.random() * 100) + 20,
      sku: `${product.sku}-${uniqueId}`,
      brand: product.brand,
      categoryId: categoryId,
      images: product.images,
      thumbnail: product.thumbnail,
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      isFeatured: i < 5,
      weight: product.weight,
      dimensions: product.dimensions,
      color: product.color,
      material: product.material,
      warranty: product.warranty,
      hasVariants: product.hasVariants || false,
      sizes: product.sizes || [],
      colors: product.colors || [],
      tags: product.tags || [],
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
    });
  }

  return products;
};

// Product data templates by category
function getProductDataByCategory(categoryName) {
  const productTemplates = {
    'Electronics': [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with active noise cancellation, 40-hour battery life, and crystal-clear sound quality. Perfect for music lovers and travelers.',
        shortDescription: 'Premium ANC headphones with 40hr battery',
        price: 2999,
        salePrice: 2499,
        sku: 'ELEC-WH',
        brand: 'SoundMax',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        weight: 0.25,
        dimensions: '20x18x8 cm',
        color: 'Black',
        warranty: '2 years',
        tags: ['audio', 'wireless', 'noise-cancelling'],
        metaTitle: 'Premium Wireless Headphones - SoundMax',
        metaDescription: 'Experience superior sound with our wireless ANC headphones',
      },
      {
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, sleep tracking, and 100+ sport modes. Water-resistant up to 50m.',
        shortDescription: 'Advanced fitness smartwatch with GPS',
        price: 5999,
        salePrice: 4999,
        sku: 'ELEC-SW',
        brand: 'TechFit',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        weight: 0.05,
        dimensions: '4.5x4x1.2 cm',
        color: 'Silver',
        warranty: '1 year',
        tags: ['smartwatch', 'fitness', 'gps'],
        metaTitle: 'Smart Watch Pro - Fitness Tracker',
        metaDescription: 'Track your fitness goals with our advanced smartwatch',
      },
      {
        name: '4K Ultra HD Webcam',
        slug: '4k-webcam',
        description: '4K resolution webcam with auto-focus, built-in microphone, and wide-angle lens. Perfect for streaming and video calls.',
        shortDescription: '4K webcam with auto-focus',
        price: 3499,
        salePrice: 2999,
        sku: 'ELEC-WC',
        brand: 'StreamPro',
        images: [
          'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400',
        weight: 0.15,
        warranty: '1 year',
        tags: ['webcam', '4k', 'streaming'],
      },
      {
        name: 'Mechanical Gaming Keyboard RGB',
        slug: 'gaming-keyboard-rgb',
        description: 'Premium mechanical keyboard with RGB backlighting, programmable keys, and tactile switches for the ultimate gaming experience.',
        shortDescription: 'RGB mechanical keyboard for gaming',
        price: 4599,
        salePrice: 3999,
        sku: 'ELEC-KB',
        brand: 'GameForce',
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        weight: 1.2,
        warranty: '2 years',
        tags: ['keyboard', 'gaming', 'rgb'],
      },
      {
        name: 'Portable Bluetooth Speaker',
        slug: 'bluetooth-speaker',
        description: 'Waterproof portable speaker with 360° sound, 24-hour battery life, and deep bass. Perfect for outdoor adventures.',
        shortDescription: 'Waterproof portable speaker 24hr battery',
        price: 1999,
        salePrice: 1599,
        sku: 'ELEC-BS',
        brand: 'SoundWave',
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        weight: 0.6,
        warranty: '1 year',
        tags: ['speaker', 'bluetooth', 'waterproof'],
      },
    ],
    'Fashion': [
      {
        name: 'Classic White Cotton T-Shirt',
        slug: 'white-cotton-tshirt',
        description: '100% premium cotton t-shirt with comfortable fit. Perfect for everyday wear. Pre-shrunk and machine washable.',
        shortDescription: '100% cotton classic fit tee',
        price: 599,
        salePrice: 399,
        sku: 'FASH-TS',
        brand: 'StyleHub',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        hasVariants: true,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Gray'],
        material: 'Cotton',
        tags: ['tshirt', 'casual', 'cotton'],
      },
      {
        name: 'Denim Jeans Slim Fit',
        slug: 'denim-jeans-slim',
        description: 'Premium denim jeans with slim fit design. Stretchable fabric for maximum comfort. Available in multiple washes.',
        shortDescription: 'Slim fit stretchable denim jeans',
        price: 1899,
        salePrice: 1499,
        sku: 'FASH-JN',
        brand: 'DenimCo',
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        hasVariants: true,
        sizes: ['28', '30', '32', '34', '36', '38'],
        colors: ['Blue', 'Black', 'Gray'],
        material: 'Denim',
        tags: ['jeans', 'denim', 'slim-fit'],
      },
      {
        name: 'Leather Crossbody Bag',
        slug: 'leather-crossbody-bag',
        description: 'Genuine leather crossbody bag with adjustable strap. Multiple compartments for organized storage. Perfect for daily use.',
        shortDescription: 'Genuine leather crossbody bag',
        price: 2499,
        salePrice: 1999,
        sku: 'FASH-LB',
        brand: 'LuxeBags',
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        material: 'Leather',
        colors: ['Brown', 'Black', 'Tan'],
        warranty: '1 year',
        tags: ['bag', 'leather', 'crossbody'],
      },
      {
        name: 'Running Sneakers',
        slug: 'running-sneakers',
        description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Ideal for jogging and gym workouts.',
        shortDescription: 'Lightweight cushioned running shoes',
        price: 3299,
        salePrice: 2799,
        sku: 'FASH-SN',
        brand: 'RunFast',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        hasVariants: true,
        sizes: ['6', '7', '8', '9', '10', '11', '12'],
        colors: ['White', 'Black', 'Blue'],
        material: 'Synthetic',
        tags: ['shoes', 'sneakers', 'running'],
      },
      {
        name: 'Sunglasses UV Protection',
        slug: 'sunglasses-uv',
        description: 'Stylish sunglasses with 100% UV protection. Polarized lenses reduce glare. Durable frame with comfortable fit.',
        shortDescription: 'UV protection polarized sunglasses',
        price: 1299,
        salePrice: 999,
        sku: 'FASH-SG',
        brand: 'SunStyle',
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
        material: 'Plastic',
        warranty: '6 months',
        tags: ['sunglasses', 'uv-protection', 'polarized'],
      },
    ],
    'Home & Living': [
      {
        name: 'LED Table Lamp Modern',
        slug: 'led-table-lamp',
        description: 'Energy-efficient LED table lamp with adjustable brightness and color temperature. Touch control with memory function.',
        shortDescription: 'LED lamp with adjustable brightness',
        price: 1299,
        salePrice: 999,
        sku: 'HOME-TL',
        brand: 'LightPro',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        weight: 0.8,
        dimensions: '15x15x45 cm',
        warranty: '1 year',
        tags: ['lamp', 'led', 'modern'],
      },
      {
        name: 'Cotton Bedsheet Set',
        slug: 'cotton-bedsheet-set',
        description: 'Premium 300-thread count cotton bedsheet set. Includes 1 bedsheet, 2 pillowcases. Soft, breathable, and durable.',
        shortDescription: '300TC cotton bedsheet with pillowcases',
        price: 1899,
        salePrice: 1499,
        sku: 'HOME-BS',
        brand: 'ComfortHome',
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        hasVariants: true,
        sizes: ['Single', 'Double', 'Queen', 'King'],
        colors: ['White', 'Blue', 'Gray', 'Pink'],
        material: 'Cotton',
        tags: ['bedsheet', 'cotton', 'bedding'],
      },
      {
        name: 'Wall Clock Minimalist',
        slug: 'wall-clock-minimalist',
        description: 'Silent non-ticking wall clock with minimalist design. Large numbers for easy reading. Battery operated.',
        shortDescription: 'Silent minimalist wall clock',
        price: 899,
        salePrice: 699,
        sku: 'HOME-WC',
        brand: 'TimelessDecor',
        images: [
          'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400',
        weight: 0.5,
        dimensions: '30x30x4 cm',
        warranty: '1 year',
        tags: ['clock', 'wall-decor', 'minimalist'],
      },
      {
        name: 'Ceramic Dinner Plate Set',
        slug: 'ceramic-dinner-plates',
        description: 'Set of 6 ceramic dinner plates. Microwave and dishwasher safe. Elegant design perfect for everyday use or special occasions.',
        shortDescription: 'Set of 6 ceramic dinner plates',
        price: 1599,
        salePrice: 1299,
        sku: 'HOME-DP',
        brand: 'DineWell',
        images: [
          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
        material: 'Ceramic',
        colors: ['White', 'Blue', 'Gray'],
        tags: ['plates', 'ceramic', 'dinnerware'],
      },
      {
        name: 'Aromatherapy Essential Oil Diffuser',
        slug: 'essential-oil-diffuser',
        description: 'Ultrasonic aromatherapy diffuser with 7 LED color lights. Auto shut-off when water runs out. Whisper-quiet operation.',
        shortDescription: 'Ultrasonic diffuser with LED lights',
        price: 1799,
        salePrice: 1399,
        sku: 'HOME-AD',
        brand: 'AromaBliss',
        images: [
          'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
        weight: 0.4,
        warranty: '1 year',
        tags: ['diffuser', 'aromatherapy', 'wellness'],
      },
    ],
    'Sports & Fitness': [
      {
        name: 'Yoga Mat Non-Slip',
        slug: 'yoga-mat-non-slip',
        description: 'Extra thick 6mm yoga mat with excellent grip and cushioning. Eco-friendly material with carrying strap included.',
        shortDescription: '6mm non-slip yoga mat with strap',
        price: 1299,
        salePrice: 999,
        sku: 'SPORT-YM',
        brand: 'YogaFlow',
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        weight: 1.2,
        dimensions: '183x61x0.6 cm',
        colors: ['Purple', 'Blue', 'Pink', 'Green'],
        material: 'TPE',
        tags: ['yoga', 'fitness', 'mat'],
      },
      {
        name: 'Adjustable Dumbbells Set',
        slug: 'adjustable-dumbbells',
        description: 'Space-saving adjustable dumbbells 5-25kg per dumbbell. Quick weight adjustment system. Durable anti-roll design.',
        shortDescription: 'Adjustable dumbbells 5-25kg',
        price: 4999,
        salePrice: 4299,
        sku: 'SPORT-DB',
        brand: 'FitGear',
        images: [
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        weight: 25,
        warranty: '1 year',
        tags: ['dumbbells', 'weights', 'fitness'],
      },
      {
        name: 'Resistance Bands Set',
        slug: 'resistance-bands-set',
        description: 'Set of 5 resistance bands with different resistance levels. Includes door anchor, handles, and ankle straps.',
        shortDescription: '5-piece resistance band set',
        price: 999,
        salePrice: 799,
        sku: 'SPORT-RB',
        brand: 'FlexFit',
        images: [
          'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
        material: 'Latex',
        tags: ['resistance-bands', 'fitness', 'home-workout'],
      },
      {
        name: 'Sports Water Bottle 1L',
        slug: 'sports-water-bottle',
        description: 'BPA-free sports water bottle with leak-proof lid and carrying loop. Wide mouth for easy filling and cleaning.',
        shortDescription: '1L BPA-free sports bottle',
        price: 499,
        salePrice: 349,
        sku: 'SPORT-WB',
        brand: 'HydroMax',
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        colors: ['Blue', 'Black', 'Pink', 'Green'],
        material: 'Plastic',
        tags: ['water-bottle', 'sports', 'hydration'],
      },
      {
        name: 'Jump Rope Speed',
        slug: 'jump-rope-speed',
        description: 'Professional speed jump rope with adjustable length and ball bearing system. Lightweight handles with anti-slip grip.',
        shortDescription: 'Adjustable speed jump rope',
        price: 699,
        salePrice: 499,
        sku: 'SPORT-JR',
        brand: 'JumpPro',
        images: [
          'https://images.unsplash.com/photo-1618517047674-b279cbbdd3d8?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1618517047674-b279cbbdd3d8?w=800',
        weight: 0.2,
        tags: ['jump-rope', 'cardio', 'fitness'],
      },
    ],
    'Books & Stationery': [
      {
        name: 'Hardcover Notebook A5',
        slug: 'hardcover-notebook-a5',
        description: 'Premium hardcover notebook with 200 pages of thick cream paper. Perfect for journaling, note-taking, or sketching.',
        shortDescription: 'A5 hardcover notebook 200 pages',
        price: 499,
        salePrice: 349,
        sku: 'BOOK-NB',
        brand: 'WriteWell',
        images: [
          'https://images.unsplash.com/photo-1517842536009-f2f7d0d0cce6?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1517842536009-f2f7d0d0cce6?w=400',
        colors: ['Black', 'Brown', 'Navy'],
        tags: ['notebook', 'stationery', 'journal'],
      },
      {
        name: 'Gel Pen Set 12 Colors',
        slug: 'gel-pen-set-12',
        description: 'Smooth-writing gel pens in 12 vibrant colors. Quick-drying ink that won\'t smudge. Perfect for notes and artwork.',
        shortDescription: '12-color gel pen set',
        price: 399,
        salePrice: 299,
        sku: 'BOOK-GP',
        brand: 'ColorFlow',
        images: [
          'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
        tags: ['pens', 'stationery', 'writing'],
      },
      {
        name: 'Desk Organizer Wooden',
        slug: 'desk-organizer-wooden',
        description: 'Multi-compartment wooden desk organizer. Keep your stationery neat and accessible. Natural wood finish.',
        shortDescription: 'Wooden desk organizer',
        price: 899,
        salePrice: 699,
        sku: 'BOOK-DO',
        brand: 'DeskMaster',
        images: [
          'https://images.unsplash.com/photo-1584820927498-cfe5bfd2982f?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5bfd2982f?w=400',
        material: 'Wood',
        weight: 0.8,
        tags: ['organizer', 'desk', 'storage'],
      },
      {
        name: 'Sticky Notes Multicolor Pack',
        slug: 'sticky-notes-multicolor',
        description: 'Pack of 12 multicolor sticky note pads. 100 sheets per pad. Strong adhesive that sticks and resticks.',
        shortDescription: '12-pack multicolor sticky notes',
        price: 299,
        salePrice: 199,
        sku: 'BOOK-SN',
        brand: 'StickyPro',
        images: [
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7d?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7d?w=400',
        tags: ['sticky-notes', 'stationery', 'office'],
      },
      {
        name: 'Fountain Pen Premium',
        slug: 'fountain-pen-premium',
        description: 'Elegant fountain pen with smooth nib and refillable ink cartridge. Comes in gift box. Perfect for professionals.',
        shortDescription: 'Premium refillable fountain pen',
        price: 1599,
        salePrice: 1299,
        sku: 'BOOK-FP',
        brand: 'LuxWrite',
        images: [
          'https://images.unsplash.com/photo-1592992197899-52b0606f0149?w=800',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1592992197899-52b0606f0149?w=400',
        material: 'Metal',
        warranty: '2 years',
        tags: ['fountain-pen', 'premium', 'writing'],
      },
    ],
  };

  return productTemplates[categoryName] || [];
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Existing data cleared\n');

  // Create categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets, devices, and tech accessories',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing, footwear, and fashion accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Home decor, furniture, and living essentials',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Fitness equipment, sports gear, and wellness products',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books & Stationery',
        slug: 'books-stationery',
        description: 'Books, office supplies, and stationery items',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories\n`);

  // Create products (100+ total)
  console.log('📦 Creating products...');
  const allProducts = [];

  // 25 Electronics products
  allProducts.push(...generateProducts(categories[0].id, 'Electronics', 1, 25));

  // 25 Fashion products
  allProducts.push(...generateProducts(categories[1].id, 'Fashion', 26, 25));

  // 20 Home & Living products
  allProducts.push(...generateProducts(categories[2].id, 'Home & Living', 51, 20));

  // 20 Sports & Fitness products
  allProducts.push(...generateProducts(categories[3].id, 'Sports & Fitness', 71, 20));

  // 15 Books & Stationery products
  allProducts.push(...generateProducts(categories[4].id, 'Books & Stationery', 91, 15));

  // Insert products in batches
  const batchSize = 20;
  for (let i = 0; i < allProducts.length; i += batchSize) {
    const batch = allProducts.slice(i, i + batchSize);
    await prisma.product.createMany({ data: batch });
    console.log(`  ✓ Created products ${i + 1}-${Math.min(i + batchSize, allProducts.length)}`);
  }
  console.log(`✅ Created ${allProducts.length} products\n`);

  // Create demo user
  console.log('👤 Creating demo user...');
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@novacart.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Demo user created (email: demo@novacart.com, password: demo123)\n');

  // Create cart and wishlist for demo user
  console.log('🛒 Creating cart and wishlist...');
  await Promise.all([
    prisma.cart.create({
      data: { userId: user.id },
    }),
    prisma.wishlist.create({
      data: { userId: user.id },
    }),
  ]);
  console.log('✅ Cart and wishlist created\n');

  // Create admin user
  console.log('👑 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@novacart.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567891',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created (email: admin@novacart.com, password: admin123)\n');

  console.log('✨ Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`  • Categories: ${categories.length}`);
  console.log(`  • Products: ${allProducts.length}`);
  console.log(`  • Users: 2 (1 customer, 1 admin)`);
  console.log('\n🎉 You can now start using NovaCart!');
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
