import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { categories } from '@/constants/categories';
import CategoryCard from '@/components/CategoryCard';
import DiscountBanner from '@/components/DiscountBanner';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { getProductCountsByCategory, validateProducts } from '@/mocks/products';
import appInfo from '@/constants/appInfo';

export default function HomeScreen() {
  const router = useRouter();
  const cartItemsCount = useCartStore(state => state.getCartItemsCount());
  const { isNewUser, hasUsedDiscount, name, markAsExistingUser } = useUserStore();
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Validate products and cart on mount
  useEffect(() => {
    const validation = validateProducts();
    if (!validation.valid) {
      console.warn('Product validation errors:', validation.errors);
      Alert.alert(
        'Data Warning', 
        'Some product data may be invalid. Please refresh the app.',
        [{ text: 'OK' }]
      );
    }

    // Validate cart
    useCartStore.getState().validateCart();
  }, []);

  const navigateToCart = useCallback(() => {
    router.push('/cart');
  }, [router]);

  const handleCloseBanner = useCallback(() => {
    setShowDiscountBanner(false);
    // Mark user as no longer new when they dismiss the banner
    if (isNewUser) {
      markAsExistingUser();
    }
  }, [isNewUser, markAsExistingUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log('Refreshing home screen data...');
      
      // Simulate refreshing data - in a real app, you'd fetch fresh data here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate products after refresh
      const validation = validateProducts();
      if (!validation.valid) {
        console.warn('Product validation errors after refresh:', validation.errors);
      }
      
      // Log product counts for debugging
      const counts = getProductCountsByCategory();
      console.log('Product counts after refresh:', counts);
      
      // Refresh cart to ensure consistency
      await useCartStore.getState().refreshCart();
      
      console.log('Home screen refresh completed');
      
    } catch (error) {
      console.error('Error refreshing home screen data:', error);
      Alert.alert(
        'Refresh Error',
        'Failed to refresh data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Show discount banner only for new users who haven't used discount and haven't dismissed it
  const shouldShowDiscountBanner = isNewUser && !hasUsedDiscount && showDiscountBanner;

  return (
    <View style={styles.container}>
      <ScrollView 
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
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {name ? `Welcome back, ${name}` : 'Welcome to Atlanta'}
            </Text>
            <Text style={styles.title}>{appInfo.name}</Text>
            <Text style={styles.subtitle}>{appInfo.slogan}</Text>
          </View>
          
          <Pressable 
            style={styles.cartButton} 
            onPress={navigateToCart}
            accessibilityLabel={`Shopping cart with ${cartItemsCount} items`}
            accessibilityRole="button"
          >
            <ShoppingCart size={24} color={Colors.dark.text} />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {shouldShowDiscountBanner && (
          <DiscountBanner onClose={handleCloseBanner} />
        )}

        <View style={styles.biographySection}>
          <Text style={styles.biographyTitle}>Atlanta: The Heart of the South</Text>
          <Text style={styles.biographySubtitle}>Where Culture Meets Cannabis Freedom</Text>
          
          <View style={styles.biographyContent}>
            <Text style={styles.biographyText}>
              Atlanta is a city that captivates the soul. From the moment you experience its warm Southern hospitality to the vibrant energy that pulses through its tree-lined streets, Atlanta offers an unmatched blend of historic charm and modern sophistication that makes it one of America's most beautiful cities.
            </Text>
            
            <Text style={styles.biographyText}>
              The city's stunning skyline rises majestically above a canopy of towering oaks and dogwoods, earning Atlanta its nickname "The City in a Forest." Whether you are strolling through the artistic corridors of the High Museum, exploring the bustling markets of Ponce City Market, or enjoying the scenic beauty of Piedmont Park, Atlanta's natural beauty and architectural marvels create an atmosphere unlike anywhere else.
            </Text>
            
            <Text style={styles.biographyText}>
              Atlanta's culture is as rich and diverse as its landscape. This is the birthplace of civil rights, the home of world-class cuisine, and a hub for music that has shaped generations. From the soulful sounds of hip-hop born in its neighborhoods to the elegant symphony performances at the Fox Theatre, Atlanta's cultural tapestry weaves together tradition and innovation in the most beautiful way.
            </Text>
            
            <Text style={styles.biographyText}>
              The vibe here is infectious - a perfect blend of laid-back Southern charm and metropolitan energy. People gather in cozy coffee shops in Virginia-Highland, celebrate at rooftop bars overlooking the city, and connect in the eclectic neighborhoods that each tell their own unique story. Atlanta embraces everyone with open arms and genuine warmth.
            </Text>
            
            <View style={styles.cannabisSection}>
              <Text style={styles.cannabisTitle}>Cannabis Freedom in Georgia</Text>
              <Text style={styles.biographyText}>
                Georgia has embraced a progressive approach to cannabis, with medical marijuana now legal and accessible to qualified patients. Atlanta leads the way in creating a welcoming, regulated environment where patients can access quality cannabis products safely and legally. This milestone represents not just policy change, but Atlanta's continued commitment to health, wellness, and personal freedom.
              </Text>
              
              <Text style={styles.biographyText}>
                In this beautiful city where tradition meets progress, cannabis legalization has opened doors to new opportunities for wellness, community, and economic growth. Atlanta's cannabis culture reflects the city itself - diverse, welcoming, and forward-thinking, creating a space where everyone can find what they need in a safe, legal, and beautiful environment.
              </Text>
              
              <Text style={styles.biographyText}>
                From premium flower grown with Georgia's rich soil to innovative edibles and concentrates, our dispensary brings you the finest cannabis products available. We are proud to serve Atlanta's cannabis community with the same warmth and excellence that defines this incredible city.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop Categories</Text>
          <Text style={styles.sectionSubtitle}>Discover premium cannabis products</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <CategoryCard 
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  cartBadgeText: {
    color: Colors.dark.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  biographySection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  biographyTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  biographySubtitle: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  biographyContent: {
    gap: 16,
  },
  biographyText: {
    color: Colors.dark.subtext,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
  },
  cannabisSection: {
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 16,
  },
  cannabisTitle: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
});