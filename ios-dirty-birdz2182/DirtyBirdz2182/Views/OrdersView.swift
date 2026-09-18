import SwiftUI

/// Order history split into active deliveries and past orders.
struct OrdersView: View {
    @Environment(OrderStore.self) private var orders

    @State private var path: [Route] = []

    var body: some View {
        NavigationStack(path: $path) {
            Group {
                if orders.orders.isEmpty {
                    EmptyStateView(
                        systemImage: "bag",
                        title: "No orders yet",
                        message: "When you place an order it'll appear here so you can track it in real time."
                    )
                    .frame(maxHeight: .infinity)
                    .background(Theme.background.ignoresSafeArea())
                } else {
                    list
                }
            }
            .navigationTitle("Orders")
            .toolbarBackground(Theme.background, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    CartToolbarButton { path.append(.cart) }
                }
            }
            .navigationDestination(for: Route.self) { RouteView(route: $0, path: $path) }
        }
        .tint(Theme.primary)
    }

    private var list: some View {
        ScrollView {
            VStack(spacing: 14) {
                if !orders.activeOrders.isEmpty {
                    SectionHeader(title: "Active", subtitle: "Deliveries on the way")
                    ForEach(orders.activeOrders) { order in
                        orderCard(order)
                    }
                }

                if !orders.pastOrders.isEmpty {
                    SectionHeader(title: "Past Orders")
                        .padding(.top, orders.activeOrders.isEmpty ? 0 : 8)
                    ForEach(orders.pastOrders) { order in
                        orderCard(order)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
    }

    private func orderCard(_ order: Order) -> some View {
        Button {
            Haptics.tap()
            path.append(.orderDetail(order.id))
        } label: {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Order #\(order.shortID)")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundStyle(Theme.text)
                        Text(order.createdAt, format: .dateTime.month().day().hour().minute())
                            .font(.system(size: 12))
                            .foregroundStyle(Theme.subtext)
                    }
                    Spacer(minLength: 0)
                    StatusBadge(status: order.status)
                }

                Text(order.items.map { "\($0.quantity)× \($0.name)" }.joined(separator: ", "))
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)
                    .lineLimit(2)
                    .frame(maxWidth: .infinity, alignment: .leading)

                Divider().overlay(Theme.border)

                HStack {
                    Label("\(order.items.reduce(0) { $0 + $1.quantity }) items", systemImage: "shippingbox")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.subtext)
                    Spacer()
                    Text(order.total.currency)
                        .font(.system(size: 17, weight: .bold))
                        .foregroundStyle(Theme.primary)
                }
            }
            .cardSurface(padding: 16)
        }
        .buttonStyle(PressableCardStyle())
    }
}

/// Colored pill showing an order's current status.
struct StatusBadge: View {
    let status: OrderStatus

    private var tint: Color {
        switch status {
        case .delivered: Theme.primary
        case .cancelled: Theme.error
        case .refunded, .refundProcessing, .refundRequested: Theme.warning
        case .outForDelivery: Theme.secondary
        default: Theme.subtext
        }
    }

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: status.systemImage)
                .font(.system(size: 10, weight: .bold))
            Text(status.label)
                .font(.system(size: 11, weight: .bold))
        }
        .foregroundStyle(tint)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(tint.opacity(0.15), in: .capsule)
    }
}
