import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products } from '@/mocks/products';
import { categories } from '@/constants/categories';
import ProductCard from '@/components/ProductCard';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { useUserStore } from '@/store/userStore';

type SortOption = 'name' | 'price-low' | 'price-high' | 'rating';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isVerified, verifyAge } = useUserStore();
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  const category = categories.find(cat => cat.id === id);
  const categoryProducts = products.filter(product => product.category === id);

  useEffect(() => {
    if (!isVerified) {
      setShowAgeModal(true);
    }
  }, [isVerified]);

  const handleAgeVerification = () => {
    verifyAge();
    setShowAgeModal(false);
  };

  const handleCloseAgeModal = () => {
    setShowAgeModal(false);
    router.replace('/');
  };

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name': return 'Name A-Z';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'rating': return 'Highest Rated';
      default: return 'Name A-Z';
    }
  };

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  if (!isVerified) {
    return (
      <AgeVerificationModal
        isVisible={showAgeModal}
        onClose={handleCloseAgeModal}
        onVerified={handleAgeVerification}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: category.name,
          headerStyle: { backgroundColor: Colors.dark.card },
          headerTintColor: Colors.dark.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />

      {/* Category Header */}
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <View style={styles.categoryText}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            <Text style={styles.productCount}>
              {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Sort Button */}
        <Pressable 
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <Filter size={20} color={Colors.dark.text} />
          <Text style={styles.sortButtonText}>Sort</Text>
        </Pressable>
      </View>

      {/* Sort Options */}
      {showSortOptions && (
        <View style={styles.sortOptions}>
          {(['name', 'price-low', 'price-high', 'rating'] as SortOption[]).map(option => (
            <Pressable
              key={option}
              style={[
                styles.sortOption,
                sortBy === option && styles.sortOptionActive
              ]}
              onPress={() => {
                setSortBy(option);
                setShowSortOptions(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === option && styles.sortOptionTextActive
              ]}>
                {getSortLabel(option)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Products Grid */}
      <ScrollView 
        style={styles.products}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContent}
      >
        {sortedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No products available</Text>
            <Text style={styles.emptyStateText}>
              Check back soon for new {category.name.toLowerCase()} products!
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.dark.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 2,
  },
  productCount: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  sortOptions: {
    backgroundColor: Colors.dark.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.dark.primary,
  },
  sortOptionText: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  sortOptionTextActive: {
    fontWeight: '600',
  },
  products: {
    flex: 1,
  },
  productsContent: {
    padding: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});