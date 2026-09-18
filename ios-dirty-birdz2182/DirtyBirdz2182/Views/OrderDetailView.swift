import SwiftUI

/// Order detail: live status tracker, driver info, totals, refund and rating flows.
struct OrderDetailView: View {
    let orderID: String
    @Binding var path: [Route]

    @Environment(OrderStore.self) private var orders
    @Environment(UserStore.self) private var user

    @State private var showRefundSheet = false
    @State private var showRateSheet = false
    @State private var showCancelAlert = false

    private var order: Order? { orders.order(id: orderID) }

    var body: some View {
        Group {
            if let order {
                content(order)
            } else {
                EmptyStateView(
                    systemImage: "questionmark.circle",
                    title: "Order not found",
                    message: "We couldn't locate this order."
                )
                .background(Theme.background.ignoresSafeArea())
            }
        }
        .navigationTitle("Order Details")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func content(_ order: Order) -> some View {
        ScrollView {
            VStack(spacing: 16) {
                headerCard(order)

                if OrderStatus.deliveryPipeline.contains(order.status) {
                    OrderStatusTracker(status: order.status)
                        .cardSurface()
                }

                if let refund = order.refundInfo {
                    refundCard(order, refund)
                }

                driverCard(order)
                itemsCard(order)
                totalsCard(order)
                actions(order)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .sheet(isPresented: $showRefundSheet) {
            RefundRequestSheet(orderID: orderID)
        }
        .sheet(isPresented: $showRateSheet) {
            RateOrderSheet(orderID: orderID)
        }
        .alert("Cancel this order?", isPresented: $showCancelAlert) {
            Button("Keep order", role: .cancel) {}
            Button("Cancel order", role: .destructive) {
                Haptics.warning()
                orders.cancel(id: orderID)
            }
        } message: {
            Text("Your order will be cancelled and you won't be charged.")
        }
    }

    // MARK: - Cards

    private func headerCard(_ order: Order) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text("Order #\(order.shortID)")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(Theme.text)
                    Text(order.createdAt, format: .dateTime.weekday(.wide).month().day().hour().minute())
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.subtext)
                }
                Spacer(minLength: 0)
                StatusBadge(status: order.status)
            }

            if [.confirmed, .preparing, .outForDelivery].contains(order.status) {
                Label {
                    Text("Arriving around ") + Text(order.estimatedDelivery, style: .time).bold()
                } icon: {
                    Image(systemName: "clock.fill")
                }
                .font(.system(size: 14))
                .foregroundStyle(Theme.primary)
            }

            Label(order.deliveryAddress, systemImage: "mappin.and.ellipse")
                .font(.system(size: 13))
                .foregroundStyle(Theme.subtext)
        }
        .cardSurface()
    }

    private func driverCard(_ order: Order) -> some View {
        Group {
            if let driver = order.driverName,
               [.confirmed, .preparing, .outForDelivery, .delivered].contains(order.status) {
                HStack(spacing: 14) {
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 42))
                        .foregroundStyle(Theme.primary)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(driver)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundStyle(Theme.text)
                        Text("Your delivery driver")
                            .font(.system(size: 12))
                            .foregroundStyle(Theme.subtext)
                    }
                    Spacer(minLength: 0)
                    if let url = URL(string: "tel://\(AppInfo.Support.phone.filter(\.isNumber))") {
                        Link(destination: url) {
                            Image(systemName: "phone.fill")
                                .font(.system(size: 15))
                                .foregroundStyle(Theme.background)
                                .frame(width: 44, height: 44)
                                .background(Theme.primary, in: .circle)
                        }
                        .accessibilityLabel("Call support")
                    }
                }
                .cardSurface(padding: 16)
            }
        }
    }

    private func itemsCard(_ order: Order) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Items")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.text)

            ForEach(order.items) { item in
                HStack(alignment: .top, spacing: 12) {
                    if let product = Catalog.product(id: String(item.id.split(separator: "#").first ?? "")) {
                        RemoteImage(urlString: product.image, height: 54, cornerRadius: 10)
                            .frame(width: 54)
                    }
                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.name)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(Theme.text)
                        if let variant = item.variantName {
                            Text(variant)
                                .font(.system(size: 12))
                                .foregroundStyle(Theme.primary)
                        }
                        Text("Qty \(item.quantity)")
                            .font(.system(size: 12))
                            .foregroundStyle(Theme.subtext)
                    }
                    Spacer(minLength: 0)
                    Text((item.price * Double(item.quantity)).currency)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Theme.text)
                }
            }
        }
        .cardSurface()
    }

    private func totalsCard(_ order: Order) -> some View {
        VStack(spacing: 8) {
            row("Subtotal", order.subtotal.currency)
            if order.discount > 0 { row("Discounts", "-\(order.discount.currency)", tint: Theme.primary) }
            if order.pointsRedeemed > 0 { row("Points used", "\(order.pointsRedeemed) pts", tint: Theme.primary) }
            row("Delivery", order.deliveryFee == 0 ? "FREE" : order.deliveryFee.currency)
            row("Tax", order.tax.currency)
            if order.tip > 0 { row("Tip", order.tip.currency) }
            Divider().overlay(Theme.border)
            HStack {
                Text("Total")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(Theme.text)
                Spacer()
                Text(order.total.currency)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(Theme.primary)
            }
            HStack(spacing: 6) {
                Image(systemName: order.paymentMethod.systemImage)
                    .font(.system(size: 12))
                Text(order.paymentMethod == .card
                     ? "Visa ending \(order.cardLast4 ?? "4242")"
                     : order.paymentMethod.title)
                Spacer()
            }
            .font(.system(size: 12))
            .foregroundStyle(Theme.subtext)

            if order.paymentMethod == .cash, order.status != .delivered {
                Label("MUST SHOW ID BEFORE HANDING OVER MERCHANDISE", systemImage: "person.text.rectangle.fill")
                    .font(.system(size: 11, weight: .heavy))
                    .foregroundStyle(Theme.warning)
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Theme.warning.opacity(0.12), in: .rect(cornerRadius: 8))
            }
        }
        .cardSurface()
    }

    private func refundCard(_ order: Order, _ refund: RefundInfo) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Refund \(order.status == .refunded ? "completed" : "in progress")", systemImage: "arrow.uturn.backward.circle.fill")
                .font(.system(size: 15, weight: .bold))
                .foregroundStyle(Theme.warning)

            row("Amount", refund.amount.currency)
            row("Method", refund.refundMethod == "original_payment" ? "Original payment" : "Store credit")
            if let reason = refund.reason {
                Text(reason)
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)
            }
            Text(order.status == .refunded
                 ? "Funds have been returned."
                 : "Processing time: \(AppInfo.RefundPolicy.processingTime)")
                .font(.system(size: 12))
                .foregroundStyle(Theme.subtext)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.warning.opacity(0.1), in: .rect(cornerRadius: 16))
        .overlay {
            RoundedRectangle(cornerRadius: 16).stroke(Theme.warning.opacity(0.3), lineWidth: 1)
        }
    }

    private func row(_ label: String, _ value: String, tint: Color = Theme.text) -> some View {
        HStack {
            Text(label).font(.system(size: 14)).foregroundStyle(Theme.subtext)
            Spacer()
            Text(value).font(.system(size: 14, weight: .semibold)).foregroundStyle(tint)
        }
    }

    // MARK: - Actions

    @ViewBuilder
    private func actions(_ order: Order) -> some View {
        VStack(spacing: 10) {
            // Simulated fulfilment so the tracker can be exercised end to end.
            if OrderStatus.deliveryPipeline.contains(order.status), order.status != .delivered {
                Button("Advance delivery status") {
                    Haptics.tap()
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                        orders.advance(id: orderID)
                    }
                }
                .buttonStyle(SecondaryButtonStyle())
            }

            if [.pending, .confirmed, .preparing].contains(order.status) {
                Button("Cancel order") { showCancelAlert = true }
                    .buttonStyle(SecondaryButtonStyle())
                    .foregroundStyle(Theme.error)
            }

            if order.status == .delivered && !order.isRated {
                Button("Rate your order") {
                    Haptics.tap()
                    showRateSheet = true
                }
                .buttonStyle(PrimaryButtonStyle())
            }

            if orders.isRefundEligible(id: orderID) {
                VStack(spacing: 6) {
                    Button("Request a refund") {
                        Haptics.tap()
                        showRefundSheet = true
                    }
                    .buttonStyle(SecondaryButtonStyle())

                    Text("\(AppInfo.RefundPolicy.description) • \(orders.refundHoursRemaining(id: orderID))h remaining")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.subtext)
                }
            }
        }
    }
}

/// Horizontal step tracker for the delivery pipeline.
struct OrderStatusTracker: View {
    let status: OrderStatus

    private var currentIndex: Int {
        OrderStatus.deliveryPipeline.firstIndex(of: status) ?? 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Delivery Progress")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.text)

            HStack(spacing: 0) {
                ForEach(Array(OrderStatus.deliveryPipeline.enumerated()), id: \.element) { index, step in
                    let isDone = index <= currentIndex

                    VStack(spacing: 8) {
                        ZStack {
                            Circle()
                                .fill(isDone ? Theme.primary : Theme.border)
                                .frame(width: 34, height: 34)
                            Image(systemName: step.systemImage)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundStyle(isDone ? Theme.background : Theme.subtext)
                        }
                        .scaleEffect(index == currentIndex ? 1.1 : 1)

                        Text(step.label)
                            .font(.system(size: 10, weight: isDone ? .bold : .regular))
                            .foregroundStyle(isDone ? Theme.text : Theme.subtext)
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: .infinity)
                    }

                    if index < OrderStatus.deliveryPipeline.count - 1 {
                        Rectangle()
                            .fill(index < currentIndex ? Theme.primary : Theme.border)
                            .frame(height: 2)
                            .offset(y: -17)
                    }
                }
            }
            .animation(.spring(response: 0.45, dampingFraction: 0.8), value: currentIndex)
        }
    }
}

/// Refund request sheet with reason capture and simulated processing.
struct RefundRequestSheet: View {
    let orderID: String

    @Environment(OrderStore.self) private var orders
    @Environment(\.dismiss) private var dismiss

    @State private var reason = ""
    @State private var submitted = false

    private let reasons = [
        "Product quality issue",
        "Wrong item delivered",
        "Order never arrived",
        "Damaged packaging",
        "Other"
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    if submitted {
                        VStack(spacing: 14) {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 54))
                                .foregroundStyle(Theme.primary)
                            Text("Refund requested")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundStyle(Theme.text)
                            Text("We're processing your refund. Expect it back within \(AppInfo.RefundPolicy.processingTime).")
                                .font(.system(size: 14))
                                .foregroundStyle(Theme.subtext)
                                .multilineTextAlignment(.center)
                            Button("Done") { dismiss() }
                                .buttonStyle(PrimaryButtonStyle())
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, 40)
                    } else {
                        Text(AppInfo.RefundPolicy.description)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(Theme.primary)

                        Text("Tell us what went wrong so we can make it right.")
                            .font(.system(size: 14))
                            .foregroundStyle(Theme.subtext)

                        ForEach(reasons, id: \.self) { option in
                            Button {
                                Haptics.select()
                                reason = option
                            } label: {
                                HStack {
                                    Image(systemName: reason == option ? "largecircle.fill.circle" : "circle")
                                        .foregroundStyle(reason == option ? Theme.primary : Theme.border)
                                    Text(option)
                                        .font(.system(size: 15))
                                        .foregroundStyle(Theme.text)
                                    Spacer()
                                }
                                .padding(.vertical, 6)
                            }
                            .buttonStyle(.plain)
                        }

                        Button("Submit refund request") {
                            if orders.requestRefund(id: orderID, reason: reason) {
                                Haptics.success()
                                withAnimation { submitted = true }
                                simulateProcessing()
                            }
                        }
                        .buttonStyle(PrimaryButtonStyle(isEnabled: !reason.isEmpty))
                        .disabled(reason.isEmpty)
                        .padding(.top, 8)
                    }
                }
                .padding(20)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Request Refund")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close") { dismiss() }
                }
            }
        }
        .presentationDetents([.large])
        .presentationContentInteraction(.scrolls)
    }

    /// Moves the refund through processing → completed, mirroring the backend timings.
    private func simulateProcessing() {
        Task {
            try? await Task.sleep(for: .seconds(2))
            orders.processRefund(id: orderID)
            try? await Task.sleep(for: .seconds(5))
            orders.completeRefund(id: orderID)
        }
    }
}

/// Post-delivery rating sheet for the order and driver.
struct RateOrderSheet: View {
    let orderID: String

    @Environment(OrderStore.self) private var orders
    @Environment(UserStore.self) private var user
    @Environment(\.dismiss) private var dismiss

    @State private var rating = 5
    @State private var comment = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Text("How was your delivery?")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundStyle(Theme.text)
                        .padding(.top, 12)

                    RatingPicker(rating: $rating)

                    TextField("Add a comment (optional)", text: $comment, axis: .vertical)
                        .lineLimit(3...6)
                        .foregroundStyle(Theme.text)
                        .padding(12)
                        .background(Theme.card, in: .rect(cornerRadius: 12))
                        .overlay {
                            RoundedRectangle(cornerRadius: 12).stroke(Theme.border, lineWidth: 1)
                        }

                    Button("Submit rating") {
                        user.setAppRating(rating)
                        if !comment.trimmingCharacters(in: .whitespaces).isEmpty {
                            user.addReview(text: comment, rating: rating)
                        }
                        orders.markAsRated(id: orderID)
                        Haptics.success()
                        dismiss()
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }
                .padding(20)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Rate Order")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Skip") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationContentInteraction(.scrolls)
    }
}
