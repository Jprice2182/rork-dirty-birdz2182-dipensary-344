import Foundation
import LocalAuthentication
import Observation

nonisolated struct AuthData: Codable, Sendable {
    var isAuthenticated = false
    var email = ""
    var useBiometrics = false
    var hasSetupBiometrics = false
}

/// Demo credential store with optional Face ID / Touch ID unlock.
@Observable
final class AuthStore {
    private static let storageKey = "auth-storage"

    private(set) var data: AuthData
    var lastError: String?

    init() {
        data = Storage.load(AuthData.self, key: Self.storageKey) ?? AuthData()
    }

    private func persist() {
        Storage.save(data, key: Self.storageKey)
    }

    var isAuthenticated: Bool { data.isAuthenticated }
    var email: String { data.email }
    var useBiometrics: Bool { data.useBiometrics }

    @discardableResult
    func signIn(email: String, password: String) -> Bool {
        guard !email.trimmingCharacters(in: .whitespaces).isEmpty,
              !password.trimmingCharacters(in: .whitespaces).isEmpty
        else {
            lastError = "Enter both your email and password."
            return false
        }
        data.isAuthenticated = true
        data.email = email
        lastError = nil
        persist()
        return true
    }

    func signOut() {
        data.isAuthenticated = false
        persist()
    }

    func toggleBiometrics(_ enabled: Bool) {
        data.useBiometrics = enabled
        if enabled { data.hasSetupBiometrics = true }
        persist()
    }

    /// Describes the biometry the device offers, or nil when unavailable.
    func biometryDescription() -> String? {
        let context = LAContext()
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return nil
        }
        switch context.biometryType {
        case .faceID: return "Face ID"
        case .touchID: return "Touch ID"
        case .opticID: return "Optic ID"
        default: return nil
        }
    }

    func authenticateWithBiometrics() async -> Bool {
        let context = LAContext()
        context.localizedFallbackTitle = "Use Password"
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            lastError = "Biometric unlock is not available on this device."
            return false
        }
        do {
            let success = try await context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: "Authenticate to continue"
            )
            if success {
                data.isAuthenticated = true
                lastError = nil
                persist()
            }
            return success
        } catch {
            lastError = "Authentication was cancelled."
            return false
        }
    }

    func deleteAccount() {
        data = AuthData()
        Storage.remove(key: Self.storageKey)
    }
}
