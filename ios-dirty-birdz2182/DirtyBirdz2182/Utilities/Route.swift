import Foundation

/// Type-safe push destinations shared by every tab's navigation stack.
nonisolated enum Route: Hashable, Sendable {
    case product(String)
    case category(String)
    case cart
    case checkout
    case orderConfirmation(String)
    case orderDetail(String)
    case bulkOrder
    case pointsHistory
    case addresses
    case terms
    case privacy
    case support
}
