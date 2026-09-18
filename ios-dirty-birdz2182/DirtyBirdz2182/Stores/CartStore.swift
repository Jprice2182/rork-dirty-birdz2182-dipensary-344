import Foundation
import Observation

/// Result of the "buy 2 eighths, get the 3rd for $1" promotion.
nonisolated struct EighthsPromotion: Sendable {
    var eligible = false
    var totalEighths = 0
    var discountedEighths = 0
    var savings: Double = 0
}

/// Shopping cart with variant-aware line items and the eighths promotion applied.
@Observable
final class CartStore {
    private static let storageKey = "cart-storage"

    private(set) var items: [CartItem] = []

    init() {
        items = Storage.load([CartItem].self, key: Self.storageKey) ?? []
        pruneInvalidItems()
    }

    private func persist() {
        Storage.save(items, key: Self.storageKey)
    }

    /// Drops items whose product or variant no longer exists in the catalog.
    private func pruneInvalidItems() {
        let valid = items.filter { item in
            guard let product = Catalog.product(id: item.productID), item.quantity > 0 else { return false }
            if let variantID = item.variantID, product.variants != nil {
                return product.variants?.contains { $0.id == variantID } ?? false
            }
            return true
        }
        if valid.count != items.count {
            items = valid
            persist()
        }
    }

    // MARK: - Mutations

    @discardableResult
    func add(productID: String, variantID: String? = nil, quantity: Int = 1) -> Bool {
        guard let product = Catalog.product(id: productID) else { return false }
        if let variantID, product.variants != nil {
            guard product.variants?.contains(where: { $0.id == variantID }) == true else { return false }
        }

        if let index = items.firstIndex(where: { $0.productID == productID && $0.variantID == variantID }) {
            items[index].quantity += quantity
        } else {
            items.append(CartItem(productID: productID, variantID: variantID, quantity: quantity, addedAt: Date()))
        }
        persist()
        return true
    }

    func setQuantity(_ quantity: Int, productID: String, variantID: String?) {
        guard let index = items.firstIndex(where: { $0.productID == productID && $0.variantID == variantID }) else { return }
        if quantity <= 0 {
            items.remove(at: index)
        } else {
            items[index].quantity = quantity
        }
        persist()
    }

    func remove(productID: String, variantID: String?) {
        items.removeAll { $0.productID == productID && $0.variantID == variantID }
        persist()
    }

    func clear() {
        items.removeAll()
        persist()
    }

    // MARK: - Derived values

    var itemCount: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    var isEmpty: Bool { items.isEmpty }

    func unitPrice(for item: CartItem) -> Double {
        Catalog.price(productID: item.productID, variantID: item.variantID)
    }

    func lineTotal(for item: CartItem) -> Double {
        unitPrice(for: item) * Double(item.quantity)
    }

    func displayName(for item: CartItem) -> String {
        Catalog.displayName(productID: item.productID, variantID: item.variantID)
    }

    /// Sum of line items before any promotion.
    var grossSubtotal: Double {
        items.reduce(0) { $0 + lineTotal(for: $1) }
    }

    /// Subtotal after the automatic eighths promotion discount.
    var subtotal: Double {
        ((grossSubtotal - eighthsPromotion.savings) * 100).rounded() / 100
    }

    /// Every third eighth in the cart drops to $1.
    var eighthsPromotion: EighthsPromotion {
        let totalEighths = items
            .filter { isEighth($0) }
            .reduce(0) { $0 + $1.quantity }

        guard totalEighths >= AppInfo.EighthsPromotion.minimumQuantity else {
            return EighthsPromotion(eligible: false, totalEighths: totalEighths)
        }

        let discounted = totalEighths / 3
        guard discounted > 0 else {
            return EighthsPromotion(eligible: false, totalEighths: totalEighths)
        }

        let regularPrice = 20.0
        let savings = Double(discounted) * (regularPrice - AppInfo.EighthsPromotion.discountPrice)
        return EighthsPromotion(
            eligible: true,
            totalEighths: totalEighths,
            discountedEighths: discounted,
            savings: savings
        )
    }

    private func isEighth(_ item: CartItem) -> Bool {
        guard let product = Catalog.product(id: item.productID), product.category == "1" else { return false }
        guard let variantID = item.variantID else { return product.weight == "3.5g" }
        return variantID == "eighth"
    }

    var deliveryFee: Double {
        subtotal >= AppInfo.freeDeliveryMinimum ? 0 : AppInfo.deliveryFee
    }

    var amountUntilFreeDelivery: Double {
        max(0, AppInfo.freeDeliveryMinimum - subtotal)
    }
}
