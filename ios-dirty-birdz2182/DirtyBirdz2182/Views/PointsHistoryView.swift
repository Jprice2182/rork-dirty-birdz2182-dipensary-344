import SwiftUI

/// Loyalty balance, redemption explainer and the full points ledger.
struct PointsHistoryView: View {
    @Environment(UserStore.self) private var user

    @State private var animatedBalance = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                balanceCard
                explainerCard

                if user.pointsHistory.isEmpty {
                    EmptyStateView(
                        systemImage: "star",
                        title: "No points activity yet",
                        message: "Place your first order to start earning 1 point for every $1 spent."
                    )
                } else {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Activity")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundStyle(Theme.text)

                        ForEach(user.pointsHistory) { transaction in
                            transactionRow(transaction)
                            if transaction.id != user.pointsHistory.last?.id {
                                Divider().overlay(Theme.border)
                            }
                        }
                    }
                    .cardSurface()
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.canopy.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .navigationTitle("Loyalty Points")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var balanceCard: some View {
        VStack(spacing: 10) {
            Image(systemName: "star.circle.fill")
                .font(.system(size: 44))
                .foregroundStyle(Theme.primary)

            Text("\(animatedBalance ? user.points : 0)")
                .font(.system(size: 52, weight: .bold))
                .foregroundStyle(Theme.text)
                .contentTransition(.numericText())

            Text("points available")
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(Theme.subtext)

            if user.points >= AppInfo.minimumRedeemablePoints {
                Text("Worth \(user.redeemableValue.currency) at checkout")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(Theme.primary)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Theme.primary.opacity(0.14), in: .capsule)
            } else {
                Text("Earn \(AppInfo.minimumRedeemablePoints - user.points) more points to redeem")
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)
            }
        }
        .frame(maxWidth: .infinity)
        .cardSurface(padding: 24, cornerRadius: 20)
        .onAppear {
            withAnimation(.spring(response: 0.9, dampingFraction: 0.85).delay(0.1)) {
                animatedBalance = true
            }
        }
    }

    private var explainerCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("How points work")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(Theme.text)

            explainerRow(icon: "cart.fill", text: "Earn 1 point for every $1 you spend on delivered orders.")
            explainerRow(icon: "infinity", text: "Points never expire — save them as long as you like.")
            explainerRow(
                icon: "gift.fill",
                text: "Redeem \(AppInfo.minimumRedeemablePoints)+ points at checkout. \(Int(AppInfo.pointsPerDollarRedeemed)) points = $1 off."
            )
        }
        .cardSurface()
    }

    private func explainerRow(icon: String, text: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Theme.primary)
                .frame(width: 24)
            Text(text)
                .font(.system(size: 14))
                .foregroundStyle(Theme.subtext)
                .fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 0)
        }
    }

    private func transactionRow(_ transaction: PointsTransaction) -> some View {
        HStack(spacing: 12) {
            Image(systemName: transaction.isEarned ? "arrow.up.circle.fill" : "arrow.down.circle.fill")
                .font(.system(size: 26))
                .foregroundStyle(transaction.isEarned ? Theme.primary : Theme.warning)

            VStack(alignment: .leading, spacing: 2) {
                Text(transaction.detail)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Theme.text)
                    .lineLimit(1)
                Text(transaction.date, format: .dateTime.month().day().year())
                    .font(.system(size: 12))
                    .foregroundStyle(Theme.subtext)
            }

            Spacer(minLength: 0)

            Text("\(transaction.isEarned ? "+" : "-")\(transaction.amount)")
                .font(.system(size: 16, weight: .bold))
                .foregroundStyle(transaction.isEarned ? Theme.primary : Theme.warning)
        }
        .padding(.vertical, 4)
    }
}
