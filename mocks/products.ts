import { Product } from '@/types/product';

export const products: Product[] = [
  // FLOWER PRODUCTS (Category '1') - 5 products
  {
    id: '1',
    name: 'Northern Lights',
    category: '1',
    thc: 22,
    cbd: 0.1,
    price: 30,
    weight: '3.5g',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000',
    description: "Northern Lights is a classic indica strain known for its resinous buds and resilience during growth. This strain features crystalline resin and sweet, spicy aromas with hints of pine.",
    effects: ['Relaxed', 'Sleepy', 'Happy'],
    featured: true,
  },
  {
    id: '2',
    name: 'Blue Dream',
    category: '1',
    thc: 18,
    cbd: 0.2,
    price: 30,
    weight: '3.5g',
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
    description: "Blue Dream is a sativa-dominant hybrid originating in California. A cross between Blueberry and Haze, it balances full-body relaxation with gentle cerebral invigoration.",
    effects: ['Creative', 'Euphoric', 'Relaxed'],
    featured: true,
  },
  {
    id: '3',
    name: 'Wedding Cake',
    category: '1',
    thc: 25,
    cbd: 0.1,
    price: 30,
    weight: '3.5g',
    image: 'https://images.unsplash.com/photo-1585828922344-85c9daa264b0?q=80&w=1000',
    description: "Wedding Cake is a potent indica-hybrid strain known for its rich and tangy flavor profile with earthy pepper undertones. The strain provides relaxing and euphoric effects.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: false,
  },
  {
    id: '4',
    name: 'Sour Diesel',
    category: '1',
    thc: 20,
    cbd: 0.2,
    price: 30,
    weight: '3.5g',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1000',
    description: "Sour Diesel is a sativa strain named after its pungent, diesel-like aroma. This fast-acting strain delivers energizing, dreamy cerebral effects that have pushed Sour Diesel to its legendary status.",
    effects: ['Energetic', 'Happy', 'Uplifting'],
    featured: true,
  },
  {
    id: '5',
    name: 'Gelato',
    category: '1',
    thc: 23,
    cbd: 0.1,
    price: 30,
    weight: '3.5g',
    image: 'https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000',
    description: "Gelato is a hybrid strain that originated in California's Bay Area. This strain is known for its sweet aroma and powerful effects that provide a well-balanced high.",
    effects: ['Relaxed', 'Happy', 'Creative'],
    featured: false,
  },

  // PRE-ROLL PRODUCTS (Category '2') - 5 products
  {
    id: '200',
    name: 'Classic Joint',
    category: '2',
    thc: 18,
    cbd: 0.1,
    price: 10,
    count: '1 pre-roll',
    image: 'https://images.unsplash.com/photo-1595189592930-831489da9b1e?q=80&w=1000',
    description: "Our classic pre-rolled joint is perfect for on-the-go enjoyment. Each joint contains premium flower that's been ground to perfection and rolled with care.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: true,
  },
  {
    id: '201',
    name: 'Triple Pack Indica',
    category: '2',
    thc: 20,
    cbd: 0.1,
    price: 15,
    count: '3 pack',
    image: 'https://images.unsplash.com/photo-1595189592930-831489da9b1e?q=80&w=1000',
    description: "These indica pre-rolls are perfect for evening relaxation. Each joint contains premium indica flower for a calming, body-focused experience.",
    effects: ['Relaxed', 'Sleepy', 'Calm'],
    featured: false,
  },
  {
    id: '202',
    name: 'Quad Pack Sativa',
    category: '2',
    thc: 19,
    cbd: 0.1,
    price: 20,
    count: '4 pack',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1000',
    description: "Our sativa pre-rolls are ideal for daytime use, providing uplifting and energizing effects without the sedation.",
    effects: ['Energetic', 'Creative', 'Focused'],
    featured: true,
  },
  {
    id: '203',
    name: 'CBD Pre-Roll',
    category: '2',
    thc: 5,
    cbd: 15,
    price: 10,
    count: '1 pre-roll',
    image: 'https://images.unsplash.com/photo-1595189592930-831489da9b1e?q=80&w=1000',
    description: "These CBD-dominant pre-rolls provide the therapeutic benefits of cannabis with minimal psychoactive effects, perfect for new users.",
    effects: ['Relaxed', 'Clear-headed', 'Relief'],
    featured: false,
  },
  {
    id: '204',
    name: 'King Size Pre-Roll',
    category: '2',
    thc: 22,
    cbd: 0.1,
    price: 10,
    count: '1 king size',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1000',
    description: "Our king size pre-roll contains 1.5g of premium flower, perfect for sharing with friends or for a longer session.",
    effects: ['Euphoric', 'Happy', 'Relaxed'],
    featured: true,
  },

  // EDIBLE PRODUCTS (Category '3') - 5 products
  {
    id: '300',
    name: 'Gummy Bears',
    category: '3',
    thc: 10,
    cbd: 0,
    price: 20,
    count: '10 pack (10mg each)',
    image: 'https://images.unsplash.com/photo-1620662736427-b8a198f52a4d?q=80&w=1000',
    description: "Delicious gummy bears infused with premium cannabis extract. Each gummy contains 10mg THC for a consistent and enjoyable experience.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: true,
  },
  {
    id: '301',
    name: 'Chocolate Bar',
    category: '3',
    thc: 100,
    cbd: 0,
    price: 20,
    count: '10 pieces (10mg each)',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000',
    description: "Our premium chocolate bar contains 100mg THC total (10mg per piece) and is made with organic fair-trade chocolate for a delicious experience.",
    effects: ['Relaxed', 'Euphoric', 'Happy'],
    featured: true,
  },
  {
    id: '302',
    name: 'Fruit Chews',
    category: '3',
    thc: 50,
    cbd: 50,
    price: 20,
    count: '10 pieces (10mg each)',
    image: 'https://images.unsplash.com/photo-1582354065827-2f8be1a0ce25?q=80&w=1000',
    description: "These balanced 1:1 THC:CBD fruit chews provide a mild, balanced effect with the therapeutic benefits of both cannabinoids.",
    effects: ['Balanced', 'Mild', 'Therapeutic'],
    featured: false,
  },
  {
    id: '303',
    name: 'Cannabis Cookies',
    category: '3',
    thc: 100,
    cbd: 0,
    price: 20,
    count: '10 cookies (10mg each)',
    image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=1000',
    description: "Our homestyle chocolate chip cookies each contain 10mg THC for a classic edible experience with delicious flavor.",
    effects: ['Relaxed', 'Happy', 'Hungry'],
    featured: true,
  },
  {
    id: '304',
    name: 'THC Drink',
    category: '3',
    thc: 10,
    cbd: 0,
    price: 8,
    volume: '12oz',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000',
    description: "This refreshing cannabis-infused beverage contains 10mg THC and has a rapid onset compared to traditional edibles.",
    effects: ['Refreshing', 'Social', 'Uplifting'],
    featured: false,
  },

  // VAPE PRODUCTS (Category '4') - 5 products
  {
    id: '400',
    name: 'Premium Vape Cartridge',
    category: '4',
    thc: 85,
    cbd: 0,
    price: 25,
    volume: '1g',
    image: 'https://images.unsplash.com/photo-1581101767113-7b6e54c1b7c0?q=80&w=1000',
    description: "Our premium vape cartridges contain 100% cannabis oil with no additives. Compatible with standard 510-thread batteries.",
    effects: ['Relaxed', 'Focused', 'Creative'],
    featured: false,
  },
  {
    id: '401',
    name: 'Blue Dream Vape',
    category: '4',
    thc: 80,
    cbd: 0,
    price: 25,
    volume: '1g',
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1000',
    description: "Experience the popular Blue Dream strain in convenient vape form. This cartridge delivers the same berry aroma and balanced effects in a discreet package.",
    effects: ['Creative', 'Euphoric', 'Relaxed'],
    featured: true,
  },
  {
    id: '402',
    name: 'Sour Diesel Vape',
    category: '4',
    thc: 82,
    cbd: 0,
    price: 25,
    volume: '1g',
    image: 'https://images.unsplash.com/photo-1533423996279-f9938f12a0ce?q=80&w=1000',
    description: "Our Sour Diesel vape cartridge captures the energizing and uplifting effects of this classic sativa strain, perfect for daytime use.",
    effects: ['Energetic', 'Happy', 'Uplifting'],
    featured: false,
  },
  {
    id: '403',
    name: 'Disposable Vape Pen',
    category: '4',
    thc: 75,
    cbd: 0,
    price: 25,
    volume: '0.5g',
    image: 'https://images.unsplash.com/photo-1561041695-d2faaf38e42a?q=80&w=1000',
    description: "This all-in-one disposable vape pen is perfect for beginners or on-the-go use. No charging or refilling required - just inhale and enjoy.",
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    featured: true,
  },
  {
    id: '404',
    name: 'CBD Vape Cartridge',
    category: '4',
    thc: 5,
    cbd: 75,
    price: 25,
    volume: '1g',
    image: 'https://images.unsplash.com/photo-1581101767113-7b6e54c1b7c0?q=80&w=1000',
    description: "Our CBD-dominant vape cartridge provides the therapeutic benefits of CBD with minimal psychoactive effects, ideal for daytime relief.",
    effects: ['Calm', 'Focused', 'Relief'],
    featured: false,
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