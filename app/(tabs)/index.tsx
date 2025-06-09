import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { categories } from '@/constants/categories';
import CategoryCard from '@/components/CategoryCard';
import DiscountBanner from '@/components/DiscountBanner';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import appInfo from '@/constants/appInfo';

export default function HomeScreen() {
  const router = useRouter();
  const cartItemsCount = useCartStore(state => state.getCartItemsCount());
  const { isNewUser, hasUsedDiscount, name, markAsExistingUser } = useUserStore();
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigateToCart = () => {
    router.push('/cart');
  };

  const handleCloseBanner = () => {
    setShowDiscountBanner(false);
    // Mark user as no longer new when they dismiss the banner
    if (isNewUser) {
      markAsExistingUser();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {name ? `Welcome, ${name}` : 'Welcome'}
            </Text>
            <Text style={styles.title}>{appInfo.name}</Text>
            <Text style={styles.subtitle}>{appInfo.slogan}</Text>
          </View>
          
          <Pressable 
            style={styles.cartButton} 
            onPress={navigateToCart}
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
          <Text style={styles.biographyTitle}>Atlanta: The Phoenix City</Text>
          <Text style={styles.biographySubtitle}>Cannabis Culture & Urban Evolution</Text>
          
          <Text style={styles.biographyText}>
            Atlanta, Georgia stands as a testament to resilience and transformation. Rising from the ashes of the Civil War like a phoenix, this magnificent city has evolved into the cultural and economic heart of the New South.
          </Text>
          
          <Text style={styles.biographyText}>
            Founded in 1837 as a railroad terminus, Atlanta has always been a city of movement and progress. From its reconstruction after Sherman's march to its emergence as a civil rights epicenter led by Dr. Martin Luther King Jr., Atlanta has consistently pushed boundaries and embraced change.
          </Text>
          
          <Text style={styles.biographyText}>
            Today, Atlanta represents a new chapter in cannabis culture and policy reform. As Georgia navigates the evolving landscape of medical cannabis legislation, Atlanta serves as the progressive beacon, fostering discussions about wellness, medicine, and personal freedom. The city's diverse communities have embraced cannabis not just as medicine, but as part of a broader conversation about social justice and economic opportunity.
          </Text>
          
          <Text style={styles.biographyText}>
            From the bustling streets of Midtown to the historic charm of Virginia-Highland, from the artistic energy of Little Five Points to the modern skyline of Buckhead, Atlanta continues to grow and adapt. The city's cannabis community reflects this diversity - bringing together patients, advocates, entrepreneurs, and educators who are shaping the future of cannabis in the Southeast.
          </Text>
          
          <Text style={styles.biographyText}>
            As we look toward the future, Atlanta remains what it has always been: a city of opportunity, innovation, and hope. Whether you are exploring cannabis for wellness, medicine, or simply seeking quality products in a welcoming environment, Atlanta's evolving cannabis landscape offers something for everyone in this beautiful, ever-changing metropolis.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    color: Colors.dark.subtext,
    fontSize: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  subtitle: {
    color: Colors.dark.primary,
    fontSize: 14,
    marginTop: 4,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: Colors.dark.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  biographySection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  biographyTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  biographySubtitle: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  biographyText: {
    color: Colors.dark.subtext,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingBottom: 24,
  },
});