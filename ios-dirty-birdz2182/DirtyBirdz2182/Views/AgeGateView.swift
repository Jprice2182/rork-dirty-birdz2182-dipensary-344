import SwiftUI

/// Mandatory 21+ gate: age confirmation followed by birthday capture.
struct AgeGateView: View {
    @Environment(UserStore.self) private var user

    @State private var showDenied = false
    @State private var birthday = Calendar.current.date(byAdding: .year, value: -25, to: Date()) ?? Date()
    @State private var birthdayError: String?
    @State private var appear = false

    private var needsBirthdayStep: Bool { user.isVerified && user.needsBirthday }

    var body: some View {
        ZStack {
            Theme.canopy.ignoresSafeArea()
            glow

            ScrollView {
                VStack(spacing: 28) {
                    Spacer(minLength: 40)
                    brand

                    if needsBirthdayStep {
                        birthdayCard
                    } else {
                        verificationCard
                    }

                    Text(AppInfo.legalDisclaimer)
                        .font(.system(size: 11))
                        .foregroundStyle(Theme.subtext)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 8)

                    Spacer(minLength: 24)
                }
                .padding(.horizontal, 24)
                .frame(maxWidth: .infinity)
            }
            .scrollBounceBehavior(.basedOnSize)
        }
        .opacity(appear ? 1 : 0)
        .onAppear {
            withAnimation(.easeOut(duration: 0.5)) { appear = true }
        }
        .alert("Sorry, you can't enter", isPresented: $showDenied) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("You must be \(AppInfo.minAge) or older to use \(AppInfo.name).")
        }
    }

    private var glow: some View {
        Circle()
            .fill(Theme.primary.opacity(0.18))
            .frame(width: 320, height: 320)
            .blur(radius: 90)
            .offset(y: -220)
    }

    private var brand: some View {
        VStack(spacing: 10) {
            Image(systemName: "bird.fill")
                .font(.system(size: 54))
                .foregroundStyle(Theme.emeraldSweep)
                .shadow(color: Theme.primary.opacity(0.5), radius: 18)

            Text(AppInfo.name)
                .font(.system(size: 32, weight: .bold))
                .foregroundStyle(Theme.text)

            Text(AppInfo.slogan)
                .font(.system(size: 15, weight: .medium))
                .foregroundStyle(Theme.primary)
        }
    }

    private var verificationCard: some View {
        VStack(spacing: 18) {
            Text("Age Verification Required")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(Theme.text)
                .multilineTextAlignment(.center)

            Text("You must be \(AppInfo.minAge) or older to use this app.")
                .font(.system(size: 15))
                .foregroundStyle(Theme.subtext)
                .multilineTextAlignment(.center)

            Text("Are you \(AppInfo.minAge) years of age or older?")
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(Theme.text)
                .multilineTextAlignment(.center)
                .padding(.top, 4)

            HStack(spacing: 12) {
                Button("No") {
                    Haptics.warning()
                    showDenied = true
                }
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(Theme.text)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(Theme.error, in: .rect(cornerRadius: 16))

                Button("Yes") {
                    Haptics.success()
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                        user.verifyAge()
                    }
                }
                .buttonStyle(PrimaryButtonStyle())
            }
            .padding(.top, 4)
        }
        .cardSurface(padding: 24, cornerRadius: 22)
    }

    private var birthdayCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label("One last step", systemImage: "calendar.badge.clock")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Theme.primary)

            Text("Confirm your birthday")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(Theme.text)

            Text("We need your date of birth to verify you're \(AppInfo.minAge)+. On your birthday each year we'll send you a free 1g pre-roll.")
                .font(.system(size: 14))
                .foregroundStyle(Theme.subtext)

            DatePicker(
                "Date of birth",
                selection: $birthday,
                in: ...Date(),
                displayedComponents: .date
            )
            .datePickerStyle(.wheel)
            .labelsHidden()
            .colorScheme(.dark)
            .frame(maxWidth: .infinity)

            if let birthdayError {
                Label(birthdayError, systemImage: "exclamationmark.triangle.fill")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Theme.error)
            }

            Button("Continue") {
                submitBirthday()
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .cardSurface(padding: 22, cornerRadius: 22)
    }

    private func submitBirthday() {
        let years = Calendar.current.dateComponents([.year], from: birthday, to: Date()).year ?? 0
        guard years >= AppInfo.minAge else {
            Haptics.warning()
            withAnimation { birthdayError = "You must be \(AppInfo.minAge) or older to use \(AppInfo.name)." }
            return
        }
        Haptics.success()
        birthdayError = nil
        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
            user.setBirthday(birthday)
        }
    }
}
