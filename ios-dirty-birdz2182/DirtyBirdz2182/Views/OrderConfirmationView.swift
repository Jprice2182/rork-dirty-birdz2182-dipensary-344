import SwiftUI

/// Post-purchase success screen with an animated seal and order recap.
struct OrderConfirmationView: View {
    let orderID: String
    @Binding var path: [Route]

    @Environment(OrderStore.self) private var orders

    @State private var sealScale: CGFloat = 0.5
    @State private var sealOpacity: Double = 0
    @State private var ringProgress: CGFloat = 0

    private var order: Order? { orders.order(id: orderID) }

    var body: some View {
        ScrollView {
            VStack(spacing: 22) {
                seal

                VStack(spacing: 6) {
                    Text("Order Confirmed!")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundStyle(Theme.text)
                    if let order {
                        Text("Order #\(order.shortID)")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundStyle(Theme.subtext)
                    }
                }

                if let order {
                    etaCard(order)
                    itemsCard(order)
                    totalsCard(order)
                    pointsCard(order)
                }

                VStack(spacing: 10) {
                    Button("Track my order") {
                        Haptics.tap()
                        path = [.orderDetail(orderID)]
                    }
                    .buttonStyle(PrimaryButtonStyle())

                    Button("Back to home") {
                        Haptics.tap()
                        path.removeAll()
                    }
                    .buttonStyle(SecondaryButtonStyle())
                }
                .padding(.top, 4)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.canopy.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .navigationTitle("Confirmation")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden()
        .onAppear(perform: animateSeal)
    }

    private var seal: some View {
        ZStack {
            Circle()
                .stroke(Theme.primary.opacity(0.18), lineWidth: 6)
                .frame(width: 128, height: 128)

            Circle()
                .trim(from: 0, to: ringProgress)
                .stroke(Theme.emeraldSweep, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                .frame(width: 128, height: 128)
                .rotationEffect(.degrees(-90))

            Image(systemName: "checkmark")
                .font(.system(size: 52, weight: .bold))
                .foregroundStyle(Theme.primary)
                .scaleEffect(sealScale)
                .opacity(sealOpacity)
        }
        .padding(.top, 24)
        .shadow(color: Theme.primary.opacity(0.35), radius: 24)
    }

    private func animateSeal() {
        withAnimation(.easeOut(duration: 0.8)) { ringProgress = 1 }
        withAnimation(.spring(response: 0.5, dampingFraction: 0.5).delay(0.25)) {
            sealScale = 1
            sealOpacity = 1
        }
        Haptics.success()
    }

    private func etaCard(_ order: Order) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Estimated arrival", systemImage: "clock.fill")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(Theme.primary)

            Text(order.estimatedDelivery, style: .time)
                .font(.system(size: 26, weight: .bold))
                .foregroundStyle(Theme.text)

            Text(AppInfo.estimatedDeliveryTime)
                .font(.system(size: 13))
                .foregroundStyle(Theme.subtext)

            Divider().overlay(Theme.border)

            Label(order.deliveryAddress, systemImage: "mappin.and.ellipse")
                .font(.system(size: 13))
                .foregroundStyle(Theme.subtext)

            if let driver = order.driverName {
                Label("Driver: \(driver)", systemImage: "person.fill")
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)
            }

            if order.paymentMethod == .cash {
                Label("MUST SHOW ID BEFORE HANDING OVER MERCHANDISE", systemImage: "person.text.rectangle.fill")
                    .font(.system(size: 11, weight: .heavy))
                    .foregroundStyle(Theme.warning)
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Theme.warning.opacity(0.12), in: .rect(cornerRadius: 8))
            }
        }
        .cardSurface()
    }

    private func itemsCard(_ order: Order) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Items")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.text)
            ForEach(order.items) { item in
                HStack(alignment: .top) {
                    Text("\(item.quantity)× \(item.name)")
                        .font(.system(size: 14))
                        .foregroundStyle(Theme.subtext)
                    Spacer(minLength: 8)
                    Text((item.price * Double(item.quantity)).currency)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Theme.text)
                }
                if let variant = item.variantName {
                    Text(variant)
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.primary)
                }
            }
        }
        .cardSurface()
    }

    private func totalsCard(_ order: Order) -> some View {
        VStack(spacing: 8) {
            totalRow("Subtotal", order.subtotal.currency)
            if order.discount > 0 { totalRow("Discounts", "-\(order.discount.currency)", tint: Theme.primary) }
            totalRow("Delivery", order.deliveryFee == 0 ? "FREE" : order.deliveryFee.currency)
            totalRow("Tax", order.tax.currency)
            if order.tip > 0 { totalRow("Tip", order.tip.currency) }
            Divider().overlay(Theme.border)
            HStack {
                Text("Paid")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(Theme.text)
                Spacer()
                Text(order.total.currency)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(Theme.primary)
            }
            HStack {
                Image(systemName: order.paymentMethod.systemImage)
                    .font(.system(size: 12))
                Text(order.paymentMethod == .card
                     ? "Visa ending \(order.cardLast4 ?? "4242")"
                     : order.paymentMethod.title)
                Spacer()
            }
            .font(.system(size: 12))
            .foregroundStyle(Theme.subtext)
        }
        .cardSurface()
    }

    private func totalRow(_ label: String, _ value: String, tint: Color = Theme.text) -> some View {
        HStack {
            Text(label).font(.system(size: 14)).foregroundStyle(Theme.subtext)
            Spacer()
            Text(value).font(.system(size: 14, weight: .semibold)).foregroundStyle(tint)
        }
    }

    private func pointsCard(_ order: Order) -> some View {
        HStack(spacing: 12) {
            Image(systemName: "star.fill")
                .font(.system(size: 22))
                .foregroundStyle(Theme.primary)
            VStack(alignment: .leading, spacing: 2) {
                Text("+\(order.pointsEarned) points earned")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(Theme.text)
                Text("Points never expire — redeem them on any future order.")
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.subtext)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 0)
        }
        .padding(16)
        .background(Theme.primary.opacity(0.1), in: .rect(cornerRadius: 16))
        .overlay {
            RoundedRectangle(cornerRadius: 16).stroke(Theme.primary.opacity(0.3), lineWidth: 1)
        }
    }
}
