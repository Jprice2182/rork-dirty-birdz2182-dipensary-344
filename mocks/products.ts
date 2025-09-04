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
    price: 35,
  },
  {
    id: 'half',
    name: 'Half (1/2 oz)',
    weight: '14g',
    price: 55,
  },
  {
    id: 'oz',
    name: 'Oz (1 oz)',
    weight: '28g',
    price: 85,
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
    strain: 'Indica',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000',
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
    strain: 'Sativa Hybrid',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
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
    strain: 'Indica Hybrid',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?q=80&w=1000',
    description: "Strawberry Cough is a sativa strain known for its sweet strawberry aroma and uplifting effects. Despite its name, it provides smooth smoke and energizing cerebral effects.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: false,
    variants: flowerVariants,
  },
  {
    id: '4',
    name: 'Sour Diesel',
    category: '1',
    thc: 20,
    cbd: 0.2,
    price: 20,
    weight: '3.5g',
    strain: 'Sativa',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1000',
    description: "Sour Diesel is a sativa strain named after its pungent, diesel-like aroma. This fast-acting strain delivers energizing, dreamy cerebral effects that have pushed Sour Diesel to its legendary status.",
    effects: ['Energetic', 'Happy', 'Uplifting'],
    featured: true,
    variants: flowerVariants,
  },
  {
    id: '5',
    name: 'Gelato',
    category: '1',
    thc: 23,
    cbd: 0.1,
    price: 20,
    weight: '3.5g',
    strain: 'Hybrid',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
    description: "Gelato is a hybrid strain that originated in California's Bay Area. This strain is known for its sweet aroma and powerful effects that provide a well-balanced high.",
    effects: ['Relaxed', 'Happy', 'Creative'],
    featured: false,
    variants: flowerVariants,
  },

  // EDIBLE PRODUCTS (Category '2') - 5 products
  {
    id: '200',
    name: 'Gummy Bears',
    category: '2',
    thc: 10,
    cbd: 0,
    price: 20,
    count: '10 pack (10mg each)',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1620662736427-b8a198f52a4d?q=80&w=1000',
    description: "Delicious gummy bears infused with premium cannabis extract. Each gummy contains 10mg THC for a consistent and enjoyable experience.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: true,
  },
  {
    id: '201',
    name: 'Chocolate Bar',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 20,
    count: '10 pieces (10mg each)',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000',
    description: "Our premium chocolate bar contains 100mg THC total (10mg per piece) and is made with organic fair-trade chocolate for a delicious experience.",
    effects: ['Relaxed', 'Euphoric', 'Happy'],
    featured: true,
  },
  {
    id: '202',
    name: 'Fruit Chews',
    category: '2',
    thc: 50,
    cbd: 50,
    price: 20,
    count: '10 pieces (10mg each)',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1582354065827-2f8be1a0ce25?q=80&w=1000',
    description: "These balanced 1:1 THC:CBD fruit chews provide a mild, balanced effect with the therapeutic benefits of both cannabinoids.",
    effects: ['Balanced', 'Mild', 'Therapeutic'],
    featured: false,
  },
  {
    id: '203',
    name: 'Cannabis Cookies',
    category: '2',
    thc: 100,
    cbd: 0,
    price: 20,
    count: '10 cookies (10mg each)',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=1000',
    description: "Our homestyle chocolate chip cookies each contain 10mg THC for a classic edible experience with delicious flavor.",
    effects: ['Relaxed', 'Happy', 'Hungry'],
    featured: true,
  },
  {
    id: '204',
    name: 'THC Drink',
    category: '2',
    thc: 10,
    cbd: 0,
    price: 8,
    volume: '12oz',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000',
    description: "This refreshing cannabis-infused beverage contains 10mg THC and has a rapid onset compared to traditional edibles.",
    effects: ['Refreshing', 'Social', 'Uplifting'],
    featured: false,
  },

  // CONCENTRATES PRODUCTS (Category '3') - 5 products
  {
    id: '300',
    name: 'Live Resin',
    category: '3',
    thc: 85,
    cbd: 0,
    price: 40,
    weight: '1g',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1581101767113-7b6e54c1b7c0?q=80&w=1000',
    description: "Premium live resin concentrate extracted from fresh frozen cannabis plants, preserving maximum terpene content and flavor.",
    effects: ['Potent', 'Flavorful', 'Intense'],
    featured: true,
  },
  {
    id: '301',
    name: 'Shatter',
    category: '3',
    thc: 90,
    cbd: 0,
    price: 35,
    weight: '1g',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1000',
    description: "Glass-like cannabis concentrate with high THC content and clean, pure effects. Perfect for experienced users.",
    effects: ['Clean', 'Potent', 'Clear'],
    featured: false,
  },
  {
    id: '302',
    name: 'Rosin',
    category: '3',
    thc: 80,
    cbd: 0,
    price: 50,
    weight: '1g',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1533423996279-f9938f12a0ce?q=80&w=1000',
    description: "Solventless rosin pressed from premium flower using only heat and pressure. The purest form of cannabis concentrate.",
    effects: ['Pure', 'Natural', 'Full-spectrum'],
    featured: true,
  },
  {
    id: '303',
    name: 'Wax',
    category: '3',
    thc: 75,
    cbd: 0,
    price: 30,
    weight: '1g',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1561041695-d2faaf38e42a?q=80&w=1000',
    description: "Soft, waxy concentrate that is easy to handle and provides consistent effects. Great for both beginners and experienced users.",
    effects: ['Smooth', 'Consistent', 'Manageable'],
    featured: false,
  },
  {
    id: '304',
    name: 'Hash',
    category: '3',
    thc: 60,
    cbd: 0,
    price: 25,
    weight: '1g',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1581101767113-7b6e54c1b7c0?q=80&w=1000',
    description: "Traditional hash made from compressed trichomes. A classic concentrate with rich flavor and moderate potency.",
    effects: ['Traditional', 'Mellow', 'Flavorful'],
    featured: false,
  },

  // VAPE PRODUCTS (Category '4') - 5 products
  {
    id: '400',
    name: 'Premium Cartridge',
    category: '4',
    thc: 85,
    cbd: 0,
    price: 25,
    volume: '1g',
    strain: 'Hybrid',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1581101767113-7b6e54c1b7c0?q=80&w=1000',
    description: "Our premium cartridges contain 100% cannabis oil with no additives. Compatible with standard 510-thread batteries.",
    effects: ['Relaxed', 'Focused', 'Creative'],
    featured: false,
  },
  {
    id: '401',
    name: 'Purple Punch Cartridge',
    category: '4',
    thc: 80,
    cbd: 0,
    price: 25,
    volume: '1g',
    strain: 'Sativa Hybrid',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1000',
    description: "Experience the popular Purple Punch strain in convenient cartridge form. This cartridge delivers the same grape and berry aroma with relaxing effects in a discreet package.",
    effects: ['Creative', 'Euphoric', 'Relaxed'],
    featured: true,
  },
  {
    id: '402',
    name: 'Sour Diesel Cartridge',
    category: '4',
    thc: 82,
    cbd: 0,
    price: 25,
    volume: '1g',
    strain: 'Sativa',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1533423996279-f9938f12a0ce?q=80&w=1000',
    description: "Our Sour Diesel cartridge captures the energizing and uplifting effects of this classic sativa strain, perfect for daytime use.",
    effects: ['Energetic', 'Happy', 'Uplifting'],
    featured: false,
  },
  {
    id: '403',
    name: 'Indica Blend Cartridge',
    category: '4',
    thc: 75,
    cbd: 0,
    price: 25,
    volume: '0.5g',
    strain: 'Indica',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1561041695-d2faaf38e42a?q=80&w=1000',
    description: "This premium indica cartridge features a blend of relaxing strains perfect for evening use. Provides smooth, consistent vapor with every draw.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: true,
  },
  {
    id: '404',
    name: 'CBD Cartridge',
    category: '4',
    thc: 5,
    cbd: 75,
    price: 25,
    volume: '1g',
    strain: 'CBD Dominant',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1581101767113-7b6e54c1b7c0?q=80&w=1000',
    description: "Our CBD-dominant cartridge provides the therapeutic benefits of CBD with minimal psychoactive effects, ideal for daytime relief.",
    effects: ['Calm', 'Focused', 'Relief'],
    featured: false,
  },

  // PRE-ROLL PRODUCTS (Category '5') - 5 products
  {
    id: '500',
    name: 'Classic Pre-Roll',
    category: '5',
    thc: 20,
    cbd: 0,
    price: 12,
    weight: '1g',
    strain: 'Hybrid',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000',
    description: "Our classic pre-rolls are made with premium flower and rolled to perfection. Ready to smoke convenience with quality you can trust.",
    effects: ['Convenient', 'Balanced', 'Smooth'],
    featured: true,
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
    price: 18,
    weight: '1g',
    strain: 'Hybrid',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
    description: "Premium flower pre-roll infused with concentrate for extra potency. Perfect for experienced users looking for enhanced effects.",
    effects: ['Potent', 'Enhanced', 'Long-lasting'],
    featured: true,
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
  
  const filteredProducts = products.filter(product => product.category === categoryId);
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