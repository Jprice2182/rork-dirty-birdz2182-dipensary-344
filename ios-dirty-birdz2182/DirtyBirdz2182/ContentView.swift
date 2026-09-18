import SwiftUI

/// Root view: shows the 21+ gate until verification and birthday are complete.
struct ContentView: View {
    @Environment(UserStore.self) private var user

    var body: some View {
        Group {
            if user.isVerified && !user.needsBirthday {
                MainTabView()
                    .transition(.opacity.combined(with: .scale(scale: 1.02)))
            } else {
                AgeGateView()
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.35), value: user.isVerified)
        .animation(.easeInOut(duration: 0.35), value: user.needsBirthday)
        .preferredColorScheme(.dark)
    }
}

/// Four-tab shell matching the Home / Search / Orders / Profile layout.
struct MainTabView: View {
    @Environment(CartStore.self) private var cart

    var body: some View {
        TabView {
            Tab("Home", systemImage: "house.fill") {
                HomeView()
            }

            Tab("Search", systemImage: "magnifyingglass") {
                SearchView()
            }

            Tab("Orders", systemImage: "bag.fill") {
                OrdersView()
            }
            .badge(cart.itemCount)

            Tab("Profile", systemImage: "person.fill") {
                ProfileView()
            }
        }
        .tint(Theme.primary)
    }
}
