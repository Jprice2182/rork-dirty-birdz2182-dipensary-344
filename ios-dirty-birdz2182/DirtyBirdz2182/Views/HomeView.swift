import SwiftUI

/// Home: loyalty balance, promos, the Atlanta editorial, bulk orders and category entry points.
struct HomeView: View {
    @Environment(UserStore.self) private var user
    @Environment(CartStore.self) private var cart

    @State private var path: [Route] = []
    @State private var showDiscountBanner = true
    @State private var showEighthsBanner = true
    @State private var showBirthdayGift = false
    @State private var pointsAppeared = false

    private var shouldShowDiscountBanner: Bool {
        user.isNewUser && !user.hasUsedDiscount && showDiscountBanner
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(spacing: 24) {
                    header
                    loyaltyCard

                    if shouldShowDiscountBanner {
                        DiscountBanner { dismissDiscountBanner() }
                            .transition(.scale(scale: 0.95).combined(with: .opacity))
                    }

                    if showEighthsBanner && !cart.eighthsPromotion.eligible {
                        EighthsPromoBanner {
                            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                showEighthsBanner = false
                            }
                        }
                        .transition(.scale(scale: 0.95).combined(with: .opacity))
                    }

                    if user.canClaimBirthdayGift {
                        BirthdayBanner { showBirthdayGift = true }
                            .transition(.scale(scale: 0.95).combined(with: .opacity))
                    }

                    hawkHero
                    biography
                    bulkOrderCard
                    categoriesSection
                    strainSection
                    legalFooter
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 32)
            }
            .background(Theme.canopy.ignoresSafeArea())
            .scrollIndicators(.hidden)
            .refreshable {
                try? await Task.sleep(for: .seconds(0.6))
            }
            .navigationDestination(for: Route.self) { RouteView(route: $0, path: $path) }
            .sheet(isPresented: $showBirthdayGift) {
                BirthdayGiftSheet()
            }
        }
        .tint(Theme.primary)
    }

    // MARK: - Header

    private var header: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(user.name.isEmpty ? "Welcome to Atlanta" : "Welcome back, \(user.name)")
                    .font(.system(size: 16))
                    .foregroundStyle(Theme.subtext)
                Text(AppInfo.name)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundStyle(Theme.text)
                Text(AppInfo.slogan)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(Theme.primary)
            }

            Spacer(minLength: 0)

            HStack(spacing: 10) {
                HStack(spacing: 5) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 13))
                        .foregroundStyle(Theme.primary)
                    Text("\(user.points)")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(Theme.text)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 9)
                .background(Theme.card, in: .capsule)

                cartButton
            }
        }
        .padding(.top, 8)
    }

    private var cartButton: some View {
        Button {
            Haptics.tap()
            path.append(.cart)
        } label: {
            Image(systemName: "cart.fill")
                .font(.system(size: 19))
                .foregroundStyle(Theme.text)
                .frame(width: 48, height: 48)
                .background(Theme.card, in: .circle)
                .overlay(alignment: .topTrailing) {
                    if cart.itemCount > 0 {
                        Text(cart.itemCount > 99 ? "99+" : "\(cart.itemCount)")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundStyle(Theme.text)
                            .padding(.horizontal, 6)
                            .frame(minWidth: 22, minHeight: 22)
                            .background(Theme.primary, in: .capsule)
                            .overlay { Capsule().stroke(Theme.background, lineWidth: 2) }
                            .offset(x: 6, y: -6)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .animation(.spring(response: 0.3, dampingFraction: 0.6), value: cart.itemCount)
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Shopping cart with \(cart.itemCount) items")
    }

    // MARK: - Loyalty

    private var loyaltyCard: some View {
        Button {
            Haptics.tap()
            path.append(.pointsHistory)
        } label: {
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 8) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 17))
                        .foregroundStyle(Theme.primary)
                    Text("Loyalty Points")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundStyle(Theme.text)
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Theme.subtext)
                }

                Text("\(pointsAppeared ? user.points : 0) Points")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundStyle(Theme.primary)
                    .contentTransition(.numericText())

                Text("Earn 1 point for every $1 spent • Points never expire • Redeem points for rewards with your orders")
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.subtext)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .cardSurface()
        }
        .buttonStyle(PressableCardStyle())
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.85).delay(0.15)) {
                pointsAppeared = true
            }
        }
    }

    // MARK: - Hero & editorial

    private var hawkHero: some View {
        RemoteImage(urlString: AppInfo.hawkImage, height: 240, cornerRadius: 20)
            .overlay(alignment: .bottomLeading) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(AppInfo.Mascot.name)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(.white)
                    Text(AppInfo.Mascot.symbolism)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(Theme.secondary)
                }
                .padding(18)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background {
                    LinearGradient(
                        colors: [.clear, .black.opacity(0.75)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                }
            }
            .clipShape(.rect(cornerRadius: 20))
            .shadow(color: Theme.primary.opacity(0.15), radius: 10, y: 4)
    }

    private var biography: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(spacing: 6) {
                Text("Atlanta: The Heart of the South")
                    .font(.system(size: 23, weight: .bold))
                    .foregroundStyle(Theme.text)
                    .multilineTextAlignment(.center)
                Text("Where Culture Meets Cannabis Freedom")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Theme.primary)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(.bottom, 4)

            ForEach(AppInfo.atlantaBiography, id: \.self) { paragraph in
                Text(paragraph)
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.subtext)
                    .lineSpacing(5)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Divider().overlay(Theme.border).padding(.vertical, 4)

            Text("Cannabis Freedom in Georgia")
                .font(.system(size: 18, weight: .bold))
                .foregroundStyle(Theme.primary)

            ForEach(AppInfo.cannabisFreedom, id: \.self) { paragraph in
                Text(paragraph)
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.subtext)
                    .lineSpacing(5)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .cardSurface(padding: 24, cornerRadius: 20)
    }

    // MARK: - Bulk orders

    private var bulkOrderCard: some View {
        Button {
            Haptics.tap()
            path.append(.bulkOrder)
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Label("Business orders", systemImage: "building.2.fill")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(Theme.text)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Theme.primary.opacity(0.22), in: .capsule)
                    Spacer()
                    Image(systemName: "arrow.right")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundStyle(Theme.primary)
                }
                .padding(.bottom, 16)

                Text("Need bulk products for your business?")
                    .font(.system(size: 23, weight: .bold))
                    .foregroundStyle(Theme.text)
                    .multilineTextAlignment(.leading)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(.bottom, 10)

                Text("Submit your business name, phone number, address, and a message so our team can contact you about bulk purchasing.")
                    .font(.system(size: 15))
                    .foregroundStyle(Color(hex: 0xB7C9C2))
                    .lineSpacing(3)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(.bottom, 18)

                Text("Open bulk inquiry form")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(Theme.text)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Theme.primary, in: .rect(cornerRadius: 14))
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
                RoundedRectangle(cornerRadius: 24)
                    .stroke(Theme.primary.opacity(0.28), lineWidth: 1)
            }
        }
        .buttonStyle(PressableCardStyle())
    }

    // MARK: - Categories

    private var categoriesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionHeader(title: "Shop Categories", subtitle: "Discover premium cannabis products")

            ScrollView(.horizontal) {
                HStack(spacing: 12) {
                    ForEach(Catalog.mainCategories) { category in
                        categoryCard(category)
                    }
                }
                .padding(.vertical, 4)
            }
            .scrollIndicators(.hidden)
            .contentMargins(.horizontal, 0, for: .scrollContent)
        }
    }

    private func categoryCard(_ category: ProductCategory) -> some View {
        Button {
            Haptics.tap()
            path.append(.category(category.id))
        } label: {
            VStack(alignment: .leading, spacing: 10) {
                Image(systemName: category.icon)
                    .font(.system(size: 26))
                    .foregroundStyle(Theme.primary)
                    .frame(width: 52, height: 52)
                    .background(Theme.primary.opacity(0.14), in: .rect(cornerRadius: 14))

                Text(category.name)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(Theme.text)

                Text("\(Catalog.products(categoryID: category.id).count) products")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(Theme.subtext)
            }
            .padding(16)
            .frame(width: 150, alignment: .leading)
            .background(Theme.card, in: .rect(cornerRadius: 18))
            .overlay {
                RoundedRectangle(cornerRadius: 18)
                    .stroke(Theme.border, lineWidth: 1)
            }
        }
        .buttonStyle(PressableCardStyle())
    }

    // MARK: - Strains

    private var strainSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            SectionHeader(title: "Choose Your Strain", subtitle: "Select from our premium flower varieties")

            ForEach(Catalog.flowerStrainCategories) { strain in
                Button {
                    Haptics.tap()
                    path.append(.category(strain.id))
                } label: {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 16) {
                            Image(systemName: strain.icon)
                                .font(.system(size: 26))
                                .foregroundStyle(Theme.primary)
                                .frame(width: 48, height: 48)
                                .background(Theme.primary.opacity(0.14), in: .circle)

                            VStack(alignment: .leading, spacing: 3) {
                                Text(strain.name)
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundStyle(Theme.text)
                                Text("\(Catalog.products(categoryID: strain.id).count) premium strains available")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundStyle(Theme.primary)
                            }
                            Spacer(minLength: 0)
                        }

                        Text(Catalog.strainDescription(strain.name))
                            .font(.system(size: 14))
                            .foregroundStyle(Theme.subtext)
                            .fixedSize(horizontal: false, vertical: true)

                        HStack {
                            Spacer()
                            HStack(spacing: 5) {
                                Text("View All")
                                Image(systemName: "arrow.right")
                                    .font(.system(size: 12, weight: .bold))
                            }
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(Theme.primary)
                        }
                    }
                    .cardSurface()
                }
                .buttonStyle(PressableCardStyle())
            }
        }
    }

    private var legalFooter: some View {
        Text(AppInfo.legalDisclaimer)
            .font(.system(size: 11))
            .foregroundStyle(Theme.subtext.opacity(0.8))
            .multilineTextAlignment(.center)
            .padding(.horizontal, 8)
            .padding(.top, 8)
    }

    private func dismissDiscountBanner() {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
            showDiscountBanner = false
        }
        if user.isNewUser { user.markAsExistingUser() }
    }
}

/// Birthday reward sheet: claims the free 1g pre-roll into the cart.
struct BirthdayGiftSheet: View {
    @Environment(UserStore.self) private var user
    @Environment(CartStore.self) private var cart
    @Environment(\.dismiss) private var dismiss

    @State private var claimed = false

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(systemName: claimed ? "checkmark.seal.fill" : "gift.fill")
                    .font(.system(size: 64))
                    .foregroundStyle(claimed ? Theme.primary : Color(hex: 0xEC4899))
                    .padding(.top, 32)

                Text(claimed ? "Gift Added!" : "Happy Birthday\(user.name.isEmpty ? "" : ", \(user.name)")!")
                    .font(.system(size: 26, weight: .bold))
                    .foregroundStyle(Theme.text)
                    .multilineTextAlignment(.center)

                Text(claimed
                     ? "Your free 1g pre-roll is in your cart. Add it to any delivery order — no minimum required."
                     : "As a thank you for being part of the flock, enjoy a free 1g classic pre-roll delivered with your next order.")
                    .font(.system(size: 15))
                    .foregroundStyle(Theme.subtext)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 8)

                VStack(alignment: .leading, spacing: 10) {
                    Label("Free 1g Classic Pre-Roll", systemImage: "leaf.fill")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(Theme.text)
                    Label("Delivered with your order", systemImage: "truck.box.fill")
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.subtext)
                    Label("Valid today only", systemImage: "clock.fill")
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.subtext)
                }
                .cardSurface()

                if claimed {
                    Button("Done") { dismiss() }
                        .buttonStyle(PrimaryButtonStyle())
                } else {
                    Button("Claim my free pre-roll") {
                        cart.add(productID: "500", variantID: "single")
                        user.claimBirthdayGift()
                        Haptics.success()
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.75)) { claimed = true }
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }

                Text(AppInfo.legalDisclaimer)
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.subtext.opacity(0.75))
                    .multilineTextAlignment(.center)
            }
            .padding(24)
        }
        .background(Theme.canopy.ignoresSafeArea())
        .presentationDetents([.large])
        .presentationContentInteraction(.scrolls)
    }
}
