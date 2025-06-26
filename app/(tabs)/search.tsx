import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { products } from '@/mocks/products';
import { categories } from '@/constants/categories';
import ProductCard from '@/components/ProductCard';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import SafeText from '@/components/SafeText';
import { useUserStore } from '@/store/userStore';
import { safeTextContent } from '@/utils/safeRender';

export default function SearchScreen() {
  const router = useRouter();
  const { isVerified, setVerified } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    if (!isVerified) {
      setShowAgeModal(true);
    }
  }, [isVerified]);

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.strain && product.strain.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory]);

  const handleAgeVerification = () => {
    setVerified(true);
    setShowAgeModal(false);
  };

  const handleCloseAgeModal = () => {
    setShowAgeModal(false);
    router.replace('/');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

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
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.dark.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.dark.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <X size={20} color={Colors.dark.subtext} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilters}
        contentContainerStyle={styles.categoryFiltersContent}
      >
        <Pressable
          style={[
            styles.categoryFilter,
            !selectedCategory && styles.categoryFilterActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <SafeText style={[
            styles.categoryFilterText,
            !selectedCategory && styles.categoryFilterTextActive
          ]}>
            All
          </SafeText>
        </Pressable>
        
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryFilter,
              selectedCategory === category.id && styles.categoryFilterActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <SafeText style={styles.categoryFilterEmoji}>
              {safeTextContent(category.icon)}
            </SafeText>
            <SafeText style={[
              styles.categoryFilterText,
              selectedCategory === category.id && styles.categoryFilterTextActive
            ]}>
              {safeTextContent(category.name)}
            </SafeText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Clear Filters */}
      {(searchQuery || selectedCategory) && (
        <View style={styles.activeFilters}>
          <SafeText style={styles.activeFiltersText}>
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
          </SafeText>
          <Pressable onPress={clearFilters} style={styles.clearFiltersButton}>
            <Filter size={16} color={Colors.dark.primary} />
            <SafeText style={styles.clearFiltersText}>Clear Filters</SafeText>
          </Pressable>
        </View>
      )}

      {/* Results */}
      <ScrollView 
        style={styles.results}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContent}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.noResults}>
            <SafeText style={styles.noResultsTitle}>No products found</SafeText>
            <SafeText style={styles.noResultsText}>
              Try adjusting your search or filters
            </SafeText>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                thc={product.thc}
                weight={product.weight}
                count={product.count}
                volume={product.volume}
              />
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
  searchHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  categoryFilters: {
    maxHeight: 60,
  },
  categoryFiltersContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryFilterActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  categoryFilterEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryFilterText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeFiltersText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  clearFiltersText: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  results: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noResultsText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});