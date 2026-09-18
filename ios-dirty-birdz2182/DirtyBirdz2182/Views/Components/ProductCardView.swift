import SwiftUI

/// Grid tile for a product, with a quick-add button for simple products.
struct ProductCardView: View {
    let product: Product
    var onTap: () -> Void
    var onQuickAdd: (() -> Void)?

    @State private var didAdd = false

    private var hasVariants: Bool {
        !(product.variants?.isEmpty ?? true)
    }

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                RemoteImage(urlString: product.image, height: 132, cornerRadius: 0)
                    .overlay(alignment: .topLeading) {
                        if let strain = product.strain {
                            Chip(text: strain, tint: strainTint(strain), filled: true)
                                .padding(10)
                        }
                    }
                    .overlay(alignment: .topTrailing) {
                        Text("\(Int(product.thc))% THC")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(Theme.text)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(.black.opacity(0.55), in: .capsule)
                            .padding(10)
                    }

                VStack(alignment: .leading, spacing: 6) {
                    Text(product.name)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundStyle(Theme.text)
                        .lineLimit(1)

                    if !product.subtitle.isEmpty {
                        Text(product.subtitle)
                            .font(.system(size: 12))
                            .foregroundStyle(Theme.subtext)
                            .lineLimit(1)
                    }

                    if let rating = product.rating {
                        RatingStars(rating: rating, size: 11)
                    }

                    HStack(alignment: .firstTextBaseline, spacing: 2) {
                        if hasVariants {
                            Text("from ")
                                .font(.system(size: 11))
                                .foregroundStyle(Theme.subtext)
                        }
                        Text(product.price.currency)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundStyle(Theme.primary)

                        Spacer(minLength: 4)

                        if let onQuickAdd {
                            addButton(action: onQuickAdd)
                        } else {
                            Image(systemName: "chevron.right.circle.fill")
                                .font(.system(size: 26))
                                .foregroundStyle(Theme.primary.opacity(0.8))
                        }
                    }
                    .padding(.top, 2)
                }
                .padding(12)
            }
            .background(Theme.card)
            .clipShape(.rect(cornerRadius: 18))
            .overlay {
                RoundedRectangle(cornerRadius: 18)
                    .stroke(Theme.border.opacity(0.8), lineWidth: 1)
            }
            .shadow(color: .black.opacity(0.3), radius: 8, y: 4)
        }
        .buttonStyle(PressableCardStyle())
    }

    private func addButton(action: @escaping () -> Void) -> some View {
        Button {
            action()
            Haptics.success()
            withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) { didAdd = true }
            Task {
                try? await Task.sleep(for: .seconds(1.2))
                withAnimation(.easeOut(duration: 0.25)) { didAdd = false }
            }
        } label: {
            Image(systemName: didAdd ? "checkmark.circle.fill" : "plus.circle.fill")
                .font(.system(size: 28))
                .foregroundStyle(didAdd ? Theme.secondary : Theme.primary)
                .scaleEffect(didAdd ? 1.12 : 1)
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Add \(product.name) to cart")
    }

    private func strainTint(_ strain: String) -> Color {
        switch strain {
        case "Sativa": Theme.warning
        case "Indica": Color(hex: 0x8B5CF6)
        default: Theme.primary
        }
    }
}
