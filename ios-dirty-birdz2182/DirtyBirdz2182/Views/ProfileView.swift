import SwiftUI

/// Profile: identity, loyalty, addresses, preferences, support and legal.
struct ProfileView: View {
    @Environment(UserStore.self) private var user
    @Environment(AuthStore.self) private var auth
    @Environment(OrderStore.self) private var orders
    @Environment(CartStore.self) private var cart

    @State private var path: [Route] = []
    @State private var isEditing = false
    @State private var draftName = ""
    @State private var draftEmail = ""
    @State private var draftPhone = ""
    @State private var showAvatarPicker = false
    @State private var showNotifications = false
    @State private var showRateApp = false
    @State private var showDeleteAlert = false
    @State private var showBirthdayPicker = false
    @State private var birthdayDraft = Date()

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(spacing: 16) {
                    identityCard
                    statsRow
                    loyaltyRow
                    birthdayCard
                    accountSection
                    preferencesSection
                    supportSection
                    legalSection
                    dangerSection
                    versionFooter
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 32)
            }
            .background(Theme.background.ignoresSafeArea())
            .scrollIndicators(.hidden)
            .navigationTitle("Profile")
            .toolbarBackground(Theme.background, for: .navigationBar)
            .navigationDestination(for: Route.self) { RouteView(route: $0, path: $path) }
            .sheet(isPresented: $showAvatarPicker) { AvatarPickerSheet() }
            .sheet(isPresented: $showNotifications) { NotificationPreferencesSheet() }
            .sheet(isPresented: $showRateApp) { RateAppSheet() }
            .sheet(isPresented: $showBirthdayPicker) { birthdaySheet }
            .alert("Delete your account?", isPresented: $showDeleteAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Delete", role: .destructive) {
                    Haptics.warning()
                    user.resetAccount()
                    auth.deleteAccount()
                    orders.clearAll()
                    cart.clear()
                }
            } message: {
                Text("This permanently removes your profile, orders and \(user.points) loyalty points.")
            }
        }
        .tint(Theme.primary)
    }

    // MARK: - Identity

    private var identityCard: some View {
        VStack(spacing: 14) {
            Button {
                Haptics.tap()
                showAvatarPicker = true
            } label: {
                Image(systemName: user.data.avatarSymbol)
                    .font(.system(size: 38))
                    .foregroundStyle(Theme.primary)
                    .frame(width: 92, height: 92)
                    .background(Theme.primary.opacity(0.12), in: .circle)
                    .overlay {
                        Circle().stroke(Theme.primary.opacity(0.4), lineWidth: 2)
                    }
                    .overlay(alignment: .bottomTrailing) {
                        Image(systemName: "pencil.circle.fill")
                            .font(.system(size: 26))
                            .foregroundStyle(Theme.primary)
                            .background(Theme.card, in: .circle)
                    }
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Change avatar")

            if isEditing {
                VStack(spacing: 10) {
                    profileField("Name", text: $draftName)
                    profileField("Email", text: $draftEmail, keyboard: .emailAddress)
                    profileField("Phone", text: $draftPhone, keyboard: .phonePad)

                    HStack(spacing: 10) {
                        Button("Cancel") {
                            Haptics.tap()
                            withAnimation { isEditing = false }
                        }
                        .buttonStyle(SecondaryButtonStyle())

                        Button("Save") {
                            user.updateProfile(name: draftName, email: draftEmail, phone: draftPhone)
                            Haptics.success()
                            withAnimation { isEditing = false }
                        }
                        .buttonStyle(PrimaryButtonStyle())
                    }
                }
            } else {
                VStack(spacing: 4) {
                    Text(user.name.isEmpty ? "Add your name" : user.name)
                        .font(.system(size: 21, weight: .bold))
                        .foregroundStyle(user.name.isEmpty ? Theme.subtext : Theme.text)
                    if !user.data.email.isEmpty {
                        Text(user.data.email)
                            .font(.system(size: 14))
                            .foregroundStyle(Theme.subtext)
                    }
                    if !user.data.phone.isEmpty {
                        Text(user.data.phone)
                            .font(.system(size: 14))
                            .foregroundStyle(Theme.subtext)
                    }
                }

                Button {
                    Haptics.tap()
                    draftName = user.name
                    draftEmail = user.data.email
                    draftPhone = user.data.phone
                    withAnimation { isEditing = true }
                } label: {
                    Label("Edit profile", systemImage: "pencil")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Theme.primary)
                }
                .buttonStyle(.plain)
            }
        }
        .cardSurface()
    }

    private func profileField(_ placeholder: String, text: Binding<String>, keyboard: UIKeyboardType = .default) -> some View {
        TextField(placeholder, text: text)
            .keyboardType(keyboard)
            .textInputAutocapitalization(keyboard == .emailAddress ? .never : .words)
            .autocorrectionDisabled(keyboard == .emailAddress)
            .foregroundStyle(Theme.text)
            .padding(.horizontal, 12)
            .frame(height: 46)
            .background(Theme.background, in: .rect(cornerRadius: 10))
            .overlay {
                RoundedRectangle(cornerRadius: 10).stroke(Theme.border, lineWidth: 1)
            }
    }

    // MARK: - Stats

    private var statsRow: some View {
        HStack(spacing: 12) {
            statTile(value: "\(orders.orders.count)", label: "Orders", icon: "bag.fill")
            statTile(value: "\(user.points)", label: "Points", icon: "star.fill")
            statTile(
                value: user.appRating.map { "\($0).0" } ?? "—",
                label: "Your rating",
                icon: "hand.thumbsup.fill"
            )
        }
    }

    private func statTile(value: String, label: String, icon: String) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Theme.primary)
            Text(value)
                .font(.system(size: 19, weight: .bold))
                .foregroundStyle(Theme.text)
            Text(label)
                .font(.system(size: 11))
                .foregroundStyle(Theme.subtext)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(Theme.card, in: .rect(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14).stroke(Theme.border, lineWidth: 1)
        }
    }

    private var loyaltyRow: some View {
        Button {
            Haptics.tap()
            path.append(.pointsHistory)
        } label: {
            HStack(spacing: 12) {
                Image(systemName: "star.circle.fill")
                    .font(.system(size: 30))
                    .foregroundStyle(Theme.primary)
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(user.points) loyalty points")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(Theme.text)
                    Text(user.points >= AppInfo.minimumRedeemablePoints
                         ? "Worth \(user.redeemableValue.currency) off your next order"
                         : "Earn \(AppInfo.minimumRedeemablePoints - user.points) more to redeem")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.subtext)
                }
                Spacer(minLength: 0)
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Theme.subtext)
            }
            .cardSurface(padding: 16)
        }
        .buttonStyle(PressableCardStyle())
    }

    // MARK: - Birthday

    private var birthdayCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Birthday", systemImage: "birthday.cake.fill")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.text)

            if let birthday = user.birthday {
                Text(birthday, format: .dateTime.month(.wide).day().year())
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.subtext)

                if user.canClaimBirthdayGift {
                    Text("It's your birthday — claim your free 1g pre-roll on the home screen!")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Theme.primary)
                } else if let days = user.daysUntilBirthday {
                    Text("\(days) day\(days == 1 ? "" : "s") until your free birthday pre-roll.")
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.subtext)
                }
            }

            Button {
                Haptics.tap()
                birthdayDraft = user.birthday ?? Date()
                showBirthdayPicker = true
            } label: {
                Label("Update birthday", systemImage: "pencil")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Theme.primary)
            }
            .buttonStyle(.plain)
        }
        .cardSurface()
    }

    private var birthdaySheet: some View {
        NavigationStack {
            VStack(spacing: 18) {
                DatePicker("Birthday", selection: $birthdayDraft, in: ...Date(), displayedComponents: .date)
                    .datePickerStyle(.wheel)
                    .labelsHidden()

                Text("You must remain \(AppInfo.minAge)+ to use \(AppInfo.name).")
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)

                Button("Save birthday") {
                    let years = Calendar.current.dateComponents([.year], from: birthdayDraft, to: Date()).year ?? 0
                    guard years >= AppInfo.minAge else {
                        Haptics.warning()
                        return
                    }
                    user.setBirthday(birthdayDraft)
                    Haptics.success()
                    showBirthdayPicker = false
                }
                .buttonStyle(PrimaryButtonStyle())

                Spacer()
            }
            .padding(20)
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Your Birthday")
            .navigationBarTitleDisplayMode(.inline)
        }
        .presentationDetents([.medium])
    }

    // MARK: - Sections

    private var accountSection: some View {
        settingsGroup("Account") {
            settingsRow("Delivery addresses", icon: "mappin.and.ellipse", detail: "\(user.addresses.count)") {
                path.append(.addresses)
            }
            settingsRow("Order history", icon: "clock.arrow.circlepath", detail: "\(orders.orders.count)") {
                path.append(.pointsHistory)
            }
        }
    }

    private var preferencesSection: some View {
        settingsGroup("Preferences") {
            settingsRow("Notifications", icon: "bell.fill") { showNotifications = true }
            if let biometry = auth.biometryDescription() {
                HStack(spacing: 12) {
                    Image(systemName: "faceid")
                        .font(.system(size: 16))
                        .foregroundStyle(Theme.primary)
                        .frame(width: 26)
                    Toggle(biometry, isOn: Binding(
                        get: { auth.useBiometrics },
                        set: { auth.toggleBiometrics($0) }
                    ))
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.text)
                    .tint(Theme.primary)
                }
                .padding(.vertical, 10)
            }
        }
    }

    private var supportSection: some View {
        settingsGroup("Support") {
            settingsRow("Contact customer service", icon: "headphones") { path.append(.support) }
            settingsRow("Rate this app", icon: "star.fill") { showRateApp = true }
            settingsRow("Bulk / business orders", icon: "building.2.fill") { path.append(.bulkOrder) }
        }
    }

    private var legalSection: some View {
        settingsGroup("Legal") {
            settingsRow("Terms of Service", icon: "doc.text") { path.append(.terms) }
            settingsRow("Privacy Policy", icon: "lock.shield") { path.append(.privacy) }
        }
    }

    private var dangerSection: some View {
        VStack(spacing: 10) {
            if auth.isAuthenticated {
                Button("Sign out") {
                    Haptics.tap()
                    auth.signOut()
                }
                .buttonStyle(SecondaryButtonStyle())
            }

            Button("Delete account") { showDeleteAlert = true }
                .buttonStyle(SecondaryButtonStyle())
                .foregroundStyle(Theme.error)
        }
    }

    private var versionFooter: some View {
        VStack(spacing: 6) {
            Text("\(AppInfo.name) v\(AppInfo.version)")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(Theme.subtext)
            Text(AppInfo.legalDisclaimer)
                .font(.system(size: 10))
                .foregroundStyle(Theme.subtext.opacity(0.75))
                .multilineTextAlignment(.center)
        }
        .padding(.top, 8)
    }

    // MARK: - Settings helpers

    private func settingsGroup<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(.system(size: 11, weight: .bold))
                .kerning(1)
                .foregroundStyle(Theme.subtext)
                .padding(.leading, 4)
                .padding(.bottom, 4)
            VStack(spacing: 0) {
                content()
            }
            .cardSurface(padding: 16)
        }
    }

    private func settingsRow(
        _ title: String,
        icon: String,
        detail: String? = nil,
        action: @escaping () -> Void
    ) -> some View {
        Button {
            Haptics.tap()
            action()
        } label: {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundStyle(Theme.primary)
                    .frame(width: 26)
                Text(title)
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.text)
                Spacer(minLength: 0)
                if let detail {
                    Text(detail)
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.subtext)
                }
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.subtext)
            }
            .padding(.vertical, 11)
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
    }
}

/// SF Symbol avatar picker.
struct AvatarPickerSheet: View {
    @Environment(UserStore.self) private var user
    @Environment(\.dismiss) private var dismiss

    private let symbols = [
        "bird.fill", "leaf.fill", "flame.fill", "sparkles", "crown.fill",
        "bolt.fill", "moon.stars.fill", "sun.max.fill", "pawprint.fill",
        "star.fill", "heart.fill", "diamond.fill"
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 84), spacing: 14)], spacing: 14) {
                    ForEach(symbols, id: \.self) { symbol in
                        Button {
                            Haptics.select()
                            user.setAvatarSymbol(symbol)
                            dismiss()
                        } label: {
                            Image(systemName: symbol)
                                .font(.system(size: 30))
                                .foregroundStyle(user.data.avatarSymbol == symbol ? Theme.background : Theme.primary)
                                .frame(width: 84, height: 84)
                                .background(
                                    user.data.avatarSymbol == symbol ? Theme.primary : Theme.card,
                                    in: .rect(cornerRadius: 18)
                                )
                                .overlay {
                                    RoundedRectangle(cornerRadius: 18).stroke(Theme.border, lineWidth: 1)
                                }
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(20)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Choose Avatar")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationContentInteraction(.scrolls)
    }
}

/// Notification preference toggles.
struct NotificationPreferencesSheet: View {
    @Environment(UserStore.self) private var user
    @Environment(\.dismiss) private var dismiss

    @State private var preferences = NotificationPreferences()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 4) {
                    toggle("New flower drops", isOn: $preferences.newFlower, icon: "leaf.fill")
                    toggle("New edibles", isOn: $preferences.newEdibles, icon: "birthday.cake.fill")
                    toggle("New pre-rolls", isOn: $preferences.newPreRolls, icon: "flame.fill")
                    toggle("Promotions & specials", isOn: $preferences.promotions, icon: "tag.fill")
                    toggle("Order updates", isOn: $preferences.orderUpdates, icon: "shippingbox.fill")
                    toggle("Refund updates", isOn: $preferences.refundUpdates, icon: "arrow.uturn.backward")
                    toggle("Birthday rewards", isOn: $preferences.birthdayPromotions, icon: "gift.fill")
                }
                .cardSurface(padding: 16)
                .padding(20)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        user.updateNotificationPreferences(preferences)
                        Haptics.success()
                        dismiss()
                    }
                }
            }
            .onAppear { preferences = user.notificationPreferences }
        }
        .presentationDetents([.medium, .large])
        .presentationContentInteraction(.scrolls)
    }

    private func toggle(_ title: String, isOn: Binding<Bool>, icon: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Theme.primary)
                .frame(width: 24)
            Toggle(title, isOn: isOn)
                .font(.system(size: 15))
                .foregroundStyle(Theme.text)
                .tint(Theme.primary)
        }
        .padding(.vertical, 8)
    }
}

/// App rating + review capture.
struct RateAppSheet: View {
    @Environment(UserStore.self) private var user
    @Environment(\.dismiss) private var dismiss

    @State private var rating = 5
    @State private var review = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Image(systemName: "bird.fill")
                        .font(.system(size: 48))
                        .foregroundStyle(Theme.primary)
                        .padding(.top, 16)

                    Text("Enjoying \(AppInfo.name)?")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundStyle(Theme.text)

                    Text("Your feedback helps us serve Atlanta better.")
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.subtext)
                        .multilineTextAlignment(.center)

                    RatingPicker(rating: $rating)

                    TextField("Tell us more (optional)", text: $review, axis: .vertical)
                        .lineLimit(3...6)
                        .foregroundStyle(Theme.text)
                        .padding(12)
                        .background(Theme.card, in: .rect(cornerRadius: 12))
                        .overlay {
                            RoundedRectangle(cornerRadius: 12).stroke(Theme.border, lineWidth: 1)
                        }

                    Button("Submit") {
                        user.setAppRating(rating)
                        if !review.trimmingCharacters(in: .whitespaces).isEmpty {
                            user.addReview(text: review, rating: rating)
                        }
                        Haptics.success()
                        dismiss()
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }
                .padding(20)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("Rate App")
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
}
