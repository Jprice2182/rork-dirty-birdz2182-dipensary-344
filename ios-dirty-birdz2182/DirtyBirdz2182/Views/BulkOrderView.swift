import SwiftUI

/// Business bulk-purchase inquiry form.
struct BulkOrderView: View {
    @State private var businessName = ""
    @State private var phone = ""
    @State private var address = ""
    @State private var message = ""
    @State private var isSubmitting = false
    @State private var didSubmit = false
    @State private var errorMessage: String?

    private var isValid: Bool {
        !businessName.trimmingCharacters(in: .whitespaces).isEmpty
            && phone.filter(\.isNumber).count >= 10
            && !address.trimmingCharacters(in: .whitespaces).isEmpty
            && !message.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                if didSubmit {
                    successCard
                } else {
                    hero
                    form
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .scrollDismissesKeyboard(.interactively)
        .navigationTitle("Bulk Orders")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Business orders", systemImage: "building.2.fill")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Theme.primary.opacity(0.22), in: .capsule)

            Text("Wholesale pricing for your business")
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(Theme.text)
                .fixedSize(horizontal: false, vertical: true)

            Text("Tell us about your business and our team will reach out with bulk pricing, availability and delivery scheduling.")
                .font(.system(size: 15))
                .foregroundStyle(Color(hex: 0xB7C9C2))
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(22)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.bulkCard)
        .overlay(alignment: .topTrailing) {
            Circle()
                .fill(Theme.primary.opacity(0.14))
                .frame(width: 140, height: 140)
                .offset(x: 40, y: -30)
                .allowsHitTesting(false)
        }
        .clipShape(.rect(cornerRadius: 24))
        .overlay {
            RoundedRectangle(cornerRadius: 24).stroke(Theme.primary.opacity(0.28), lineWidth: 1)
        }
    }

    private var form: some View {
        VStack(alignment: .leading, spacing: 16) {
            field(title: "Business name", text: $businessName, placeholder: "Peachtree Wellness Co.")
            field(title: "Phone number", text: $phone, placeholder: "(404) 555-0123", keyboard: .phonePad)
            field(title: "Business address", text: $address, placeholder: "123 Peachtree St, Atlanta, GA")

            VStack(alignment: .leading, spacing: 6) {
                Text("Message")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Theme.subtext)
                TextField("What products and quantities do you need?", text: $message, axis: .vertical)
                    .lineLimit(4...8)
                    .foregroundStyle(Theme.text)
                    .padding(12)
                    .background(Theme.background, in: .rect(cornerRadius: 12))
                    .overlay {
                        RoundedRectangle(cornerRadius: 12).stroke(Theme.border, lineWidth: 1)
                    }
            }

            if let errorMessage {
                Label(errorMessage, systemImage: "exclamationmark.triangle.fill")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Theme.error)
            }

            Button {
                submit()
            } label: {
                if isSubmitting {
                    ProgressView().tint(Theme.text)
                } else {
                    Text("Submit inquiry")
                }
            }
            .buttonStyle(PrimaryButtonStyle(isEnabled: isValid && !isSubmitting))
            .disabled(!isValid || isSubmitting)

            Text("We typically respond within one business day at \(AppInfo.Support.email).")
                .font(.system(size: 12))
                .foregroundStyle(Theme.subtext)
        }
        .cardSurface()
    }

    private func field(
        title: String,
        text: Binding<String>,
        placeholder: String,
        keyboard: UIKeyboardType = .default
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(Theme.subtext)
            TextField(placeholder, text: text)
                .keyboardType(keyboard)
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 12)
                .frame(height: 48)
                .background(Theme.background, in: .rect(cornerRadius: 12))
                .overlay {
                    RoundedRectangle(cornerRadius: 12).stroke(Theme.border, lineWidth: 1)
                }
        }
    }

    private var successCard: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 60))
                .foregroundStyle(Theme.primary)
                .padding(.top, 40)

            Text("Inquiry sent")
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(Theme.text)

            Text("Thanks, \(businessName). Our wholesale team will contact you at \(phone) within one business day.")
                .font(.system(size: 15))
                .foregroundStyle(Theme.subtext)
                .multilineTextAlignment(.center)

            Button("Submit another inquiry") {
                Haptics.tap()
                withAnimation {
                    didSubmit = false
                    businessName = ""
                    phone = ""
                    address = ""
                    message = ""
                }
            }
            .buttonStyle(SecondaryButtonStyle())
            .padding(.top, 8)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
    }

    private func submit() {
        guard isValid else {
            errorMessage = "Please complete every field before submitting."
            return
        }
        errorMessage = nil
        isSubmitting = true

        Task {
            // Simulated submission — no wholesale backend is wired up yet.
            try? await Task.sleep(for: .seconds(1))
            isSubmitting = false
            Haptics.success()
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) { didSubmit = true }
        }
    }
}
