import SwiftUI

/// First-order promo code banner for new users.
struct DiscountBanner: View {
    let onDismiss: () -> Void
    @State private var didCopy = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label("New customer offer", systemImage: "gift.fill")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(Theme.text)
                Spacer()
                Button {
                    Haptics.tap()
                    onDismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Theme.text.opacity(0.75))
                        .frame(width: 30, height: 30)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Dismiss offer")
            }

            Text("20% off your first order")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(Theme.text)

            Button {
                UIPasteboard.general.string = AppInfo.promoCode
                Haptics.success()
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) { didCopy = true }
            } label: {
                HStack(spacing: 8) {
                    Text(AppInfo.promoCode)
                        .font(.system(size: 15, weight: .heavy))
                        .kerning(1.5)
                    Image(systemName: didCopy ? "checkmark" : "doc.on.doc")
                        .font(.system(size: 13, weight: .bold))
                }
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(.white.opacity(0.18), in: .rect(cornerRadius: 10))
                .overlay {
                    RoundedRectangle(cornerRadius: 10)
                        .strokeBorder(style: StrokeStyle(lineWidth: 1, dash: [5, 4]))
                        .foregroundStyle(.white.opacity(0.5))
                }
            }
            .buttonStyle(.plain)

            Text(didCopy ? "Code copied — apply it at checkout" : "Tap the code to copy it")
                .font(.system(size: 12))
                .foregroundStyle(Theme.text.opacity(0.8))
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background {
            LinearGradient(
                colors: [Color(hex: 0x047857), Color(hex: 0x065F46)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
        .clipShape(.rect(cornerRadius: 20))
    }
}

/// "Buy 2 eighths, get the 3rd for $1" banner.
struct EighthsPromoBanner: View {
    let onDismiss: () -> Void
    @State private var pulse = false

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(Theme.warning.opacity(0.2))
                    .frame(width: 52, height: 52)
                    .scaleEffect(pulse ? 1.12 : 1)
                Image(systemName: "sparkles")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundStyle(Theme.warning)
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(AppInfo.EighthsPromotion.title)
                    .font(.system(size: 11, weight: .heavy))
                    .kerning(1.2)
                    .foregroundStyle(Theme.warning)
                Text(AppInfo.EighthsPromotion.subtitle)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(Theme.text)
                Text(AppInfo.EighthsPromotion.detail)
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.subtext)
            }

            Spacer(minLength: 0)

            Button {
                Haptics.tap()
                onDismiss()
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(Theme.subtext)
                    .frame(width: 28, height: 28)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Dismiss special")
        }
        .padding(16)
        .background(Theme.card, in: .rect(cornerRadius: 18))
        .overlay {
            RoundedRectangle(cornerRadius: 18)
                .stroke(Theme.warning.opacity(0.35), lineWidth: 1)
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.6).repeatForever(autoreverses: true)) {
                pulse = true
            }
        }
    }
}

/// Birthday gift banner shown only on the user's birthday.
struct BirthdayBanner: View {
    let onTap: () -> Void
    @State private var shimmer = false

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 14) {
                Image(systemName: "birthday.cake.fill")
                    .font(.system(size: 26))
                    .foregroundStyle(Theme.text)
                    .rotationEffect(.degrees(shimmer ? -6 : 6))

                VStack(alignment: .leading, spacing: 3) {
                    Text("Happy Birthday!")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundStyle(Theme.text)
                    Text("Claim your free 1g pre-roll")
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.text.opacity(0.85))
                }

                Spacer(minLength: 0)

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(Theme.text.opacity(0.85))
            }
            .padding(18)
            .frame(maxWidth: .infinity)
            .background {
                LinearGradient(
                    colors: [Color(hex: 0xBE185D), Color(hex: 0x7C3AED)],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            }
            .clipShape(.rect(cornerRadius: 18))
        }
        .buttonStyle(PressableCardStyle())
        .onAppear {
            withAnimation(.easeInOut(duration: 1.1).repeatForever(autoreverses: true)) {
                shimmer = true
            }
        }
    }
}
