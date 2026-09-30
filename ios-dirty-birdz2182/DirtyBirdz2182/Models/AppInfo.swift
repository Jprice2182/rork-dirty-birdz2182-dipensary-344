import Foundation

/// Static business configuration: pricing, promos, support details and legal copy.
nonisolated enum AppInfo {
    static let name = "Dirty Birdz2182"
    static let slogan = "Premium Cannabis Delivered"
    static let version = "1.0.0"
    static let minAge = 21

    static let promoCode = "ATLANTA20"
    static let promoDiscount = 0.20

    static let deliveryFee = 5.99
    static let freeDeliveryMinimum = 70.0
    static let taxRate = 0.08
    static let estimatedDeliveryTime = "30-45 minutes"
    static let defaultTipPercentages = [15, 18, 20, 25]

    /// Points redeem at 100 points = $5 off.
    static let pointsPerDollarRedeemed = 20.0
    static let minimumRedeemablePoints = 100

    enum EighthsPromotion {
        static let title = "SUPER SPECIAL"
        static let subtitle = "Buy 2 Eighths, Get 3rd for $1"
        static let detail = "Mix and match any flower eighths (3.5g)"
        static let discountPrice = 1.00
        static let minimumQuantity = 2
        static let code = "EIGHTHS1"
    }

    enum Support {
        static let email = "support@dirtybirdz2182.com"
        static let phone = "+1 (404) 555-0123"
        static let hours = "Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-9PM"
        static let address = "123 Cannabis Street, Atlanta, GA 30303"
    }

    enum RefundPolicy {
        static let timeLimitHours = 24
        static let description = "100% money back guarantee within 24 hours"
        static let processingTime = "1-3 business days"
    }

    static let operatingHours: [(day: String, hours: String)] = [
        ("Monday", "9:00 AM - 10:00 PM"),
        ("Tuesday", "9:00 AM - 10:00 PM"),
        ("Wednesday", "9:00 AM - 10:00 PM"),
        ("Thursday", "9:00 AM - 10:00 PM"),
        ("Friday", "9:00 AM - 11:00 PM"),
        ("Saturday", "10:00 AM - 11:00 PM"),
        ("Sunday", "10:00 AM - 9:00 PM")
    ]

    enum Social {
        static let instagram = "@dirtybirdz2182"
        static let twitter = "@dirtybirdz2182"
        static let facebook = "DirtyBirdz2182"
    }

    static let farmBillCompliance = "All products sold through this app are hemp-derived THCA products, federally legal under the 2018 Agriculture Improvement Act (Farm Bill). All products contain no more than 0.3% Delta-9 THC on a dry weight basis and are derived from legally cultivated, licensed hemp."

    static let legalDisclaimer = "All products are hemp-derived THCA products containing no more than 0.3% Delta-9 THC on a dry weight basis, in compliance with the 2018 Agriculture Improvement Act (Federal Farm Bill). This product has not been analyzed or approved by the FDA. For use only by adults 21 years of age and older. Keep out of reach of children and pets."

    static let hawkImage = "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/swco5gs1d6k8wvvhe3pgd"

    enum Mascot {
        static let name = "Atlanta Hawk"
        static let location = "Atlanta, GA"
        static let symbolism = "Precision, Quality, Excellence"
        static let bio = "Meet our Atlanta Hawk, the majestic guardian of premium cannabis in the heart of Georgia. With keen eyes for quality and wings that soar above the competition, this powerful bird of prey represents our commitment to delivering the finest cannabis products to Atlanta and beyond."
    }

    /// Long-form Atlanta editorial shown on the home screen.
    static let atlantaBiography: [String] = [
        "Atlanta is a city that captivates the soul. From the moment you experience its warm Southern hospitality to the vibrant energy that pulses through its tree-lined streets, Atlanta offers an unmatched blend of historic charm and modern sophistication that makes it one of America's most beautiful cities.",
        "The city's stunning skyline rises majestically above a canopy of towering oaks and dogwoods, earning Atlanta its nickname \"The City in a Forest.\" Whether you are strolling through the artistic corridors of the High Museum, exploring the bustling markets of Ponce City Market, or enjoying the scenic beauty of Piedmont Park, Atlanta's natural beauty and architectural marvels create an atmosphere unlike anywhere else.",
        "Atlanta's culture is as rich and diverse as its landscape. This is the birthplace of civil rights, the home of world-class cuisine, and a hub for music that has shaped generations. From the soulful sounds of hip-hop born in its neighborhoods to the elegant symphony performances at the Fox Theatre, Atlanta's cultural tapestry weaves together tradition and innovation in the most beautiful way.",
        "The vibe here is infectious - a perfect blend of laid-back Southern charm and metropolitan energy. People gather in cozy coffee shops in Virginia-Highland, celebrate at rooftop bars overlooking the city, and connect in the eclectic neighborhoods that each tell their own unique story. Atlanta embraces everyone with open arms and genuine warmth."
    ]

    static let cannabisFreedom: [String] = [
        "Georgia has embraced a progressive approach to cannabis, with medical marijuana now legal and accessible to qualified patients. Atlanta leads the way in creating a welcoming, regulated environment where patients can access quality cannabis products safely and legally. This milestone represents not just policy change, but Atlanta's continued commitment to health, wellness, and personal freedom.",
        "In this beautiful city where tradition meets progress, cannabis legalization has opened doors to new opportunities for wellness, community, and economic growth. Atlanta's cannabis culture reflects the city itself - diverse, welcoming, and forward-thinking, creating a space where everyone can find what they need in a safe, legal, and beautiful environment.",
        "From premium flower grown with Georgia's rich soil to innovative edibles and pre-rolls, we bring you the finest cannabis products available via shipping and delivery only. We are proud to serve Atlanta's cannabis community with the same warmth and excellence that defines this incredible city."
    ]
}
