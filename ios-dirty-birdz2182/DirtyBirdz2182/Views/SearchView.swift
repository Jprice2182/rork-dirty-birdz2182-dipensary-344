import SwiftUI

/// Search across the catalog with category filter chips and a product grid.
struct SearchView: View {
    @Environment(CartStore.self) private var cart

    @State private var path: [Route] = []
    @State private var query = ""
    @State private var selectedCategoryID: String?

    private let columns = [
        GridItem(.flexible(), spacing: 14),
        GridItem(.flexible(), spacing: 14)
    ]

    private var results: [Product] {
        Catalog.search(query, categoryID: selectedCategoryID)
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(spacing: 18) {
                    searchField
                    filterChips

                    HStack {
                        Text("\(results.count) product\(results.count == 1 ? "" : "s")")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Theme.subtext)
                        Spacer()
                        if selectedCategoryID != nil || !query.isEmpty {
                            Button("Clear") {
                                Haptics.tap()
                                withAnimation(.easeOut(duration: 0.2)) {
                                    query = ""
                                    selectedCategoryID = nil
                                }
                            }
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Theme.primary)
                        }
                    }

                    if results.isEmpty {
                        EmptyStateView(
                            systemImage: "magnifyingglass",
                            title: "No products found",
                            message: "Try a different strain, effect or category."
                        )
                    } else {
                        LazyVGrid(columns: columns, spacing: 14) {
                            ForEach(results) { product in
                                ProductCardView(
                                    product: product,
                                    onTap: { path.append(.product(product.id)) },
                                    onQuickAdd: quickAddAction(for: product)
                                )
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 32)
            }
            .background(Theme.background.ignoresSafeArea())
            .scrollIndicators(.hidden)
            .scrollDismissesKeyboard(.immediately)
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Theme.background, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    CartToolbarButton { path.append(.cart) }
                }
            }
            .navigationDestination(for: Route.self) { RouteView(route: $0, path: $path) }
        }
        .tint(Theme.primary)
    }

    private var searchField: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(Theme.subtext)
            TextField("Search strains, effects, edibles", text: $query)
                .foregroundStyle(Theme.text)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
            if !query.isEmpty {
                Button {
                    Haptics.tap()
                    query = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(Theme.subtext)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, 14)
        .frame(height: 50)
        .background(Theme.card, in: .rect(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14)
                .stroke(Theme.border, lineWidth: 1)
        }
    }

    private var filterChips: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 8) {
                chip(title: "All", id: nil)
                ForEach(Catalog.categories) { category in
                    chip(title: category.name, id: category.id)
                }
            }
            .padding(.vertical, 2)
        }
        .scrollIndicators(.hidden)
    }

    private func chip(title: String, id: String?) -> some View {
        let isSelected = selectedCategoryID == id
        return Button {
            Haptics.select()
            withAnimation(.spring(response: 0.3, dampingFraction: 0.75)) {
                selectedCategoryID = id
            }
        } label: {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(isSelected ? Theme.background : Theme.text)
                .padding(.horizontal, 14)
                .padding(.vertical, 9)
                .background(isSelected ? Theme.primary : Theme.card, in: .capsule)
                .overlay {
                    Capsule().stroke(isSelected ? .clear : Theme.border, lineWidth: 1)
                }
        }
        .buttonStyle(.plain)
    }

    /// Products with variants must be configured on the detail screen.
    private func quickAddAction(for product: Product) -> (() -> Void)? {
        guard product.variants?.isEmpty ?? true else { return nil }
        return { cart.add(productID: product.id) }
    }
}

/// Reusable cart button for navigation bars.
struct CartToolbarButton: View {
    @Environment(CartStore.self) private var cart
    let action: () -> Void

    var body: some View {
        Button {
            Haptics.tap()
            action()
        } label: {
            Image(systemName: "cart.fill")
                .foregroundStyle(Theme.text)
                .overlay(alignment: .topTrailing) {
                    if cart.itemCount > 0 {
                        Text("\(min(cart.itemCount, 99))")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundStyle(Theme.text)
                            .frame(minWidth: 16, minHeight: 16)
                            .background(Theme.primary, in: .circle)
                            .offset(x: 8, y: -8)
                    }
                }
        }
        .accessibilityLabel("Cart, \(cart.itemCount) items")
    }
}
