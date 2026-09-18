import Foundation

/// The product catalog plus category metadata and lookup helpers.
nonisolated enum Catalog {

    // MARK: - Variants

    static let flowerVariants: [ProductVariant] = [
        ProductVariant(id: "eighth", name: "Eighth (1/8 oz)", weight: "3.5g", price: 20),
        ProductVariant(id: "quarter", name: "Quarter (1/4 oz)", weight: "7g", price: 40),
        ProductVariant(id: "half", name: "Half (1/2 oz)", weight: "14g", price: 60),
        ProductVariant(id: "oz", name: "Oz (1 oz)", weight: "28g", price: 85)
    ]

    static let classicPreRollVariants: [ProductVariant] = [
        ProductVariant(id: "single", name: "1 Pre-Roll", weight: "1g", price: 8),
        ProductVariant(id: "double", name: "2 Pre-Rolls", weight: "2g", price: 12),
        ProductVariant(id: "triple", name: "3 Pre-Rolls", weight: "3g", price: 15)
    ]

    static let infusedPreRollVariants: [ProductVariant] = [
        ProductVariant(id: "single", name: "1 Infused Pre-Roll", weight: "1g", price: 15),
        ProductVariant(id: "double", name: "2 Infused Pre-Rolls", weight: "2g", price: 25),
        ProductVariant(id: "triple", name: "3 Infused Pre-Rolls", weight: "3g", price: 35)
    ]

    // MARK: - Categories

    static let categories: [ProductCategory] = [
        ProductCategory(id: "1", name: "Flower", icon: "leaf.fill"),
        ProductCategory(id: "1-sativa", name: "Sativa", icon: "sun.max.fill", parentCategory: "1"),
        ProductCategory(id: "1-indica", name: "Indica", icon: "moon.stars.fill", parentCategory: "1"),
        ProductCategory(id: "1-hybrid", name: "Hybrid", icon: "circle.hexagongrid.fill", parentCategory: "1"),
        ProductCategory(id: "2", name: "Edibles", icon: "birthday.cake.fill"),
        ProductCategory(id: "5", name: "Pre-Rolls", icon: "flame.fill")
    ]

    static var mainCategories: [ProductCategory] {
        categories.filter { $0.parentCategory == nil }
    }

    static var flowerStrainCategories: [ProductCategory] {
        categories.filter { $0.parentCategory == "1" }
    }

    static func category(id: String) -> ProductCategory? {
        categories.first { $0.id == id }
    }

    /// Marketing blurb shown on each strain card.
    static func strainDescription(_ name: String) -> String {
        switch name {
        case "Sativa": "Energizing • Creative • Uplifting • Perfect for daytime use"
        case "Indica": "Relaxing • Calming • Sedating • Ideal for evening and sleep"
        default: "Balanced • Versatile • Best of both worlds • Any time of day"
        }
    }

    // MARK: - Products

    static let products: [Product] = [
        // Flower
        Product(
            id: "1", name: "Pineapple Express", category: "1", thc: 22, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/o8c1rj5oscr9bvaqq9iwf",
            description: "Pineapple Express is a sativa-dominant hybrid strain known for its tropical, fruity aroma and energizing effects. This strain delivers a burst of creativity and euphoria with sweet pineapple flavors.",
            effects: ["Relaxed", "Sleepy", "Happy"], featured: true,
            weight: "3.5g", strain: "Hybrid", rating: 4.8, variants: flowerVariants
        ),
        Product(
            id: "2", name: "Purple Punch", category: "1", thc: 18, cbd: 0.2, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/icqz3coz9l1mm7mm0o5jt",
            description: "Purple Punch is an indica-dominant hybrid cross between Larry OG and Granddaddy Purple. Known for its sweet grape and berry flavors, it delivers relaxing and sedating effects.",
            effects: ["Creative", "Euphoric", "Relaxed"], featured: true,
            weight: "3.5g", strain: "Indica", rating: 4.6, variants: flowerVariants
        ),
        Product(
            id: "3", name: "Strawberry Cough", category: "1", thc: 25, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/8d6mnlr6s7w4r6m67yzks",
            description: "Strawberry Cough is a legendary sativa strain renowned for its sweet strawberry aroma and smooth, uplifting effects. This premium flower features dense, frosty buds with vibrant colors and delivers an energizing cerebral high perfect for daytime use.",
            effects: ["Uplifting", "Creative", "Energetic"], featured: true,
            weight: "3.5g", strain: "Sativa", rating: 4.7, variants: flowerVariants
        ),
        Product(
            id: "4", name: "Super Lemon Haze", category: "1", thc: 24, cbd: 0.2, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/5mhcfaflrzpr1uuwfte4n",
            description: "Super Lemon Haze is a sativa-dominant hybrid known for its zesty lemon aroma and energizing effects. This award-winning strain delivers uplifting cerebral effects with a sweet citrus flavor profile.",
            effects: ["Energetic", "Creative", "Uplifting"], featured: true,
            weight: "3.5g", strain: "Sativa", rating: 4.7, variants: flowerVariants
        ),
        Product(
            id: "5", name: "Watermelon Mimosa", category: "1", thc: 21, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/iepmuq4otgzh5ih904kym",
            description: "Watermelon Mimosa is a balanced hybrid strain with sweet watermelon and citrus flavors. This strain provides a perfect balance of relaxation and euphoria, ideal for any time of day.",
            effects: ["Balanced", "Sweet", "Euphoric"], featured: true,
            weight: "3.5g", strain: "Hybrid", rating: 4.8, variants: flowerVariants
        ),
        Product(
            id: "6", name: "Green Crack", category: "1", thc: 23, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/wr2h1vspbwjrx7m5v8fgn",
            description: "Green Crack is a potent sativa strain known for its invigorating mental buzz and energizing effects. It delivers sharp focus and energy with a sweet, fruity flavor profile.",
            effects: ["Energetic", "Focused", "Creative"], featured: true,
            weight: "3.5g", strain: "Sativa", rating: 4.9, variants: flowerVariants
        ),
        Product(
            id: "7", name: "Panama Red", category: "1", thc: 19, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/dum5evymw4vufb8oeos1g",
            description: "Panama Red is a legendary sativa strain known for its uplifting and energetic effects. This classic strain features earthy, spicy flavors with hints of sweetness and delivers a clear-headed, creative high perfect for daytime use.",
            effects: ["Energetic", "Creative", "Uplifting"], featured: true,
            weight: "3.5g", strain: "Sativa", rating: 4.7, variants: flowerVariants
        ),
        Product(
            id: "8", name: "Zkittlez", category: "1", thc: 20, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/3iyrhsoz78ow6xofbs6zq",
            description: "Zkittlez is an indica-dominant hybrid strain known for its fruity, candy-like aroma and flavor profile. This colorful strain delivers a relaxing body high with sweet tropical fruit flavors.",
            effects: ["Relaxed", "Happy", "Euphoric"], featured: true,
            weight: "3.5g", strain: "Indica", rating: 4.8, variants: flowerVariants
        ),
        Product(
            id: "9", name: "Godfather OG", category: "1", thc: 28, cbd: 0.1, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/3ghfgs2u6jx3kyzdl9161",
            description: "Godfather OG is a potent indica strain known as one of the strongest strains available. With deep purple hues and frosty trichomes, this strain delivers powerful sedating effects perfect for nighttime use.",
            effects: ["Relaxed", "Sleepy", "Euphoric"], featured: true,
            weight: "3.5g", strain: "Indica", rating: 4.9, variants: flowerVariants
        ),

        // Edibles
        Product(
            id: "201", name: "Chocolate Bar", category: "2", thc: 100, cbd: 0, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/glbfmpbpgvu50gzazfgvl",
            description: "Our premium chocolate bar contains 100mg THC total (10mg per piece) and is made with organic fair-trade chocolate for a delicious experience.",
            effects: ["Relaxed", "Euphoric", "Happy"], featured: true,
            count: "10 pieces (10mg each)", rating: 4.7
        ),
        Product(
            id: "205", name: "Rice Crispy Treat", category: "2", thc: 100, cbd: 0, price: 18,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uuuc7no9lexpnbbmzad22",
            description: "Classic rice crispy treat infused with premium cannabis extract. A nostalgic favorite with a modern twist, delivering 100mg THC in one delicious treat.",
            effects: ["Nostalgic", "Sweet", "Long-lasting"], featured: true,
            count: "1 treat (100mg)", rating: 4.6
        ),
        Product(
            id: "206", name: "Fruity Rice Crispy Treat", category: "2", thc: 100, cbd: 0, price: 20,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/zx76m8lyfbgsv0a0tlkji",
            description: "Our fruity rice crispy treat combines the classic crunch with vibrant fruit flavors and 100mg THC. A colorful and delicious edible experience.",
            effects: ["Fruity", "Colorful", "Uplifting"], featured: true,
            count: "1 treat (100mg)", rating: 4.8
        ),
        Product(
            id: "207", name: "Cookies and Cream Bar", category: "2", thc: 100, cbd: 0, price: 22,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/n5spqo11lbfx9x8mozolm",
            description: "Indulgent cookies and cream chocolate bar with 100mg THC total. Each piece contains 10mg THC with the perfect balance of chocolate and cookie crumbles.",
            effects: ["Indulgent", "Creamy", "Satisfying"], featured: true,
            count: "10 pieces (10mg each)", rating: 4.9
        ),
        Product(
            id: "208", name: "Brownies", category: "2", thc: 100, cbd: 0, price: 25,
            image: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/84x3ur6ceal8ndub3shdu",
            description: "Rich, fudgy cannabis brownies made with premium chocolate and infused with 100mg THC. A classic edible experience with deep chocolate flavor.",
            effects: ["Rich", "Chocolatey", "Relaxing"], featured: true,
            count: "1 brownie (100mg)", rating: 4.8
        ),

        // Pre-Rolls
        Product(
            id: "500", name: "Classic Pre-Roll", category: "5", thc: 20, cbd: 0, price: 8,
            image: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000",
            description: "Our classic pre-rolls are made with premium flower and rolled to perfection. Ready to smoke convenience with quality you can trust.",
            effects: ["Convenient", "Balanced", "Smooth"], featured: true,
            weight: "1g", strain: "Hybrid", rating: 4.4, variants: classicPreRollVariants
        ),
        Product(
            id: "501", name: "Sativa Pre-Roll Pack", category: "5", thc: 22, cbd: 0, price: 30,
            image: "https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000",
            description: "Three premium sativa pre-rolls perfect for daytime use. Each joint is carefully crafted with high-quality sativa strains for an energizing experience.",
            effects: ["Energetic", "Creative", "Uplifting"], featured: false,
            count: "3 pack (1g each)", strain: "Sativa", rating: 4.6
        ),
        Product(
            id: "502", name: "Indica Pre-Roll Pack", category: "5", thc: 24, cbd: 0, price: 30,
            image: "https://images.unsplash.com/photo-1585828922344-85c9daa264b0?q=80&w=1000",
            description: "Three premium indica pre-rolls ideal for evening relaxation. Made with top-shelf indica strains for deep relaxation and stress relief.",
            effects: ["Relaxed", "Sleepy", "Calm"], featured: true,
            count: "3 pack (1g each)", strain: "Indica", rating: 4.7
        ),
        Product(
            id: "503", name: "Mini Pre-Rolls", category: "5", thc: 18, cbd: 0, price: 20,
            image: "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=1000",
            description: "Perfect portion-controlled mini pre-rolls. Great for microdosing or when you want a shorter session without waste.",
            effects: ["Controlled", "Convenient", "Mild"], featured: false,
            count: "5 pack (0.5g each)", strain: "Hybrid", rating: 4.3
        ),
        Product(
            id: "504", name: "Infused Pre-Roll", category: "5", thc: 35, cbd: 0, price: 15,
            image: "https://images.unsplash.com/photo-1589140915708-20ff586fe767?q=80&w=1000",
            description: "Premium flower pre-roll infused with concentrate for extra potency. Perfect for experienced users looking for enhanced effects.",
            effects: ["Potent", "Enhanced", "Long-lasting"], featured: true,
            weight: "1g", strain: "Hybrid", rating: 4.8, variants: infusedPreRollVariants
        )
    ]

    // MARK: - Lookup

    static var featured: [Product] {
        products.filter(\.featured)
    }

    static func product(id: String) -> Product? {
        products.first { $0.id == id }
    }

    static func variant(productID: String, variantID: String) -> ProductVariant? {
        product(id: productID)?.variants?.first { $0.id == variantID }
    }

    static func price(productID: String, variantID: String?) -> Double {
        guard let product = product(id: productID) else { return 0 }
        if let variantID, let variant = product.variants?.first(where: { $0.id == variantID }) {
            return variant.price
        }
        return product.price
    }

    static func displayName(productID: String, variantID: String?) -> String {
        guard let product = product(id: productID) else { return "Unknown Product" }
        if let variantID, let variant = product.variants?.first(where: { $0.id == variantID }) {
            return "\(product.name) - \(variant.name)"
        }
        return product.name
    }

    /// Resolves a category id — including the virtual strain categories — to its products.
    static func products(categoryID: String) -> [Product] {
        switch categoryID {
        case "1-sativa": products.filter { $0.category == "1" && $0.strain == "Sativa" }
        case "1-indica": products.filter { $0.category == "1" && $0.strain == "Indica" }
        case "1-hybrid": products.filter { $0.category == "1" && $0.strain == "Hybrid" }
        default: products.filter { $0.category == categoryID }
        }
    }

    static func search(_ query: String, categoryID: String?) -> [Product] {
        var results = products
        if let categoryID {
            results = products(categoryID: categoryID)
        }
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return results }
        return results.filter {
            $0.name.localizedStandardContains(trimmed)
                || ($0.strain?.localizedStandardContains(trimmed) ?? false)
                || $0.effects.contains { effect in effect.localizedStandardContains(trimmed) }
        }
    }
}
