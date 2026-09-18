import Foundation
import Observation

/// Persisted shape of the user profile.
nonisolated struct UserData: Codable, Sendable {
    var isVerified = false
    var name = ""
    var email = ""
    var phone = ""
    var birthday: Date?
    var addresses: [Address] = []
    var selectedAddressIndex = 0
    var isNewUser = true
    var hasUsedDiscount = false
    var hasUsedPromoCode = false
    var appRating: Int?
    var reviews: [Review] = []
    var notificationPreferences = NotificationPreferences()
    var lastBirthdayNotificationYear: Int?
    var hasClaimedBirthdayGiftThisYear = false
    var points = 0
    var pointsHistory: [PointsTransaction] = []
    var avatarSymbol = "bird.fill"
}

nonisolated struct Review: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let text: String
    let rating: Int
    let date: Date
}

/// Profile, loyalty points, addresses and birthday gift eligibility.
@Observable
final class UserStore {
    private static let storageKey = "user-storage"

    private(set) var data: UserData

    init() {
        data = Storage.load(UserData.self, key: Self.storageKey) ?? UserData()
    }

    private func persist() {
        Storage.save(data, key: Self.storageKey)
    }

    // MARK: - Verification & profile

    var isVerified: Bool { data.isVerified }
    var name: String { data.name }
    var points: Int { data.points }
    var birthday: Date? { data.birthday }
    var needsBirthday: Bool { data.birthday == nil }

    func verifyAge() {
        data.isVerified = true
        persist()
    }

    func updateProfile(name: String, email: String, phone: String) {
        data.name = name.trimmingCharacters(in: .whitespacesAndNewlines)
        data.email = email.trimmingCharacters(in: .whitespacesAndNewlines)
        data.phone = phone.trimmingCharacters(in: .whitespacesAndNewlines)
        persist()
    }

    func setAvatarSymbol(_ symbol: String) {
        data.avatarSymbol = symbol
        persist()
    }

    func setBirthday(_ date: Date) {
        data.birthday = date
        persist()
    }

    /// Age in whole years, used for the 21+ gate.
    var age: Int? {
        guard let birthday = data.birthday else { return nil }
        return Calendar.current.dateComponents([.year], from: birthday, to: Date()).year
    }

    // MARK: - Addresses

    var addresses: [Address] { data.addresses }

    var selectedAddress: Address? {
        guard data.addresses.indices.contains(data.selectedAddressIndex) else { return data.addresses.first }
        return data.addresses[data.selectedAddressIndex]
    }

    func addAddress(_ address: Address) {
        data.addresses.append(address)
        data.selectedAddressIndex = data.addresses.count - 1
        persist()
    }

    func updateAddress(_ address: Address) {
        guard let index = data.addresses.firstIndex(where: { $0.id == address.id }) else { return }
        data.addresses[index] = address
        persist()
    }

    func removeAddress(id: UUID) {
        guard let index = data.addresses.firstIndex(where: { $0.id == id }) else { return }
        data.addresses.remove(at: index)
        data.selectedAddressIndex = min(data.selectedAddressIndex, max(0, data.addresses.count - 1))
        persist()
    }

    func selectAddress(index: Int) {
        guard data.addresses.indices.contains(index) else { return }
        data.selectedAddressIndex = index
        persist()
    }

    var selectedAddressIndex: Int { data.selectedAddressIndex }

    // MARK: - Promotions

    var isNewUser: Bool { data.isNewUser }
    var hasUsedDiscount: Bool { data.hasUsedDiscount }
    var hasUsedPromoCode: Bool { data.hasUsedPromoCode }

    func markAsExistingUser() {
        data.isNewUser = false
        persist()
    }

    func markPromoCodeUsed() {
        data.hasUsedPromoCode = true
        data.hasUsedDiscount = true
        data.isNewUser = false
        persist()
    }

    // MARK: - Birthday gift

    /// True on the user's birthday when this year's free pre-roll has not been claimed.
    var isBirthdayToday: Bool {
        guard let birthday = data.birthday else { return false }
        let calendar = Calendar.current
        let today = calendar.dateComponents([.month, .day], from: Date())
        let birth = calendar.dateComponents([.month, .day], from: birthday)
        return today.month == birth.month && today.day == birth.day
    }

    var canClaimBirthdayGift: Bool {
        isBirthdayToday
            && data.notificationPreferences.birthdayPromotions
            && !data.hasClaimedBirthdayGiftThisYear
    }

    func claimBirthdayGift() {
        data.hasClaimedBirthdayGiftThisYear = true
        data.lastBirthdayNotificationYear = Calendar.current.component(.year, from: Date())
        persist()
    }

    /// Days until the next birthday, for the profile countdown.
    var daysUntilBirthday: Int? {
        guard let birthday = data.birthday else { return nil }
        let calendar = Calendar.current
        let components = calendar.dateComponents([.month, .day], from: birthday)
        guard let next = calendar.nextDate(
            after: Date(),
            matching: components,
            matchingPolicy: .nextTimePreservingSmallerComponents
        ) else { return nil }
        return calendar.dateComponents([.day], from: calendar.startOfDay(for: Date()), to: next).day
    }

    // MARK: - Notification preferences

    var notificationPreferences: NotificationPreferences { data.notificationPreferences }

    func updateNotificationPreferences(_ preferences: NotificationPreferences) {
        data.notificationPreferences = preferences
        persist()
    }

    // MARK: - Ratings & reviews

    var appRating: Int? { data.appRating }
    var reviews: [Review] { data.reviews }

    func setAppRating(_ rating: Int) {
        guard (1...5).contains(rating) else { return }
        data.appRating = rating
        persist()
    }

    func addReview(text: String, rating: Int) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, (1...5).contains(rating) else { return }
        data.reviews.insert(
            Review(id: UUID().uuidString, text: trimmed, rating: rating, date: Date()),
            at: 0
        )
        persist()
    }

    // MARK: - Loyalty points

    var pointsHistory: [PointsTransaction] { data.pointsHistory }

    /// Dollar value of the user's balance, capped by the redemption minimum.
    var redeemableValue: Double {
        guard data.points >= AppInfo.minimumRedeemablePoints else { return 0 }
        return Double(data.points) / AppInfo.pointsPerDollarRedeemed
    }

    func addPoints(_ amount: Int, detail: String) {
        guard amount > 0 else { return }
        data.points += amount
        data.pointsHistory.insert(
            PointsTransaction(id: UUID().uuidString, isEarned: true, amount: amount, detail: detail, date: Date()),
            at: 0
        )
        persist()
    }

    @discardableResult
    func redeemPoints(_ amount: Int, detail: String) -> Bool {
        guard amount > 0, data.points >= amount else { return false }
        data.points -= amount
        data.pointsHistory.insert(
            PointsTransaction(id: UUID().uuidString, isEarned: false, amount: amount, detail: detail, date: Date()),
            at: 0
        )
        persist()
        return true
    }

    // MARK: - Account

    func resetAccount() {
        data = UserData()
        Storage.remove(key: Self.storageKey)
    }
}
