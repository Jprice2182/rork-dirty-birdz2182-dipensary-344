const appInfo = {
  name: "Dirty Birdz2182",
  slogan: "Premium Cannabis Delivered",
  promoCode: "ATLANTA20",
  promoDiscount: 0.2,
  eighthsPromotion: {
    title: "SUPER SPECIAL",
    subtitle: "Buy 2 Eighths, Get 3rd for $1",
    description: "Mix and match any flower eighths (3.5g)",
    discountPrice: 1.00,
    minimumQuantity: 2,
    code: "EIGHTHS1"
  },
  customerService: {
    email: "support@dirtybirdz2182.com",
    phone: "+1 (404) 555-0123",
    hours: "Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-9PM",
    address: "123 Cannabis Street, Atlanta, GA 30303"
  },
  supportEmail: "support@dirtybirdz2182.com",
  supportPhone: "+1 (404) 555-0123",
  version: "1.0.0",
  minAge: 21,
  deliveryFee: 5.99,
  freeDeliveryMinimum: 50.00,
  estimatedDeliveryTime: "30-45 minutes",
  defaultTipPercentages: [15, 18, 20, 25],
  refundPolicy: {
    timeLimit: 24, // hours
    description: "100% money back guarantee within 24 hours",
    processingTime: "1-3 business days",
    eligibleStatuses: ['delivered'],
    excludedItems: [], // All items are refundable
    refundMethods: ['original_payment', 'store_credit']
  },
  operatingHours: {
    monday: "9:00 AM - 10:00 PM",
    tuesday: "9:00 AM - 10:00 PM", 
    wednesday: "9:00 AM - 10:00 PM",
    thursday: "9:00 AM - 10:00 PM",
    friday: "9:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "10:00 AM - 9:00 PM"
  },
  socialMedia: {
    instagram: "@dirtybirdz2182",
    twitter: "@dirtybirdz2182",
    facebook: "DirtyBirdz2182"
  },
  legalDisclaimer: "This product has not been analyzed or approved by the FDA. For use only by adults 21 years of age and older. Keep out of reach of children and pets.",
  privacyPolicyUrl: "https://dirtybirdz2182.com/privacy",
  termsOfServiceUrl: "https://dirtybirdz2182.com/terms"
} as const;

export default appInfo;