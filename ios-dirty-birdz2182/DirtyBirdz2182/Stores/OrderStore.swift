import Foundation
import Observation

/// Everything needed to create an order from the checkout screen.
nonisolated struct OrderDraft: Sendable {
    var items: [OrderLineItem]
    var subtotal: Double
    var deliveryFee: Double
    var tax: Double
    var tip: Double
    var discount: Double
    var pointsRedeemed: Int
    var total: Double
    var paymentMethod: PaymentMethod
    var cardLast4: String?
    var promoCode: String?
    var deliveryAddress: String
}

/// Order history, simulated fulfilment progress and the refund lifecycle.
@Observable
final class OrderStore {
    private static let storageKey = "order-storage"

    private(set) var orders: [Order] = []

    private static let driverNames = ["Marcus T.", "Jayda R.", "Devin P.", "Simone A.", "Andre K."]

    init() {
        orders = Storage.load([Order].self, key: Self.storageKey) ?? []
    }

    private func persist() {
        Storage.save(orders, key: Self.storageKey)
    }

    // MARK: - Creation

    func createOrder(from draft: OrderDraft) -> Order {
        let refundDeadline = Calendar.current.date(
            byAdding: .hour,
            value: AppInfo.RefundPolicy.timeLimitHours,
            to: Date()
        )

        let order = Order(
            id: "order_\(Int(Date().timeIntervalSince1970))_\(UUID().uuidString.prefix(6))",
            items: draft.items,
            subtotal: draft.subtotal,
            deliveryFee: draft.deliveryFee,
            tax: draft.tax,
            tip: draft.tip,
            discount: draft.discount,
            pointsRedeemed: draft.pointsRedeemed,
            total: draft.total,
            status: .confirmed,
            createdAt: Date(),
            estimatedDelivery: Date().addingTimeInterval(30 * 60),
            deliveryAddress: draft.deliveryAddress,
            paymentMethod: draft.paymentMethod,
            cardLast4: draft.cardLast4,
            promoCode: draft.promoCode,
            driverName: Self.driverNames.randomElement(),
            isRated: false,
            refundEligibleUntil: refundDeadline
        )

        orders.insert(order, at: 0)
        persist()
        return order
    }

    func order(id: String) -> Order? {
        orders.first { $0.id == id }
    }

    // MARK: - Status

    func updateStatus(id: String, status: OrderStatus) {
        guard let index = orders.firstIndex(where: { $0.id == id }) else { return }
        orders[index].status = status
        if status == .delivered, orders[index].refundEligibleUntil == nil {
            orders[index].refundEligibleUntil = Calendar.current.date(
                byAdding: .hour,
                value: AppInfo.RefundPolicy.timeLimitHours,
                to: Date()
            )
        }
        persist()
    }

    /// Advances a confirmed order one step along the delivery pipeline.
    func advance(id: String) {
        guard let order = order(id: id),
              let index = OrderStatus.deliveryPipeline.firstIndex(of: order.status),
              index + 1 < OrderStatus.deliveryPipeline.count
        else { return }
        updateStatus(id: id, status: OrderStatus.deliveryPipeline[index + 1])
    }

    func cancel(id: String) {
        guard let order = order(id: id),
              [.pending, .confirmed, .preparing].contains(order.status)
        else { return }
        updateStatus(id: id, status: .cancelled)
    }

    func markAsRated(id: String) {
        guard let index = orders.firstIndex(where: { $0.id == id }) else { return }
        orders[index].isRated = true
        persist()
    }

    // MARK: - Refunds

    func isRefundEligible(id: String) -> Bool {
        guard let order = order(id: id), order.status == .delivered else { return false }
        guard let deadline = order.refundEligibleUntil else { return false }
        return Date() <= deadline
    }

    func refundHoursRemaining(id: String) -> Int {
        guard let order = order(id: id), let deadline = order.refundEligibleUntil else { return 0 }
        let remaining = deadline.timeIntervalSince(Date())
        return max(0, Int(remaining / 3600))
    }

    @discardableResult
    func requestRefund(id: String, reason: String?) -> Bool {
        guard isRefundEligible(id: id),
              let index = orders.firstIndex(where: { $0.id == id })
        else { return false }

        let order = orders[index]
        orders[index].status = .refundRequested
        orders[index].refundInfo = RefundInfo(
            refundID: "refund_\(UUID().uuidString.prefix(8))",
            requestedAt: Date(),
            amount: order.total,
            reason: reason?.isEmpty == false ? reason : "Customer requested refund",
            refundMethod: order.paymentMethod == .card ? "original_payment" : "store_credit",
            estimatedCompletionDate: Date().addingTimeInterval(24 * 3600)
        )
        persist()
        return true
    }

    func processRefund(id: String) {
        guard let index = orders.firstIndex(where: { $0.id == id }),
              orders[index].status == .refundRequested
        else { return }
        orders[index].status = .refundProcessing
        orders[index].refundInfo?.processedAt = Date()
        persist()
    }

    func completeRefund(id: String) {
        guard let index = orders.firstIndex(where: { $0.id == id }),
              orders[index].status == .refundProcessing
        else { return }
        orders[index].status = .refunded
        orders[index].refundInfo?.completedAt = Date()
        persist()
    }

    func clearAll() {
        orders.removeAll()
        persist()
    }

    // MARK: - Filtering

    var activeOrders: [Order] {
        orders.filter { [.pending, .confirmed, .preparing, .outForDelivery].contains($0.status) }
    }

    var pastOrders: [Order] {
        orders.filter { ![.pending, .confirmed, .preparing, .outForDelivery].contains($0.status) }
    }
}
