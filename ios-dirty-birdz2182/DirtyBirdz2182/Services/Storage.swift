import Foundation

/// Lightweight Codable persistence backed by `UserDefaults`.
nonisolated enum Storage {
    private static let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()

    private static let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()

    static func load<T: Decodable>(_ type: T.Type, key: String) -> T? {
        guard let data = UserDefaults.standard.data(forKey: key) else { return nil }
        do {
            return try decoder.decode(type, from: data)
        } catch {
            // Corrupt or outdated payload: drop it so the app starts clean.
            UserDefaults.standard.removeObject(forKey: key)
            return nil
        }
    }

    static func save<T: Encodable>(_ value: T, key: String) {
        guard let data = try? encoder.encode(value) else { return }
        UserDefaults.standard.set(data, forKey: key)
    }

    static func remove(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }
}
