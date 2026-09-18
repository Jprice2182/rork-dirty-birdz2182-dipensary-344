import SwiftUI

/// Resolves a `Route` to its destination view, sharing one navigation path per tab.
struct RouteView: View {
    let route: Route
    @Binding var path: [Route]

    var body: some View {
        switch route {
        case .product(let id):
            ProductDetailView(productID: id, path: $path)
        case .category(let id):
            CategoryView(categoryID: id, path: $path)
        case .cart:
            CartView(path: $path)
        case .checkout:
            CheckoutView(path: $path)
        case .orderConfirmation(let id):
            OrderConfirmationView(orderID: id, path: $path)
        case .orderDetail(let id):
            OrderDetailView(orderID: id, path: $path)
        case .bulkOrder:
            BulkOrderView()
        case .pointsHistory:
            PointsHistoryView()
        case .addresses:
            AddressesView()
        case .terms:
            LegalDocumentView(title: "Terms of Service", sections: LegalContent.terms)
        case .privacy:
            LegalDocumentView(title: "Privacy Policy", sections: LegalContent.privacy)
        case .support:
            SupportView()
        }
    }
}
