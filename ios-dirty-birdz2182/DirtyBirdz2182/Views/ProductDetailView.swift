import SwiftUI

/// Product detail with variant picker, potency stats, effects and add-to-cart.
struct ProductDetailView: View {
    let productID: String
    @Binding var path: [Route]

    @Environment(CartStore.self) private var cart

    @State private var selectedVariantID: String?
    @State private var quantity = 1
    @State private var didAdd = false

    private var product: Product? { Catalog.product(id: productID) }

    private var variants: [ProductVariant] {
        product?.variants ?? []
    }

    private var unitPrice: Double {
        Catalog.price(productID: productID, variantID: selectedVariantID)
    }

    private var totalPrice: Double {
        unitPrice * Double(quantity)
    }

    var body: some View {
        Group {
            if let product {
                content(product)
            } else {
                EmptyStateView(
                    systemImage: "questionmark.circle",
                    title: "Product unavailable",
                    message: "This product is no longer in our catalog."
                )
                .background(Theme.background.ignoresSafeArea())
            }
        }
        .onAppear {
            if selectedVariantID == nil { selectedVariantID = variants.first?.id }
        }
    }

    private func content(_ product: Product) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                RemoteImage(urlString: product.image, height: 300, cornerRadius: 22)
                    .overlay(alignment: .topLeading) {
                        if let strain = product.strain {
                            Chip(text: strain, tint: strainTint(strain), filled: true)
                                .padding(14)
                        }
                    }

                titleBlock(product)
                statsRow(product)

                if !variants.isEmpty {
                    variantPicker
                }

                descriptionBlock(product)
                effectsBlock(product)

                if product.category == "1" {
                    eighthsNote
                }

                Color.clear.frame(height: 8)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .navigationTitle(product.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                CartToolbarButton { path.append(.cart) }
            }
        }
        .safeAreaInset(edge: .bottom) { addBar(product) }
    }

    private func titleBlock(_ product: Product) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(product.name)
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(Theme.text)

            HStack(spacing: 12) {
                if let rating = product.rating {
                    RatingStars(rating: rating, size: 14)
                }
                if !product.subtitle.isEmpty {
                    Text(product.subtitle)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(Theme.subtext)
                }
            }

            Text(unitPrice.currency)
                .font(.system(size: 30, weight: .bold))
                .foregroundStyle(Theme.primary)
                .contentTransition(.numericText())
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: unitPrice)
        }
    }

    private func statsRow(_ product: Product) -> some View {
        HStack(spacing: 12) {
            statTile(title: "THC", value: "\(Int(product.thc))%", icon: "bolt.fill", tint: Theme.warning)
            statTile(
                title: "CBD",
                value: product.cbd < 1 ? String(format: "%.1f%%", product.cbd) : "\(Int(product.cbd))%",
                icon: "drop.fill",
                tint: Theme.secondary
            )
            statTile(
                title: "Type",
                value: product.strain ?? categoryName(product.category),
                icon: "leaf.fill",
                tint: Theme.primary
            )
        }
    }

    private func statTile(title: String, value: String, icon: String, tint: Color) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(tint)
            Text(value)
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.text)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(Theme.subtext)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Theme.card, in: .rect(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14).stroke(Theme.border, lineWidth: 1)
        }
    }

    private var variantPicker: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Select Size")
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(Theme.text)

            ForEach(variants) { variant in
                let isSelected = selectedVariantID == variant.id
                Button {
                    Haptics.select()
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                        selectedVariantID = variant.id
                    }
                } label: {
                    HStack(spacing: 12) {
                        Image(systemName: isSelected ? "largecircle.fill.circle" : "circle")
                            .font(.system(size: 20))
                            .foregroundStyle(isSelected ? Theme.primary : Theme.border)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(variant.name)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(Theme.text)
                            Text(variant.weight)
                                .font(.system(size: 12))
                                .foregroundStyle(Theme.subtext)
                        }

                        Spacer(minLength: 0)

                        Text(variant.price.currency)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundStyle(isSelected ? Theme.primary : Theme.text)
                    }
                    .padding(14)
                    .background(
                        isSelected ? Theme.primary.opacity(0.12) : Theme.card,
                        in: .rect(cornerRadius: 14)
                    )
                    .overlay {
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(isSelected ? Theme.primary : Theme.border, lineWidth: isSelected ? 1.5 : 1)
                    }
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func descriptionBlock(_ product: Product) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("About this strain")
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(Theme.text)
            Text(product.description)
                .font(.system(size: 15))
                .foregroundStyle(Theme.subtext)
                .lineSpacing(4)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func effectsBlock(_ product: Product) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Effects")
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(Theme.text)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 100), spacing: 8)], spacing: 8) {
                ForEach(product.effects, id: \.self) { effect in
                    Chip(text: effect)
                        .frame(maxWidth: .infinity)
                }
            }
        }
    }

    private var eighthsNote: some View {
        HStack(spacing: 12) {
            Image(systemName: "sparkles")
                .font(.system(size: 20))
                .foregroundStyle(Theme.warning)
            VStack(alignment: .leading, spacing: 2) {
                Text(AppInfo.EighthsPromotion.subtitle)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(Theme.text)
                Text(AppInfo.EighthsPromotion.detail)
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.subtext)
            }
            Spacer(minLength: 0)
        }
        .padding(14)
        .background(Theme.warning.opacity(0.1), in: .rect(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14).stroke(Theme.warning.opacity(0.3), lineWidth: 1)
        }
    }

    private func addBar(_ product: Product) -> some View {
        VStack(spacing: 12) {
            HStack(spacing: 16) {
                stepper
                Spacer(minLength: 0)
                VStack(alignment: .trailing, spacing: 1) {
                    Text("Total")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Theme.subtext)
                    Text(totalPrice.currency)
                        .font(.system(size: 22, weight: .bold))
                        .foregroundStyle(Theme.text)
                        .contentTransition(.numericText())
                }
            }

            Button {
                cart.add(productID: productID, variantID: selectedVariantID, quantity: quantity)
                Haptics.success()
                withAnimation(.spring(response: 0.35, dampingFraction: 0.7)) { didAdd = true }
                Task {
                    try? await Task.sleep(for: .seconds(1.4))
                    withAnimation(.easeOut(duration: 0.25)) { didAdd = false }
                }
            } label: {
                Label(didAdd ? "Added to cart" : "Add to cart", systemImage: didAdd ? "checkmark" : "cart.badge.plus")
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .padding(.horizontal, 16)
        .padding(.top, 14)
        .padding(.bottom, 10)
        .background(.ultraThinMaterial)
        .overlay(alignment: .top) {
            Rectangle().fill(Theme.border).frame(height: 1)
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: totalPrice)
    }

    private var stepper: some View {
        HStack(spacing: 0) {
            stepperButton(icon: "minus", enabled: quantity > 1) {
                quantity = max(1, quantity - 1)
            }
            Text("\(quantity)")
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(Theme.text)
                .frame(minWidth: 44)
                .contentTransition(.numericText())
            stepperButton(icon: "plus", enabled: quantity < 99) {
                quantity = min(99, quantity + 1)
            }
        }
        .background(Theme.card, in: .capsule)
        .overlay { Capsule().stroke(Theme.border, lineWidth: 1) }
    }

    private func stepperButton(icon: String, enabled: Bool, action: @escaping () -> Void) -> some View {
        Button {
            Haptics.tap()
            withAnimation(.spring(response: 0.25, dampingFraction: 0.7)) { action() }
        } label: {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(enabled ? Theme.text : Theme.subtext.opacity(0.4))
                .frame(width: 46, height: 46)
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
    }

    private func strainTint(_ strain: String) -> Color {
        switch strain {
        case "Sativa": Theme.warning
        case "Indica": Color(hex: 0x8B5CF6)
        default: Theme.primary
        }
    }

    private func categoryName(_ id: String) -> String {
        Catalog.category(id: id)?.name ?? "Product"
    }
}
