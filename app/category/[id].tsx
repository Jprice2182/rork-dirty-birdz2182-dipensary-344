import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getProductsByCategory } from '@/mocks/products';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/constants/categories';
import { Product } from '@/types/product';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const category = categories.find(cat => cat.id === id);

  const loadProducts = () => {
    if (id) {
      const categoryProducts = getProductsByCategory(id);
      setProducts(categoryProducts);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProducts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [id]);

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

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: category?.name || 'Category',
          headerShown: false,
        }}
      />
      
      {renderHeader()}
      
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found in this category</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
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
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dark.primary}
              colors={[Colors.dark.primary]}
            />
          }
          ListHeaderComponent={() => (
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryDescription}>
                Browse our selection of premium {category?.name.toLowerCase()} products. 
                All products are lab-tested and of the highest quality.
              </Text>
              <Text style={styles.resultsCount}>{products.length} products</Text>
            </View>
          )}
        />
      )}
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
  },
  productsContainer: {
    padding: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
  },
});