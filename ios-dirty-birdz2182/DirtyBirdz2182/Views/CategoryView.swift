import SwiftUI

/// Product grid for a single category or flower strain.
struct CategoryView: View {
    let categoryID: String
    @Binding var path: [Route]

    @Environment(CartStore.self) private var cart

    private let columns = [
        GridItem(.flexible(), spacing: 14),
        GridItem(.flexible(), spacing: 14)
    ]

    private var category: ProductCategory? { Catalog.category(id: categoryID) }
    private var products: [Product] { Catalog.products(categoryID: categoryID) }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                if let category {
                    header(category)
                }

                if products.isEmpty {
                    EmptyStateView(
                        systemImage: "leaf",
                        title: "Nothing here yet",
                        message: "We're restocking this category. Check back soon."
                    )
                } else {
                    LazyVGrid(columns: columns, spacing: 14) {
                        ForEach(products) { product in
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
        .navigationTitle(category?.name ?? "Products")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                CartToolbarButton { path.append(.cart) }
            }
        }
    }

    private func header(_ category: ProductCategory) -> some View {
        HStack(spacing: 14) {
            Image(systemName: category.icon)
                .font(.system(size: 24))
                .foregroundStyle(Theme.primary)
                .frame(width: 52, height: 52)
                .background(Theme.primary.opacity(0.14), in: .rect(cornerRadius: 14))

            VStack(alignment: .leading, spacing: 3) {
                Text("\(products.count) product\(products.count == 1 ? "" : "s")")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(Theme.text)
                Text(category.parentCategory == nil
                     ? "Premium quality, delivered"
                     : Catalog.strainDescription(category.name))
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
        .cardSurface(padding: 16)
    }

    private func quickAddAction(for product: Product) -> (() -> Void)? {
        guard product.variants?.isEmpty ?? true else { return nil }
        return { cart.add(productID: product.id) }
    }
}
