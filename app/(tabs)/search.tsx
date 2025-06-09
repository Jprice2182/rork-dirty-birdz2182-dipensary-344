import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Pressable, RefreshControl } from 'react-native';
import { Search as SearchIcon, X, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products, getProductCountsByCategory } from '@/mocks/products';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [refreshing, setRefreshing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    console.log('Search effect triggered, query:', searchQuery);
    console.log('Total products available:', products.length);
    
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      console.log('Empty query, showing all products:', products.length);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.effects.some(effect => effect.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
      console.log(`Filtered products for "${query}":`, filtered.length);
    }
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    console.log('Refreshing search data...');
    
    try {
      // Simulate refreshing product data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Debug: Log product counts
      const counts = getProductCountsByCategory();
      console.log('Product counts after refresh:', counts);
      
      // Reset search if needed
      if (searchQuery.trim() === '') {
        setFilteredProducts(products);
        console.log('Reset to all products after refresh:', products.length);
      } else {
        // Re-run the search
        const query = searchQuery.toLowerCase();
        const filtered = products.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.effects.some(effect => effect.toLowerCase().includes(query))
        );
        setFilteredProducts(filtered);
        console.log('Re-filtered products after refresh:', filtered.length);
      }
      
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Add to recent searches if it's not empty and not already in the list
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]); // Keep only 5 recent searches
    }
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const renderProduct = ({ item }: { item: Product }) => (
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
  );

  const renderEmptyList = () => (
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
  );

  const renderRecentSearches = () => {
    if (searchQuery.trim() || recentSearches.length === 0) return null;
    
    return (
      <View style={styles.recentSearchesContainer}>
        <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
        {recentSearches.map((search, index) => (
          <Pressable 
            key={index}
            style={styles.recentSearchItem}
            onPress={() => handleRecentSearchPress(search)}
          >
            <SearchIcon size={16} color={Colors.dark.subtext} />
            <Text style={styles.recentSearchText}>{search}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {renderRecentSearches()}
      {filteredProducts.length > 0 && searchQuery.trim() && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </Text>
        </View>
      )}
    </View>
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
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.productRow : undefined}
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