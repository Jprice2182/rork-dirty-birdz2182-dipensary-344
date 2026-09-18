import SwiftUI

/// Standard elevated surface used across the app.
struct CardSurface: ViewModifier {
    var padding: CGFloat = 20
    var cornerRadius: CGFloat = 16

    func body(content: Content) -> some View {
        content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.card, in: .rect(cornerRadius: cornerRadius))
            .overlay {
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(Theme.border.opacity(0.7), lineWidth: 1)
            }
            .shadow(color: Theme.primary.opacity(0.10), radius: 10, y: 4)
    }
}

extension View {
    func cardSurface(padding: CGFloat = 20, cornerRadius: CGFloat = 16) -> some View {
        modifier(CardSurface(padding: padding, cornerRadius: cornerRadius))
    }
}

/// Section heading with an optional supporting line.
struct SectionHeader: View {
    let title: String
    var subtitle: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(Theme.text)
            if let subtitle {
                Text(subtitle)
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.subtext)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// Full-width emerald call to action with a press animation.
struct PrimaryButtonStyle: ButtonStyle {
    var isEnabled = true

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 17, weight: .bold))
            .foregroundStyle(isEnabled ? Theme.text : Theme.subtext)
            .frame(maxWidth: .infinity)
            .frame(height: 54)
            .background(
                isEnabled ? AnyShapeStyle(Theme.emeraldSweep) : AnyShapeStyle(Theme.card),
                in: .rect(cornerRadius: 16)
            )
            .shadow(color: Theme.primary.opacity(isEnabled ? 0.35 : 0), radius: 14, y: 6)
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

/// Secondary outlined action.
struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .semibold))
            .foregroundStyle(Theme.text)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Theme.card, in: .rect(cornerRadius: 14))
            .overlay {
                RoundedRectangle(cornerRadius: 14)
                    .stroke(Theme.border, lineWidth: 1)
            }
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

/// Makes a whole card feel tappable.
struct PressableCardStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .opacity(configuration.isPressed ? 0.9 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.75), value: configuration.isPressed)
    }
}

/// Small rounded label used for strains, effects and statuses.
struct Chip: View {
    let text: String
    var tint: Color = Theme.primary
    var filled = false

    var body: some View {
        Text(text)
            .font(.system(size: 12, weight: .semibold))
            .foregroundStyle(filled ? Theme.text : tint)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(tint.opacity(filled ? 0.9 : 0.15), in: .capsule)
    }
}

/// Star row used for product and app ratings.
struct RatingStars: View {
    let rating: Double
    var size: CGFloat = 12
    var showsValue = true

    var body: some View {
        HStack(spacing: 3) {
            ForEach(1...5, id: \.self) { index in
                Image(systemName: starSymbol(for: index))
                    .font(.system(size: size))
                    .foregroundStyle(Theme.warning)
            }
            if showsValue {
                Text(String(format: "%.1f", rating))
                    .font(.system(size: size, weight: .semibold))
                    .foregroundStyle(Theme.subtext)
            }
        }
    }

    private func starSymbol(for index: Int) -> String {
        let value = Double(index)
        if rating >= value { return "star.fill" }
        if rating >= value - 0.5 { return "star.leadinghalf.filled" }
        return "star"
    }
}

/// Interactive star picker for review flows.
struct RatingPicker: View {
    @Binding var rating: Int
    var size: CGFloat = 32

    var body: some View {
        HStack(spacing: 10) {
            ForEach(1...5, id: \.self) { index in
                Button {
                    Haptics.select()
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        rating = index
                    }
                } label: {
                    Image(systemName: index <= rating ? "star.fill" : "star")
                        .font(.system(size: size))
                        .foregroundStyle(index <= rating ? Theme.warning : Theme.border)
                        .scaleEffect(index == rating ? 1.15 : 1)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(index) star\(index == 1 ? "" : "s")")
            }
        }
    }
}

/// Empty-state placeholder with an icon, message and optional action.
struct EmptyStateView: View {
    let systemImage: String
    let title: String
    let message: String
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: systemImage)
                .font(.system(size: 52))
                .foregroundStyle(Theme.primary.opacity(0.6))
            Text(title)
                .font(.system(size: 20, weight: .bold))
                .foregroundStyle(Theme.text)
            Text(message)
                .font(.system(size: 15))
                .foregroundStyle(Theme.subtext)
                .multilineTextAlignment(.center)
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .buttonStyle(PrimaryButtonStyle())
                    .frame(maxWidth: 240)
                    .padding(.top, 4)
            }
        }
        .padding(32)
        .frame(maxWidth: .infinity)
    }
}
