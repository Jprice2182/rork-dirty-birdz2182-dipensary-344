//
//  DirtyBirdz2182App.swift
//  DirtyBirdz2182
//

import SwiftUI

@main
struct DirtyBirdz2182App: App {
    @State private var user = UserStore()
    @State private var cart = CartStore()
    @State private var orders = OrderStore()
    @State private var auth = AuthStore()

    init() {
        Self.configureNavigationAppearance()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(user)
                .environment(cart)
                .environment(orders)
                .environment(auth)
        }
    }

    /// Keeps navigation and tab chrome on-brand in dark mode.
    private static func configureNavigationAppearance() {
        let background = UIColor(Theme.background)
        let text = UIColor(Theme.text)

        let navAppearance = UINavigationBarAppearance()
        navAppearance.configureWithOpaqueBackground()
        navAppearance.backgroundColor = background
        navAppearance.titleTextAttributes = [.foregroundColor: text]
        navAppearance.largeTitleTextAttributes = [.foregroundColor: text]
        navAppearance.shadowColor = UIColor(Theme.border)

        UINavigationBar.appearance().standardAppearance = navAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navAppearance
        UINavigationBar.appearance().compactAppearance = navAppearance

        let tabAppearance = UITabBarAppearance()
        tabAppearance.configureWithOpaqueBackground()
        tabAppearance.backgroundColor = background
        tabAppearance.shadowColor = UIColor(Theme.border)

        UITabBar.appearance().standardAppearance = tabAppearance
        UITabBar.appearance().scrollEdgeAppearance = tabAppearance
    }
}
