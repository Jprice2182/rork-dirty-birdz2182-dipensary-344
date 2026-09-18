import SwiftUI

/// Cart with per-line quantity controls, the eighths promotion and delivery progress.
struct CartView: View {
    @Binding var path: [Route]

    @Environment(CartStore.self) private var cart

    var body: some View {
        Group {
            if cart.isEmpty {
                EmptyStateView(
                    systemImage: "cart",
                    title: "Your cart is empty",
                    message: "Browse our premium flower, edibles and pre-rolls to get started.",
                    actionTitle: "Start shopping",
                    action: { path.removeAll() }
                )
                .frame(maxHeight: .infinity)
                .background(Theme.background.ignoresSafeArea())
            } else {
                content
            }
        }
        .navigationTitle("Cart")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if !cart.isEmpty {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Clear", role: .destructive) {
                        Haptics.warning()
                        withAnimation(.easeOut(duration: 0.25)) { cart.clear() }
                    }
                    .foregroundStyle(Theme.error)
                }
            }
        }
    }

    private var content: some View {
        ScrollView {
            VStack(spacing: 14) {
                deliveryProgress

                ForEach(cart.items) { item in
                    CartRow(item: item)
                        .transition(.opacity.combined(with: .move(edge: .leading)))
                }

                if cart.eighthsPromotion.eligible {
                    promotionCard
                }

                summary
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
            .animation(.spring(response: 0.35, dampingFraction: 0.85), value: cart.items)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .safeAreaInset(edge: .bottom) { checkoutBar }
    }

    private var deliveryProgress: some View {
        let remaining = cart.amountUntilFreeDelivery
        let progress = min(1, cart.subtotal / AppInfo.freeDeliveryMinimum)

        return VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                Image(systemName: remaining > 0 ? "truck.box" : "checkmark.seal.fill")
                    .foregroundStyle(remaining > 0 ? Theme.warning : Theme.primary)
                Text(remaining > 0
                     ? "Add \(remaining.currency) for free delivery"
                     : "You've unlocked free delivery!")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Theme.text)
                Spacer(minLength: 0)
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Capsule().fill(Theme.border)
                    Capsule()
                        .fill(Theme.emeraldSweep)
                        .frame(width: max(6, geometry.size.width * progress))
                }
            }
            .frame(height: 8)
            .animation(.spring(response: 0.5, dampingFraction: 0.85), value: progress)
        }
        .cardSurface(padding: 16)
    }

    private var promotionCard: some View {
        let promo = cart.eighthsPromotion
        return HStack(spacing: 12) {
            Image(systemName: "sparkles")
                .font(.system(size: 20))
                .foregroundStyle(Theme.warning)
            VStack(alignment: .leading, spacing: 2) {
                Text("\(AppInfo.EighthsPromotion.title) applied")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(Theme.text)
                Text("\(promo.discountedEighths) eighth\(promo.discountedEighths == 1 ? "" : "s") at $1 each")
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.subtext)
            }
            Spacer(minLength: 0)
            Text("-\(promo.savings.currency)")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.warning)
        }
        .padding(14)
        .background(Theme.warning.opacity(0.1), in: .rect(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14).stroke(Theme.warning.opacity(0.3), lineWidth: 1)
        }
    }

    private var summary: some View {
        VStack(spacing: 10) {
            summaryRow("Subtotal", cart.grossSubtotal.currency)
            if cart.eighthsPromotion.eligible {
                summaryRow("Special savings", "-\(cart.eighthsPromotion.savings.currency)", tint: Theme.warning)
            }
            summaryRow(
                "Delivery",
                cart.deliveryFee == 0 ? "FREE" : cart.deliveryFee.currency,
                tint: cart.deliveryFee == 0 ? Theme.primary : Theme.text
            )
            Divider().overlay(Theme.border)
            HStack {
                Text("Estimated total")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(Theme.text)
                Spacer()
                Text((cart.subtotal + cart.deliveryFee).currency)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(Theme.primary)
            }
            Text("Taxes and tip are calculated at checkout.")
                .font(.system(size: 12))
                .foregroundStyle(Theme.subtext)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .cardSurface()
    }

    private func summaryRow(_ label: String, _ value: String, tint: Color = Theme.text) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 14))
                .foregroundStyle(Theme.subtext)
            Spacer()
            Text(value)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(tint)
        }
    }

    private var checkoutBar: some View {
        VStack(spacing: 8) {
            Button {
                Haptics.tap()
                path.append(.checkout)
            } label: {
                HStack {
                    Text("Proceed to checkout")
                    Spacer()
                    Text((cart.subtotal + cart.deliveryFee).currency)
                }
                .padding(.horizontal, 20)
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .padding(.horizontal, 16)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .background(.ultraThinMaterial)
        .overlay(alignment: .top) {
            Rectangle().fill(Theme.border).frame(height: 1)
        }
    }
}

/// Single cart line with image, variant label and a quantity stepper.
struct CartRow: View {
    let item: CartItem
    @Environment(CartStore.self) private var cart

    private var product: Product? { Catalog.product(id: item.productID) }

    var body: some View {
        HStack(spacing: 12) {
            if let product {
                RemoteImage(urlString: product.image, height: 84, cornerRadius: 12)
                    .frame(width: 84)
            }

            VStack(alignment: .leading, spacing: 5) {
                Text(product?.name ?? "Product")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(Theme.text)
                    .lineLimit(2)

                if let variantID = item.variantID,
                   let variant = Catalog.variant(productID: item.productID, variantID: variantID) {
                    Text(variant.name)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Theme.primary)
                } else if let subtitle = product?.subtitle, !subtitle.isEmpty {
                    Text(subtitle)
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.subtext)
                }

                Text(cart.lineTotal(for: item).currency)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(Theme.text)
                    .contentTransition(.numericText())
            }

            Spacer(minLength: 0)

            VStack(spacing: 8) {
                Button {
                    Haptics.warning()
                    cart.remove(productID: item.productID, variantID: item.variantID)
                } label: {
                    Image(systemName: "trash")
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.error)
                        .frame(width: 30, height: 30)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Remove item")

                HStack(spacing: 0) {
                    quantityButton("minus") {
                        cart.setQuantity(item.quantity - 1, productID: item.productID, variantID: item.variantID)
                    }
                    Text("\(item.quantity)")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Theme.text)
                        .frame(minWidth: 28)
                        .contentTransition(.numericText())
                    quantityButton("plus") {
                        cart.setQuantity(item.quantity + 1, productID: item.productID, variantID: item.variantID)
                    }
                }
                .background(Theme.background, in: .capsule)
                .overlay { Capsule().stroke(Theme.border, lineWidth: 1) }
            }
        }
        .padding(12)
        .background(Theme.card, in: .rect(cornerRadius: 16))
        .overlay {
            RoundedRectangle(cornerRadius: 16).stroke(Theme.border, lineWidth: 1)
        }
    }

    private func quantityButton(_ icon: String, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.tap()
            withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) { action() }
        } label: {
            Image(systemName: icon)
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(Theme.text)
                .frame(width: 32, height: 34)
        }
        .buttonStyle(.plain)
    }
}
