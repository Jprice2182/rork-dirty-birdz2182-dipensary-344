import SwiftUI

/// Checkout: address, payment, promo code, points redemption, tip and totals.
struct CheckoutView: View {
    @Binding var path: [Route]

    @Environment(CartStore.self) private var cart
    @Environment(UserStore.self) private var user
    @Environment(OrderStore.self) private var orders

    @State private var paymentMethod: PaymentMethod = .card
    @State private var promoInput = ""
    @State private var appliedPromo: String?
    @State private var promoMessage: String?
    @State private var promoIsError = false
    @State private var tipPercent = 18
    @State private var redeemPoints = false
    @State private var showAddressSheet = false
    @State private var isPlacingOrder = false
    @State private var placementError: String?

    // MARK: - Totals

    private var subtotal: Double { cart.subtotal }

    private var promoDiscount: Double {
        appliedPromo == AppInfo.promoCode ? subtotal * AppInfo.promoDiscount : 0
    }

    /// Points are only redeemable above the minimum and never exceed the order value.
    private var pointsDiscount: Double {
        guard redeemPoints else { return 0 }
        let available = user.redeemableValue
        let maxApplicable = max(0, subtotal - promoDiscount)
        return min(available, maxApplicable)
    }

    private var pointsSpent: Int {
        guard pointsDiscount > 0 else { return 0 }
        return Int((pointsDiscount * AppInfo.pointsPerDollarRedeemed).rounded())
    }

    private var deliveryFee: Double { cart.deliveryFee }

    private var tax: Double {
        max(0, subtotal - promoDiscount - pointsDiscount) * AppInfo.taxRate
    }

    private var tipAmount: Double {
        subtotal * Double(tipPercent) / 100
    }

    private var total: Double {
        max(0, subtotal - promoDiscount - pointsDiscount + deliveryFee + tax + tipAmount)
    }

    private var canPlaceOrder: Bool {
        !cart.isEmpty && user.selectedAddress != nil && !isPlacingOrder
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                addressSection
                paymentSection
                promoSection
                pointsSection
                tipSection
                summarySection

                if let placementError {
                    Label(placementError, systemImage: "exclamationmark.triangle.fill")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(Theme.error)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                Text(AppInfo.legalDisclaimer)
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.subtext.opacity(0.8))
                    .multilineTextAlignment(.center)
                    .padding(.top, 4)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .scrollDismissesKeyboard(.interactively)
        .navigationTitle("Checkout")
        .navigationBarTitleDisplayMode(.inline)
        .safeAreaInset(edge: .bottom) { placeOrderBar }
        .sheet(isPresented: $showAddressSheet) {
            AddressFormSheet()
        }
    }

    // MARK: - Address

    private var addressSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionTitle("Delivery Address", icon: "mappin.and.ellipse")

            if user.addresses.isEmpty {
                Text("Add a delivery address to continue.")
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.subtext)
            } else {
                ForEach(Array(user.addresses.enumerated()), id: \.element.id) { index, address in
                    Button {
                        Haptics.select()
                        user.selectAddress(index: index)
                    } label: {
                        HStack(spacing: 12) {
                            Image(systemName: index == user.selectedAddressIndex ? "largecircle.fill.circle" : "circle")
                                .foregroundStyle(index == user.selectedAddressIndex ? Theme.primary : Theme.border)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(address.street)
                                    .font(.system(size: 15, weight: .semibold))
                                    .foregroundStyle(Theme.text)
                                Text("\(address.city), \(address.state) \(address.zipCode)")
                                    .font(.system(size: 13))
                                    .foregroundStyle(Theme.subtext)
                            }
                            Spacer(minLength: 0)
                        }
                        .padding(.vertical, 4)
                    }
                    .buttonStyle(.plain)
                }
            }

            Button {
                Haptics.tap()
                showAddressSheet = true
            } label: {
                Label("Add new address", systemImage: "plus.circle.fill")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Theme.primary)
            }
            .buttonStyle(.plain)

            Label("Estimated delivery: \(AppInfo.estimatedDeliveryTime)", systemImage: "clock")
                .font(.system(size: 13))
                .foregroundStyle(Theme.subtext)
        }
        .cardSurface()
    }

    // MARK: - Payment

    private var paymentSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionTitle("Payment Method", icon: "creditcard")

            ForEach(PaymentMethod.allCases, id: \.self) { method in
                Button {
                    Haptics.select()
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                        paymentMethod = method
                    }
                } label: {
                    HStack(spacing: 12) {
                        Image(systemName: paymentMethod == method ? "largecircle.fill.circle" : "circle")
                            .foregroundStyle(paymentMethod == method ? Theme.primary : Theme.border)
                        Image(systemName: method.systemImage)
                            .foregroundStyle(Theme.text)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(method.title)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(Theme.text)
                            if method == .card {
                                Text("Visa ending in 4242")
                                    .font(.system(size: 12))
                                    .foregroundStyle(Theme.subtext)
                            }
                        }
                        Spacer(minLength: 0)
                    }
                    .padding(.vertical, 4)
                }
                .buttonStyle(.plain)
            }

            if paymentMethod == .cash {
                Label("MUST SHOW ID BEFORE HANDING OVER MERCHANDISE", systemImage: "person.text.rectangle.fill")
                    .font(.system(size: 12, weight: .heavy))
                    .foregroundStyle(Theme.warning)
                    .padding(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Theme.warning.opacity(0.12), in: .rect(cornerRadius: 10))
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .cardSurface()
    }

    // MARK: - Promo

    private var promoSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionTitle("Promo Code", icon: "tag")

            HStack(spacing: 10) {
                TextField("Enter code", text: $promoInput)
                    .textInputAutocapitalization(.characters)
                    .autocorrectionDisabled()
                    .foregroundStyle(Theme.text)
                    .padding(.horizontal, 12)
                    .frame(height: 46)
                    .background(Theme.background, in: .rect(cornerRadius: 10))
                    .overlay {
                        RoundedRectangle(cornerRadius: 10).stroke(Theme.border, lineWidth: 1)
                    }

                Button(appliedPromo == nil ? "Apply" : "Remove") {
                    appliedPromo == nil ? applyPromo() : removePromo()
                }
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 18)
                .frame(height: 46)
                .background(appliedPromo == nil ? Theme.primary : Theme.error, in: .rect(cornerRadius: 10))
            }

            if let promoMessage {
                Label(promoMessage, systemImage: promoIsError ? "xmark.circle.fill" : "checkmark.circle.fill")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(promoIsError ? Theme.error : Theme.primary)
            }
        }
        .cardSurface()
    }

    private func applyPromo() {
        let code = promoInput.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        guard !code.isEmpty else { return }

        if code == AppInfo.promoCode {
            if user.hasUsedPromoCode {
                Haptics.warning()
                promoIsError = true
                promoMessage = "This code has already been used on your account."
                return
            }
            Haptics.success()
            appliedPromo = code
            promoIsError = false
            promoMessage = "20% off applied to your subtotal."
        } else if code == AppInfo.EighthsPromotion.code {
            Haptics.tap()
            promoIsError = false
            promoMessage = "The eighths special applies automatically to your cart."
        } else {
            Haptics.warning()
            promoIsError = true
            promoMessage = "That code isn't valid."
        }
    }

    private func removePromo() {
        Haptics.tap()
        appliedPromo = nil
        promoInput = ""
        promoMessage = nil
        promoIsError = false
    }

    // MARK: - Points

    @ViewBuilder
    private var pointsSection: some View {
        if user.points >= AppInfo.minimumRedeemablePoints {
            VStack(alignment: .leading, spacing: 8) {
                Toggle(isOn: $redeemPoints.animation(.spring(response: 0.3, dampingFraction: 0.8))) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Redeem \(user.points) points")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(Theme.text)
                        Text("Worth \(user.redeemableValue.currency) off this order")
                            .font(.system(size: 13))
                            .foregroundStyle(Theme.subtext)
                    }
                }
                .tint(Theme.primary)

                if redeemPoints {
                    Text("Using \(pointsSpent) points for \(pointsDiscount.currency) off.")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Theme.primary)
                }
            }
            .cardSurface()
        }
    }

    // MARK: - Tip

    private var tipSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            sectionTitle("Tip Your Driver", icon: "hand.thumbsup")

            HStack(spacing: 8) {
                ForEach(AppInfo.defaultTipPercentages, id: \.self) { percent in
                    tipButton(percent)
                }
                tipButton(0, label: "None")
            }

            Text("100% of your tip goes directly to your driver.")
                .font(.system(size: 12))
                .foregroundStyle(Theme.subtext)
        }
        .cardSurface()
    }

    private func tipButton(_ percent: Int, label: String? = nil) -> some View {
        let isSelected = tipPercent == percent
        return Button {
            Haptics.select()
            withAnimation(.spring(response: 0.3, dampingFraction: 0.75)) {
                tipPercent = percent
            }
        } label: {
            Text(label ?? "\(percent)%")
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(isSelected ? Theme.background : Theme.text)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(isSelected ? Theme.primary : Theme.background, in: .rect(cornerRadius: 10))
                .overlay {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(isSelected ? .clear : Theme.border, lineWidth: 1)
                }
        }
        .buttonStyle(.plain)
    }

    // MARK: - Summary

    private var summarySection: some View {
        VStack(spacing: 10) {
            sectionTitle("Order Summary", icon: "list.bullet.rectangle")

            ForEach(cart.items) { item in
                HStack {
                    Text("\(item.quantity)× \(cart.displayName(for: item))")
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.subtext)
                        .lineLimit(2)
                    Spacer(minLength: 8)
                    Text(cart.lineTotal(for: item).currency)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Theme.text)
                }
            }

            Divider().overlay(Theme.border)

            row("Subtotal", subtotal.currency)
            if promoDiscount > 0 { row("Promo (\(AppInfo.promoCode))", "-\(promoDiscount.currency)", tint: Theme.primary) }
            if pointsDiscount > 0 { row("Points redeemed", "-\(pointsDiscount.currency)", tint: Theme.primary) }
            row("Delivery", deliveryFee == 0 ? "FREE" : deliveryFee.currency, tint: deliveryFee == 0 ? Theme.primary : Theme.text)
            row("Tax (8%)", tax.currency)
            if tipAmount > 0 { row("Tip (\(tipPercent)%)", tipAmount.currency) }

            Divider().overlay(Theme.border)

            HStack {
                Text("Total")
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(Theme.text)
                Spacer()
                Text(total.currency)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundStyle(Theme.primary)
                    .contentTransition(.numericText())
            }

            HStack(spacing: 6) {
                Image(systemName: "star.fill")
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.primary)
                Text("You'll earn \(Int(total)) points on this order")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(Theme.subtext)
                Spacer()
            }
        }
        .cardSurface()
        .animation(.spring(response: 0.35, dampingFraction: 0.85), value: total)
    }

    private func row(_ label: String, _ value: String, tint: Color = Theme.text) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 14))
                .foregroundStyle(Theme.subtext)
            Spacer()
            Text(value)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(tint)
        }
    }

    private func sectionTitle(_ title: String, icon: String) -> some View {
        Label(title, systemImage: icon)
            .font(.system(size: 16, weight: .bold))
            .foregroundStyle(Theme.text)
            .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Place order

    private var placeOrderBar: some View {
        VStack(spacing: 6) {
            Button {
                placeOrder()
            } label: {
                if isPlacingOrder {
                    ProgressView().tint(Theme.text)
                } else {
                    HStack {
                        Text("Place order")
                        Spacer()
                        Text(total.currency)
                    }
                    .padding(.horizontal, 20)
                }
            }
            .buttonStyle(PrimaryButtonStyle(isEnabled: canPlaceOrder))
            .disabled(!canPlaceOrder)

            if user.selectedAddress == nil {
                Text("Add a delivery address to place your order.")
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.warning)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .background(.ultraThinMaterial)
        .overlay(alignment: .top) {
            Rectangle().fill(Theme.border).frame(height: 1)
        }
    }

    private func placeOrder() {
        guard let address = user.selectedAddress else { return }
        isPlacingOrder = true
        placementError = nil

        let lineItems = cart.items.map { item in
            OrderLineItem(
                id: item.id,
                name: Catalog.product(id: item.productID)?.name ?? "Product",
                price: cart.unitPrice(for: item),
                quantity: item.quantity,
                variantName: item.variantID.flatMap {
                    Catalog.variant(productID: item.productID, variantID: $0)?.name
                }
            )
        }

        let draft = OrderDraft(
            items: lineItems,
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            tax: tax,
            tip: tipAmount,
            discount: promoDiscount + pointsDiscount,
            pointsRedeemed: pointsSpent,
            total: total,
            paymentMethod: paymentMethod,
            cardLast4: paymentMethod == .card ? "4242" : nil,
            promoCode: appliedPromo,
            deliveryAddress: address.formatted
        )

        Task {
            // Brief pause so the button state reads as a real submission.
            try? await Task.sleep(for: .seconds(0.8))

            let order = orders.createOrder(from: draft)

            if pointsSpent > 0 {
                user.redeemPoints(pointsSpent, detail: "Order #\(order.shortID)")
            }
            user.addPoints(order.pointsEarned, detail: "Order #\(order.shortID)")
            if appliedPromo != nil { user.markPromoCodeUsed() }

            cart.clear()
            Haptics.success()
            isPlacingOrder = false
            path.append(.orderConfirmation(order.id))
        }
    }
}
