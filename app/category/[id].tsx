import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, RefreshControl, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getProductsByCategory, getProductCountsByCategory, validateProducts } from '@/mocks/products';
import ProductCard from '@/components/ProductCard';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { categories } from '@/constants/categories';
import { useUserStore } from '@/store/userStore';
import { Product } from '@/types/product';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isVerified, setVerified } = useUserStore();
  const [showAgeModal, setShowAgeModal] = useState(!isVerified);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const category = categories.find(cat => cat.id === id);

  const handleAgeVerified = () => {
    setVerified(true);
    setShowAgeModal(false);
  };

  const handleAgeModalClose = () => {
    setShowAgeModal(false);
    // Redirect to home or show a message that they can't use the app
    router.replace('/');
  };

  // Show age verification if not verified
  if (showAgeModal) {
    return (
      <AgeVerificationModal 
        isVisible={true} 
        onClose={handleAgeModalClose}
        onVerified={handleAgeVerified}
      />
    );
  }

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      
      if (!id) {
        throw new Error('No category ID provided');
      }

      console.log(`Loading products for category ${id}`);
      
      // Validate product data first
      const validation = validateProducts();
      if (!validation.valid) {
        console.warn('Product validation errors:', validation.errors);
      }
      
      const categoryProducts = getProductsByCategory(id);
      console.log(`Found ${categoryProducts.length} products for category ${id}`);
      
      // Debug: Log all category counts
      const counts = getProductCountsByCategory();
      console.log('Product counts by category:', counts);
      
      if (categoryProducts.length === 0) {
        console.warn(`No products found for category ${id}. Available categories:`, Object.keys(counts));
      }
      
      setProducts(categoryProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      console.error('Error loading products:', errorMessage);
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleGoBack = () => {
    router.back();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('Refreshing products...');
    
    try {
      await loadProducts();
    } catch (err) {
      console.error('Error during refresh:', err);
    } finally {
      // Add a small delay to show the refresh animation
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  }, [loadProducts]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{category?.name || 'Category'}</Text>
        <View style={styles.placeholder} />
      </View>
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        id={item.id}
        name={item.name}
        price={item.price}
        image={item.image}
        thc={item.thc}
        weight={item.weight}
        count={item.count}
        volume={item.volume}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading products...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Error loading products</Text>
          <Text style={styles.emptySubtext}>{error}</Text>
          <Pressable style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found</Text>
        <Text style={styles.emptySubtext}>
          This category does not have any products yet. Check back soon!
        </Text>
        <Text style={styles.debugText}>
          Category ID: {id}
        </Text>
        <Pressable style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>
      </View>
    );
  };

  const renderListHeader = () => {
    if (products.length === 0) return null;
    
    return (
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryDescription}>
          Browse our selection of premium {category?.name.toLowerCase()} products. 
          All products are lab-tested and of the highest quality.
        </Text>
        <Text style={styles.resultsCount}>
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </Text>
      </View>
    );
  };

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: category?.name || 'Category',
          headerShown: false,
        }}
      />
      
      {renderHeader()}
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={[
          styles.productsContainer,
          products.length === 0 && styles.emptyContentContainer
        ]}
        columnWrapperStyle={products.length > 0 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
            colors={[Colors.dark.primary]}
            progressBackgroundColor={Colors.dark.card}
          />
        }
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 200, // Approximate item height
          offset: 200 * Math.floor(index / 2),
          index,
        })}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  categoryInfo: {
    padding: 16,
    marginBottom: 8,
  },
  categoryDescription: {
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  resultsCount: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontWeight: '600',
  },
  productsContainer: {
    padding: 8,
    paddingBottom: 24,
  },
  emptyContentContainer: {
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 400,
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  debugText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
});