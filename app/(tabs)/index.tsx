import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, RefreshControl, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getMainCategories, getFlowerStrainCategories } from '@/constants/categories';
import { getFeaturedProducts } from '@/mocks/products';
import CategoryCard from '@/components/CategoryCard';

import DiscountBanner from '@/components/DiscountBanner';
import BirthdayNotificationBanner from '@/components/BirthdayNotificationBanner';
import BirthdayPromotionModal from '@/components/BirthdayPromotionModal';
import SafeText from '@/components/SafeText';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { getProductCountsByCategory, validateProducts } from '@/mocks/products';
import appInfo from '@/constants/appInfo';

export default function HomeScreen() {
  const router = useRouter();
  const cartItemsCount = useCartStore(state => state.getCartItemsCount());
  const { getEighthsPromotion } = useCartStore();
  const { isNewUser, hasUsedDiscount, name, markAsExistingUser, isVerified, birthday, points } = useUserStore();
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);
  const [showEighthsBanner, setShowEighthsBanner] = useState(true);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const eighthsPromo = getEighthsPromotion();


  useEffect(() => {
    if (!isVerified) {
      router.replace('/');
      return;
    }

    // Check if birthday is required and not set
    if (!birthday) {
      Alert.alert(
        "Birthday Required",
        "Please set your birthday in your profile to continue using the app.",
        [
          {
            text: "Go to Profile",
            onPress: () => router.push('/(tabs)/profile')
          }
        ]
      );
      return;
    }

    const validation = validateProducts();
    if (!validation.valid) {
      console.warn('Product validation errors:', validation.errors);
    }

    useCartStore.getState().validateCart();

    const counts = getProductCountsByCategory();
    console.log('Product counts by category on mount:', counts);
  }, [isVerified, birthday, router]);

  const navigateToCart = useCallback(() => {
    router.push('/cart');
  }, [router]);

  const handleCloseBanner = useCallback(() => {
    setShowDiscountBanner(false);
    if (isNewUser) {
      markAsExistingUser();
    }
  }, [isNewUser, markAsExistingUser]);

  const handleCloseEighthsBanner = useCallback(() => {
    setShowEighthsBanner(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validation = validateProducts();
      if (!validation.valid) {
        console.warn('Product validation errors after refresh:', validation.errors);
      }
      
      const counts = getProductCountsByCategory();
      console.log('Product counts after refresh:', counts);
      
      await useCartStore.getState().refreshCart();
      
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

  const shouldShowDiscountBanner = isNewUser && !hasUsedDiscount && showDiscountBanner;
  const shouldShowEighthsBanner = showEighthsBanner && !eighthsPromo.eligible;

  if (!isVerified) {
    return null;
  }

  // Show birthday requirement notice if not set
  if (!birthday) {
    return (
      <View style={styles.container}>
        <View style={styles.birthdayRequiredContainer}>
          <Text style={styles.birthdayRequiredTitle}>Birthday Required</Text>
          <Text style={styles.birthdayRequiredText}>
            Please set your birthday in your profile to continue using the app.
          </Text>
          <Pressable 
            style={styles.birthdayRequiredButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.birthdayRequiredButtonText}>Go to Profile</Text>
          </Pressable>
        </View>
      </View>
    );
  }

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
            <SafeText style={styles.greeting}>
              {name ? `Welcome back, ${name}` : 'Welcome to Atlanta'}
            </SafeText>
            <SafeText style={styles.title}>{appInfo.name}</SafeText>
            <SafeText style={styles.subtitle}>{appInfo.slogan}</SafeText>
          </View>
          
          <View style={styles.headerActions}>
            <View style={styles.pointsContainer}>
              <Star size={16} color={Colors.dark.primary} fill={Colors.dark.primary} />
              <SafeText style={styles.pointsText}>{points}</SafeText>
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
                  <SafeText style={styles.cartBadgeText}>
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </SafeText>
                </View>
              )}
            </Pressable>
          </View>
        </View>
        
        <View style={styles.pointsInfoCard}>
          <View style={styles.pointsInfoHeader}>
            <Star size={20} color={Colors.dark.primary} fill={Colors.dark.primary} />
            <SafeText style={styles.pointsInfoTitle}>Loyalty Points</SafeText>
          </View>
          <SafeText style={styles.pointsBalance}>{points} Points</SafeText>
          <SafeText style={styles.pointsDescription}>
            Earn 1 point for every $1 spent • Points never expire • Redeem points for rewards inside the dispensary
          </SafeText>
        </View>

        {shouldShowDiscountBanner && (
          <DiscountBanner onClose={handleCloseBanner} />
        )}

        {shouldShowEighthsBanner && (
          <DiscountBanner 
            showEighthsPromo={true} 
            onClose={handleCloseEighthsBanner} 
          />
        )}

        <BirthdayNotificationBanner 
          onPress={() => setShowBirthdayModal(true)}
        />

        <View style={styles.hawkSection}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/swco5gs1d6k8wvvhe3pgd' }}
            style={styles.hawkImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.biographySection}>
          <SafeText style={styles.biographyTitle}>Atlanta: The Heart of the South</SafeText>
          <SafeText style={styles.biographySubtitle}>Where Culture Meets Cannabis Freedom</SafeText>
          
          <View style={styles.biographyContent}>
            <SafeText style={styles.biographyText}>
              Atlanta is a city that captivates the soul. From the moment you experience its warm Southern hospitality to the vibrant energy that pulses through its tree-lined streets, Atlanta offers an unmatched blend of historic charm and modern sophistication that makes it one of America's most beautiful cities.
            </SafeText>
            
            <SafeText style={styles.biographyText}>
              The city's stunning skyline rises majestically above a canopy of towering oaks and dogwoods, earning Atlanta its nickname "The City in a Forest." Whether you are strolling through the artistic corridors of the High Museum, exploring the bustling markets of Ponce City Market, or enjoying the scenic beauty of Piedmont Park, Atlanta's natural beauty and architectural marvels create an atmosphere unlike anywhere else.
            </SafeText>
            
            <SafeText style={styles.biographyText}>
              Atlanta's culture is as rich and diverse as its landscape. This is the birthplace of civil rights, the home of world-class cuisine, and a hub for music that has shaped generations. From the soulful sounds of hip-hop born in its neighborhoods to the elegant symphony performances at the Fox Theatre, Atlanta's cultural tapestry weaves together tradition and innovation in the most beautiful way.
            </SafeText>
            
            <SafeText style={styles.biographyText}>
              The vibe here is infectious - a perfect blend of laid-back Southern charm and metropolitan energy. People gather in cozy coffee shops in Virginia-Highland, celebrate at rooftop bars overlooking the city, and connect in the eclectic neighborhoods that each tell their own unique story. Atlanta embraces everyone with open arms and genuine warmth.
            </SafeText>
            
            <View style={styles.cannabisSection}>
              <SafeText style={styles.cannabisTitle}>Cannabis Freedom in Georgia</SafeText>
              <SafeText style={styles.biographyText}>
                Georgia has embraced a progressive approach to cannabis, with medical marijuana now legal and accessible to qualified patients. Atlanta leads the way in creating a welcoming, regulated environment where patients can access quality cannabis products safely and legally. This milestone represents not just policy change, but Atlanta's continued commitment to health, wellness, and personal freedom.
              </SafeText>
              
              <SafeText style={styles.biographyText}>
                In this beautiful city where tradition meets progress, cannabis legalization has opened doors to new opportunities for wellness, community, and economic growth. Atlanta's cannabis culture reflects the city itself - diverse, welcoming, and forward-thinking, creating a space where everyone can find what they need in a safe, legal, and beautiful environment.
              </SafeText>
              
              <SafeText style={styles.biographyText}>
                From premium flower grown with Georgia's rich soil to innovative edibles and concentrates, our dispensary brings you the finest cannabis products available. We are proud to serve Atlanta's cannabis community with the same warmth and excellence that defines this incredible city.
              </SafeText>
            </View>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <SafeText style={styles.sectionTitle}>Shop Categories</SafeText>
          <SafeText style={styles.sectionSubtitle}>Discover premium cannabis products</SafeText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {getMainCategories().map(category => (
              <CategoryCard 
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </ScrollView>
        </View>

        {/* Flower Strain Selection Section */}
        <View style={styles.strainSelectionSection}>
          <SafeText style={styles.sectionTitle}>Choose Your Strain</SafeText>
          <SafeText style={styles.sectionSubtitle}>Select from our premium flower varieties</SafeText>
          
          <View style={styles.strainCardsContainer}>
            {getFlowerStrainCategories().map(strain => {
              const strainProducts = getFeaturedProducts().filter(product => 
                product.category === '1' && product.strain === strain.name
              );
              
              return (
                <Pressable
                  key={strain.id}
                  style={styles.strainCard}
                  onPress={() => router.push(`/category/${strain.id}`)}
                >
                  <View style={styles.strainCardHeader}>
                    <SafeText style={styles.strainIcon}>{strain.icon}</SafeText>
                    <View style={styles.strainInfo}>
                      <SafeText style={styles.strainName}>{strain.name}</SafeText>
                      <SafeText style={styles.strainCount}>
                        {strainProducts.length} premium strains available
                      </SafeText>
                    </View>
                  </View>
                  
                  <SafeText style={styles.strainDescription}>
                    {strain.name === 'Sativa' && 'Energizing • Creative • Uplifting • Perfect for daytime use'}
                    {strain.name === 'Indica' && 'Relaxing • Calming • Sedating • Ideal for evening and sleep'}
                    {strain.name === 'Hybrid' && 'Balanced • Versatile • Best of both worlds • Any time of day'}
                  </SafeText>
                  
                  <View style={styles.strainProductPreview}>
                    {strainProducts.slice(0, 3).map((product, index) => (
                      <View key={product.id} style={[styles.productPreviewDot, { left: index * 8 }]} />
                    ))}
                    <SafeText style={styles.viewAllText}>View All →</SafeText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>


      </ScrollView>
      
      <BirthdayPromotionModal 
        visible={showBirthdayModal} 
        onClose={() => setShowBirthdayModal(false)} 
      />
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
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
  birthdayRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  birthdayRequiredTitle: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  birthdayRequiredText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  birthdayRequiredButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  birthdayRequiredButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
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
    marginBottom: 32,
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

  hawkSection: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  hawkImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
  },
  pointsInfoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pointsInfoTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointsBalance: {
    color: Colors.dark.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointsDescription: {
    color: Colors.dark.subtext,
    fontSize: 14,
    lineHeight: 20,
  },
  strainSelectionSection: {
    marginBottom: 32,
  },
  strainCardsContainer: {
    gap: 16,
  },
  strainCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  strainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strainIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  strainInfo: {
    flex: 1,
  },
  strainName: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  strainCount: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  strainDescription: {
    color: Colors.dark.subtext,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  strainProductPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  productPreviewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.primary,
    position: 'absolute',
  },
  viewAllText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 'auto',
  },
});