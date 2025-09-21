import { Product, ProductVariant } from '@/types/product';

// Flower variants for different quantities with updated pricing
const flowerVariants: ProductVariant[] = [
  {
    id: 'eighth',
    name: 'Eighth (1/8 oz)',
    weight: '3.5g',
    price: 20,
  },
  {
    id: 'quarter',
    name: 'Quarter (1/4 oz)',
    weight: '7g',
    price: 40,
  },
  {
    id: 'half',
    name: 'Half (1/2 oz)',
    weight: '14g',
    price: 60,
  },
  {
    id: 'oz',
    name: 'Oz (1 oz)',
    weight: '28g',
    price: 85,
  },
];

// Classic Pre-Roll variants with quantity pricing
const classicPreRollVariants: ProductVariant[] = [
  {
    id: 'single',
    name: '1 Pre-Roll',
    weight: '1g',
    price: 8,
  },
  {
    id: 'double',
    name: '2 Pre-Rolls',
    weight: '2g',
    price: 12,
  },
  {
    id: 'triple',
    name: '3 Pre-Rolls',
    weight: '3g',
    price: 15,
  },
];

// Infused Pre-Roll variants with quantity pricing
const infusedPreRollVariants: ProductVariant[] = [
  {
    id: 'single',
    name: '1 Infused Pre-Roll',
    weight: '1g',
    price: 15,
  },
  {
    id: 'double',
    name: '2 Infused Pre-Rolls',
    weight: '2g',
    price: 25,
  },
  {
    id: 'triple',
    name: '3 Infused Pre-Rolls',
    weight: '3g',
    price: 35,
  },
];

export const products: Product[] = [
  // FLOWER PRODUCTS (Category '1') - 5 products with variants
  {
    id: '1',
    name: 'Pineapple Express',
    category: '1',
    thc: 22,
    cbd: 0.1,
    price: 20, // Base price for eighth
    weight: '3.5g', // Default display weight
    strain: 'Hybrid',
    rating: 4.8,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/o8c1rj5oscr9bvaqq9iwf',
    description: "Pineapple Express is a sativa-dominant hybrid strain known for its tropical, fruity aroma and energizing effects. This strain delivers a burst of creativity and euphoria with sweet pineapple flavors.",
    effects: ['Relaxed', 'Sleepy', 'Happy'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '2',
    name: 'Purple Punch',
    category: '1',
    thc: 18,
    cbd: 0.2,
    price: 20,
    weight: '3.5g',
    strain: 'Indica',
    rating: 4.6,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/icqz3coz9l1mm7mm0o5jt',
    description: "Purple Punch is an indica-dominant hybrid cross between Larry OG and Granddaddy Purple. Known for its sweet grape and berry flavors, it delivers relaxing and sedating effects.",
    effects: ['Creative', 'Euphoric', 'Relaxed'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '3',
    name: 'Strawberry Cough',
    category: '1',
    thc: 25,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Sativa',
    rating: 4.7,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8d6mnlr6s7w4r6m67yzks',
    description: "Strawberry Cough by Sonoma Seeds is a legendary sativa strain renowned for its sweet strawberry aroma and smooth, uplifting effects. This premium flower features dense, frosty buds with vibrant colors and delivers an energizing cerebral high perfect for daytime use. Despite its name suggesting harshness, Strawberry Cough provides surprisingly smooth smoke with delicious berry flavors.",
    effects: ['Uplifting', 'Creative', 'Energetic'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '4',
    name: 'Super Lemon Haze',
    category: '1',
    thc: 24,
    cbd: 0.2,
    price: 20,
    weight: '3.5g',
    strain: 'Sativa',
    rating: 4.7,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/5mhcfaflrzpr1uuwfte4n',
    description: "Super Lemon Haze is a sativa-dominant hybrid known for its zesty lemon aroma and energizing effects. This award-winning strain delivers uplifting cerebral effects with a sweet citrus flavor profile.",
    effects: ['Energetic', 'Creative', 'Uplifting'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '5',
    name: 'Watermelon Mimosa',
    category: '1',
    thc: 21,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Hybrid',
    rating: 4.8,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/iepmuq4otgzh5ih904kym',
    description: "Watermelon Mimosa is a balanced hybrid strain with sweet watermelon and citrus flavors. This strain provides a perfect balance of relaxation and euphoria, ideal for any time of day.",
    effects: ['Balanced', 'Sweet', 'Euphoric'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '6',
    name: 'Green Crack',
    category: '1',
    thc: 23,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Sativa',
    rating: 4.9,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/wr2h1vspbwjrx7m5v8fgn',
    description: "Green Crack is a potent sativa strain known for its invigorating mental buzz and energizing effects. Despite its name, this strain is purely cannabis and delivers sharp focus and energy with a sweet, fruity flavor profile.",
    effects: ['Energetic', 'Focused', 'Creative'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '7',
    name: 'Panama Red',
    category: '1',
    thc: 19,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Sativa',
    rating: 4.7,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/dum5evymw4vufb8oeos1g',
    description: "Panama Red is a legendary sativa strain known for its uplifting and energetic effects. This classic strain features earthy, spicy flavors with hints of sweetness and delivers a clear-headed, creative high perfect for daytime use.",
    effects: ['Energetic', 'Creative', 'Uplifting'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '8',
    name: 'Zkittlez',
    category: '1',
    thc: 20,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Indica',
    rating: 4.8,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/3iyrhsoz78ow6xofbs6zq',
    description: "Zkittlez is an indica-dominant hybrid strain known for its fruity, candy-like aroma and flavor profile. This colorful strain delivers a relaxing body high with sweet tropical fruit flavors that taste like a rainbow of skittles.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '9',
    name: 'Godfather OG',
    category: '1',
    thc: 28,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Indica',
    rating: 4.9,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/3ghfgs2u6jx3kyzdl9161',
    description: "Godfather OG is a potent indica strain known as one of the strongest strains available. With deep purple hues and frosty trichomes, this strain delivers powerful sedating effects perfect for nighttime use. Its earthy, pine flavors are complemented by hints of grape and spice.",
    effects: ['Relaxed', 'Sleepy', 'Euphoric'],
    featured: true,
    variants: flowerVariants,
  },

  // EDIBLE PRODUCTS (Category '2') - 4 products
  {
    id: '201',
    name: 'Chocolate Bar',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 20,
    count: '10 pieces (10mg each)',
    rating: 4.7,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/glbfmpbpgvu50gzazfgvl',
    description: "Our premium chocolate bar contains 100mg THC total (10mg per piece) and is made with organic fair-trade chocolate for a delicious experience.",
    effects: ['Relaxed', 'Euphoric', 'Happy'],
    featured: true,
  },
  {
    id: '205',
    name: 'Rice Crispy Treat',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 18,
    count: '1 treat (100mg)',
    rating: 4.6,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uuuc7no9lexpnbbmzad22',
    description: "Classic rice crispy treat infused with premium cannabis extract. A nostalgic favorite with a modern twist, delivering 100mg THC in one delicious treat.",
    effects: ['Nostalgic', 'Sweet', 'Long-lasting'],
    featured: true,
  },
  {
    id: '206',
    name: 'Fruity Rice Crispy Treat',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 20,
    count: '1 treat (100mg)',
    rating: 4.8,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/zx76m8lyfbgsv0a0tlkji',
    description: "Our fruity rice crispy treat combines the classic crunch with vibrant fruit flavors and 100mg THC. A colorful and delicious edible experience.",
    effects: ['Fruity', 'Colorful', 'Uplifting'],
    featured: true,
  },
  {
    id: '207',
    name: 'Cookies and Cream Bar',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 22,
    count: '10 pieces (10mg each)',
    rating: 4.9,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/n5spqo11lbfx9x8mozolm',
    description: "Indulgent cookies and cream chocolate bar with 100mg THC total. Each piece contains 10mg THC with the perfect balance of chocolate and cookie crumbles.",
    effects: ['Indulgent', 'Creamy', 'Satisfying'],
    featured: true,
  },
  {
    id: '208',
    name: 'Brownies',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 25,
    count: '1 brownie (100mg)',
    rating: 4.8,
    image: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/84x3ur6ceal8ndub3shdu',
    description: "Rich, fudgy cannabis brownies made with premium chocolate and infused with 100mg THC. A classic edible experience with deep chocolate flavor.",
    effects: ['Rich', 'Chocolatey', 'Relaxing'],
    featured: true,
  },

  // PRE-ROLL PRODUCTS (Category '5') - 5 products
  {
    id: '500',
    name: 'Classic Pre-Roll',
    category: '5',
    thc: 20,
    cbd: 0,
    price: 8, // Base price for single
    weight: '1g', // Default display weight
    strain: 'Hybrid',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000',
    description: "Our classic pre-rolls are made with premium flower and rolled to perfection. Ready to smoke convenience with quality you can trust.",
    effects: ['Convenient', 'Balanced', 'Smooth'],
    featured: true,
    variants: classicPreRollVariants,
  },
  {
    id: '501',
    name: 'Sativa Pre-Roll Pack',
    category: '5',
    thc: 22,
    cbd: 0,
    price: 30,
    count: '3 pack (1g each)',
    strain: 'Sativa',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
    description: "Three premium sativa pre-rolls perfect for daytime use. Each joint is carefully crafted with high-quality sativa strains for an energizing experience.",
    effects: ['Energetic', 'Creative', 'Uplifting'],
    featured: false,
  },
  {
    id: '502',
    name: 'Indica Pre-Roll Pack',
    category: '5',
    thc: 24,
    cbd: 0,
    price: 30,
    count: '3 pack (1g each)',
    strain: 'Indica',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?q=80&w=1000',
    description: "Three premium indica pre-rolls ideal for evening relaxation. Made with top-shelf indica strains for deep relaxation and stress relief.",
    effects: ['Relaxed', 'Sleepy', 'Calm'],
    featured: true,
  },
  {
    id: '503',
    name: 'Mini Pre-Rolls',
    category: '5',
    thc: 18,
    cbd: 0,
    price: 20,
    count: '5 pack (0.5g each)',
    strain: 'Hybrid',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1000',
    description: "Perfect portion-controlled mini pre-rolls. Great for microdosing or when you want a shorter session without waste.",
    effects: ['Controlled', 'Convenient', 'Mild'],
    featured: false,
  },
  {
    id: '504',
    name: 'Infused Pre-Roll',
    category: '5',
    thc: 35,
    cbd: 0,
    price: 15, // Base price for single
    weight: '1g', // Default display weight
    strain: 'Hybrid',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
    description: "Premium flower pre-roll infused with concentrate for extra potency. Perfect for experienced users looking for enhanced effects.",
    effects: ['Potent', 'Enhanced', 'Long-lasting'],
    featured: true,
    variants: infusedPreRollVariants,
  },
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  if (!categoryId || typeof categoryId !== 'string') {
    console.warn('Invalid category ID provided:', categoryId);
    return [];
  }
  
  let filteredProducts: Product[] = [];
  
  // Handle strain-specific filtering for flower products
  if (categoryId === '1-sativa') {
    filteredProducts = products.filter(product => 
      product.category === '1' && product.strain === 'Sativa'
    );
  } else if (categoryId === '1-indica') {
    filteredProducts = products.filter(product => 
      product.category === '1' && product.strain === 'Indica'
    );
  } else if (categoryId === '1-hybrid') {
    filteredProducts = products.filter(product => 
      product.category === '1' && product.strain === 'Hybrid'
    );
  } else {
    // Regular category filtering
    filteredProducts = products.filter(product => product.category === categoryId);
  }
  
  console.log(`Category ${categoryId} has ${filteredProducts.length} products`);
  return filteredProducts;
};

export const getProductById = (id: string): Product | undefined => {
  if (!id || typeof id !== 'string') {
    console.warn('Invalid product ID provided:', id);
    return undefined;
  }
  
  return products.find(product => product.id === id);
};

export const getProductVariant = (productId: string, variantId: string) => {
  const product = getProductById(productId);
  if (!product || !product.variants) return null;
  
  return product.variants.find(variant => variant.id === variantId);
};

export const getProductPrice = (productId: string, variantId?: string): number => {
  const product = getProductById(productId);
  if (!product) return 0;
  
  if (variantId && product.variants) {
    const variant = product.variants.find(v => v.id === variantId);
    return variant ? variant.price : product.price;
  }
  
  return product.price;
};

export const getProductDisplayName = (productId: string, variantId?: string): string => {
  const product = getProductById(productId);
  if (!product) return 'Unknown Product';
  
  if (variantId && product.variants) {
    const variant = product.variants.find(v => v.id === variantId);
    return variant ? `${product.name} - ${variant.name}` : product.name;
  }
  
  return product.name;
};

// Debug function to check product counts by category
export const getProductCountsByCategory = () => {
  const counts: { [key: string]: number } = {};
  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });
  console.log('Product counts by category:', counts);
  return counts;
};

// Utility function to get all unique categories
export const getAllCategories = (): string[] => {
  const categories = [...new Set(products.map(product => product.category))];
  return categories.sort();
};

// Utility function to validate product data
export const validateProducts = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  products.forEach((product, index) => {
    if (!product.id) errors.push(`Product at index ${index} missing ID`);
    if (!product.name) errors.push(`Product ${product.id} missing name`);
    if (!product.category) errors.push(`Product ${product.id} missing category`);
    if (typeof product.price !== 'number') errors.push(`Product ${product.id} has invalid price`);
    if (typeof product.thc !== 'number') errors.push(`Product ${product.id} has invalid THC value`);
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};