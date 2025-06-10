import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Pressable, RefreshControl } from 'react-native';
import { Search as SearchIcon, X, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products, getProductCountsByCategory, validateProducts } from '@/mocks/products';
import ProductCard from '@/components/ProductCard';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { useUserStore } from '@/store/userStore';
import { Product } from '@/types/product';

export default function SearchScreen() {
  const { isVerified } = useUserStore();

  // Show age verification if not verified - this should be the first thing checked
  if (!isVerified) {
    return <AgeVerificationModal visible={true} />;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize the search function to prevent unnecessary re-renders
  const searchProducts = useCallback((query: string): Product[] => {
    if (!query.trim()) {
      return products;
    }

    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.effects.some(effect => effect.toLowerCase().includes(searchTerm)) ||
      product.category === searchTerm
    );
  }, []);

  // Debounced search effect
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      console.log('Search effect triggered, query:', searchQuery);
      console.log('Total products available:', products.length);
      
      const results = searchProducts(searchQuery);
      setFilteredProducts(results);
      
      console.log(`Search results for "${searchQuery}":`, results.length);
      setLoading(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchProducts]);

  // Initialize with all products
  useEffect(() => {
    setFilteredProducts(products);
    
    // Validate products on mount
    const validation = validateProducts();
    if (!validation.valid) {
      console.warn('Product validation errors:', validation.errors);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('Refreshing search data...');
    
    try {
      // Simulate refreshing product data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Debug: Log product counts
      const counts = getProductCountsByCategory();
      console.log('Product counts after refresh:', counts);
      
      // Re-run the search with current query
      const results = searchProducts(searchQuery);
      setFilteredProducts(results);
      console.log('Re-filtered products after refresh:', results.length);
      
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  }, [searchQuery, searchProducts]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Add to recent searches if it's not empty and not already in the list
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]); // Keep only 5 recent searches
    }
  }, [recentSearches]);

  const handleRecentSearchPress = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <View style={styles.productCardWrapper}>
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
  ), []);

  const renderEmptyList = useCallback(() => (
    <View style={styles.emptyContainer}>
      <SearchIcon size={60} color={Colors.dark.subtext} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>
        {searchQuery.trim() ? 'No products found' : 'Search for cannabis products'}
      </Text>
      <Text style={styles.emptySubtext}>
        {searchQuery.trim() 
          ? 'Try a different search term or browse categories' 
          : 'Find flower, edibles, vapes, and more'
        }
      </Text>
      {searchQuery.trim() && (
        <Text style={styles.debugText}>
          Searched in {products.length} total products
        </Text>
      )}
    </View>
  ), [searchQuery]);

  const renderRecentSearches = useCallback(() => {
    if (searchQuery.trim() || recentSearches.length === 0) return null;
    
    return (
      <View style={styles.recentSearchesContainer}>
        <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
        {recentSearches.map((search, index) => (
          <Pressable 
            key={`${search}-${index}`}
            style={styles.recentSearchItem}
            onPress={() => handleRecentSearchPress(search)}
          >
            <SearchIcon size={16} color={Colors.dark.subtext} />
            <Text style={styles.recentSearchText}>{search}</Text>
          </Pressable>
        ))}
      </View>
    );
  }, [searchQuery, recentSearches, handleRecentSearchPress]);

  const renderHeader = useCallback(() => (
    <View>
      {renderRecentSearches()}
      {filteredProducts.length > 0 && searchQuery.trim() && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </Text>
        </View>
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}
    </View>
  ), [renderRecentSearches, filteredProducts.length, searchQuery, loading]);

  // Memoize the key extractor
  const keyExtractor = useCallback((item: Product) => item.id, []);

  // Memoize the column wrapper style
  const columnWrapperStyle = useMemo(() => 
    filteredProducts.length > 0 ? styles.productRow : undefined, 
    [filteredProducts.length]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={Colors.dark.subtext} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search flower, edibles, vapes..."
          placeholderTextColor={Colors.dark.subtext}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch} style={styles.clearButton}>
            <X size={20} color={Colors.dark.subtext} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={columnWrapperStyle}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.dark.primary}
            colors={[Colors.dark.primary]}
            progressBackgroundColor={Colors.dark.card}
          />
        }
        showsVerticalScrollIndicator={false}
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
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: Colors.dark.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  recentSearchesContainer: {
    marginBottom: 16,
  },
  recentSearchesTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  recentSearchText: {
    color: Colors.dark.text,
    fontSize: 14,
    marginLeft: 8,
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    minHeight: 300,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  debugText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});