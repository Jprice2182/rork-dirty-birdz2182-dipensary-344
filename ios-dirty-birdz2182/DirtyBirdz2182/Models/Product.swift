import Foundation

nonisolated struct ProductVariant: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let name: String
    let weight: String
    let price: Double
}

nonisolated struct Product: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let name: String
    let category: String
    let thc: Double
    let cbd: Double
    let price: Double
    let image: String
    let description: String
    let effects: [String]
    let featured: Bool
    var weight: String?
    var count: String?
    var strain: String?
    var rating: Double?
    var variants: [ProductVariant]?

    /// Short line under the product name: weight for flower, count for edibles.
    var subtitle: String {
        weight ?? count ?? ""
    }
}

nonisolated struct ProductCategory: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let name: String
    let icon: String
    var parentCategory: String?
}

nonisolated struct CartItem: Identifiable, Codable, Hashable, Sendable {
    let productID: String
    var variantID: String?
    var quantity: Int
    var addedAt: Date

    /// Stable identity combining product and variant so variants stack separately.
    var id: String { "\(productID)#\(variantID ?? "base")" }
}

nonisolated struct OrderLineItem: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let name: String
    let price: Double
    let quantity: Int
    var variantName: String?
}

nonisolated enum PaymentMethod: String, Codable, Hashable, Sendable, CaseIterable {
    case card
    case cash

    var title: String {
        switch self {
        case .card: "Credit / Debit Card"
        case .cash: "Cash on Delivery"
        }
    }

    var systemImage: String {
        switch self {
        case .card: "creditcard.fill"
        case .cash: "banknote.fill"
        }
    }
}

nonisolated enum OrderStatus: String, Codable, Hashable, Sendable {
    case pending
    case confirmed
    case preparing
    case outForDelivery = "out_for_delivery"
    case delivered
    case cancelled
    case refundRequested = "refund_requested"
    case refundProcessing = "refund_processing"
    case refunded

    var label: String {
        switch self {
        case .pending: "Pending"
        case .confirmed: "Confirmed"
        case .preparing: "Preparing"
        case .outForDelivery: "Out for Delivery"
        case .delivered: "Delivered"
        case .cancelled: "Cancelled"
        case .refundRequested: "Refund Requested"
        case .refundProcessing: "Refund Processing"
        case .refunded: "Refunded"
        }
    }

    var systemImage: String {
        switch self {
        case .pending: "clock.fill"
        case .confirmed: "checkmark.seal.fill"
        case .preparing: "shippingbox.fill"
        case .outForDelivery: "truck.box.fill"
        case .delivered: "checkmark.circle.fill"
        case .cancelled: "xmark.circle.fill"
        case .refundRequested, .refundProcessing: "arrow.uturn.backward.circle.fill"
        case .refunded: "dollarsign.circle.fill"
        }
    }

    /// Ordered pipeline used by the progress tracker.
    static let deliveryPipeline: [OrderStatus] = [.confirmed, .preparing, .outForDelivery, .delivered]
}

nonisolated struct RefundInfo: Codable, Hashable, Sendable {
    let refundID: String
    let requestedAt: Date
    var processedAt: Date?
    var completedAt: Date?
    let amount: Double
    var reason: String?
    let refundMethod: String
    let estimatedCompletionDate: Date
}

nonisolated struct Order: Identifiable, Codable, Hashable, Sendable {
    let id: String
    var items: [OrderLineItem]
    var subtotal: Double
    var deliveryFee: Double
    var tax: Double
    var tip: Double
    var discount: Double
    var pointsRedeemed: Int
    var total: Double
    var status: OrderStatus
    var createdAt: Date
    var estimatedDelivery: Date
    var deliveryAddress: String
    var paymentMethod: PaymentMethod
    var cardLast4: String?
    var promoCode: String?
    var driverName: String?
    var isRated: Bool
    var refundEligibleUntil: Date?
    var refundInfo: RefundInfo?

    var shortID: String { String(id.suffix(8)).uppercased() }
    var pointsEarned: Int { Int(total.rounded(.down)) }
}

nonisolated struct Address: Identifiable, Codable, Hashable, Sendable {
    var id: UUID = UUID()
    var street: String
    var city: String
    var state: String
    var zipCode: String

    var formatted: String { "\(street), \(city), \(state) \(zipCode)" }
}

nonisolated struct PointsTransaction: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let isEarned: Bool
    let amount: Int
    let detail: String
    let date: Date
}

nonisolated struct NotificationPreferences: Codable, Hashable, Sendable {
    var newFlower = true
    var newEdibles = true
    var newPreRolls = true
    var promotions = true
    var orderUpdates = true
    var refundUpdates = true
    var birthdayPromotions = true
}
