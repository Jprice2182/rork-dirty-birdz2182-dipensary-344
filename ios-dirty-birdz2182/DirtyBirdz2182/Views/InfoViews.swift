import SwiftUI

/// Customer service contact details and operating hours.
struct SupportView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 14) {
                    Text("We're here to help")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(Theme.text)

                    contactRow(
                        icon: "envelope.fill",
                        title: "Email",
                        value: AppInfo.Support.email,
                        url: URL(string: "mailto:\(AppInfo.Support.email)")
                    )
                    Divider().overlay(Theme.border)
                    contactRow(
                        icon: "phone.fill",
                        title: "Phone",
                        value: AppInfo.Support.phone,
                        url: URL(string: "tel://\(AppInfo.Support.phone.filter(\.isNumber))")
                    )
                    Divider().overlay(Theme.border)
                    contactRow(icon: "clock.fill", title: "Hours", value: AppInfo.Support.hours, url: nil)
                    Divider().overlay(Theme.border)
                    contactRow(icon: "mappin.and.ellipse", title: "Address", value: AppInfo.Support.address, url: nil)
                }
                .cardSurface()

                VStack(alignment: .leading, spacing: 10) {
                    Text("Operating Hours")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(Theme.text)

                    ForEach(AppInfo.operatingHours, id: \.day) { entry in
                        HStack {
                            Text(entry.day)
                                .font(.system(size: 14))
                                .foregroundStyle(Theme.subtext)
                            Spacer()
                            Text(entry.hours)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(Theme.text)
                        }
                    }
                }
                .cardSurface()

                VStack(alignment: .leading, spacing: 10) {
                    Text("Follow Us")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundStyle(Theme.text)
                    socialRow(icon: "camera.fill", handle: AppInfo.Social.instagram, network: "Instagram")
                    socialRow(icon: "bird.fill", handle: AppInfo.Social.twitter, network: "Twitter")
                    socialRow(icon: "person.2.fill", handle: AppInfo.Social.facebook, network: "Facebook")
                }
                .cardSurface()
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .navigationTitle("Customer Service")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func contactRow(icon: String, title: String, value: String, url: URL?) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(Theme.primary)
                .frame(width: 26)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Theme.subtext)
                if let url {
                    Link(value, destination: url)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(Theme.primary)
                } else {
                    Text(value)
                        .font(.system(size: 15))
                        .foregroundStyle(Theme.text)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            Spacer(minLength: 0)
        }
    }

    private func socialRow(icon: String, handle: String, network: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Theme.primary)
                .frame(width: 24)
            Text(network)
                .font(.system(size: 14))
                .foregroundStyle(Theme.subtext)
            Spacer()
            Text(handle)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Theme.text)
        }
    }
}

/// Static legal document renderer used for Terms and Privacy.
struct LegalDocumentView: View {
    let title: String
    let sections: [(heading: String, body: String)]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Last updated September 2026")
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.subtext)

                ForEach(sections, id: \.heading) { section in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(section.heading)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundStyle(Theme.text)
                        Text(section.body)
                            .font(.system(size: 15))
                            .foregroundStyle(Theme.subtext)
                            .lineSpacing(4)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                Text(AppInfo.legalDisclaimer)
                    .font(.system(size: 11))
                    .foregroundStyle(Theme.subtext.opacity(0.8))
                    .padding(.top, 8)
            }
            .padding(20)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
    }
}

nonisolated enum LegalContent {
    static let terms: [(heading: String, body: String)] = [
        ("1. Eligibility", "You must be at least \(AppInfo.minAge) years of age to create an account, browse products, or place an order with \(AppInfo.name). We verify age at signup and our drivers verify a valid government-issued ID at the time of delivery."),
        ("2. Shipping & Delivery Only", "\(AppInfo.name) operates exclusively as a shipping and delivery service. We do not offer walk-in or in-person pickup. Deliveries are made within our published service area during operating hours."),
        ("3. Orders & Pricing", "All prices are listed in US dollars and are subject to change. Delivery is \(AppInfo.deliveryFee.currency), waived on orders of \(AppInfo.freeDeliveryMinimum.currency) or more. Applicable taxes are calculated at checkout."),
        ("4. Identification at Delivery", "A valid, unexpired government-issued photo ID matching the account holder must be presented before merchandise is released. Orders that cannot be verified will be returned and may be subject to a restocking fee."),
        ("5. Loyalty Points", "You earn 1 point for every $1 spent on delivered orders. Points never expire and may be redeemed toward future orders. Points carry no cash value and cannot be transferred or sold."),
        ("6. Refunds", "\(AppInfo.RefundPolicy.description). Refund requests must be submitted within \(AppInfo.RefundPolicy.timeLimitHours) hours of delivery. Approved refunds are processed within \(AppInfo.RefundPolicy.processingTime)."),
        ("7. Acceptable Use", "You agree not to resell products purchased through \(AppInfo.name) unless you have entered a separate wholesale agreement with us. Accounts engaged in fraudulent activity may be suspended."),
        ("8. Limitation of Liability", "Products are provided as-is. \(AppInfo.name) is not liable for indirect or consequential damages arising from product use. Consult a physician before use if you are pregnant, nursing, or taking medication.")
    ]

    static let privacy: [(heading: String, body: String)] = [
        ("Information We Collect", "We collect the name, email address, phone number, date of birth and delivery addresses you provide, along with your order history and loyalty points balance."),
        ("Why We Collect It", "Your date of birth is required by law to verify you are \(AppInfo.minAge) or older. Contact and address details are used to fulfill deliveries and to reach you about your orders."),
        ("Local Storage", "Your profile, cart, orders and points are stored locally on your device. Deleting the app or your account removes this data from the device."),
        ("Sharing", "We share only the minimum information necessary with delivery drivers to complete your order. We do not sell your personal information to third parties."),
        ("Notifications", "If you opt in, we send notifications about order status, new products, promotions and your annual birthday reward. You can change these preferences at any time in your profile."),
        ("Your Choices", "You may edit your profile, update your addresses, adjust notification preferences, or permanently delete your account from the Profile tab at any time."),
        ("Contact Us", "Questions about this policy can be sent to \(AppInfo.Support.email) or \(AppInfo.Support.phone).")
    ]
}
