import SwiftUI

/// Central color + spacing tokens mirroring the app's emerald-on-charcoal identity.
nonisolated enum Theme {
    static let background = Color(hex: 0x151718)
    static let backgroundElevated = Color(hex: 0x1A1D1E)
    static let card = Color(hex: 0x1F2937)
    static let border = Color(hex: 0x374151)
    static let text = Color(hex: 0xECEDEE)
    static let subtext = Color(hex: 0x9CA3AF)
    static let primary = Color(hex: 0x10B981)
    static let secondary = Color(hex: 0x6EE7B7)
    static let error = Color(hex: 0xEF4444)
    static let warning = Color(hex: 0xF59E0B)
    static let success = Color(hex: 0x10B981)
    static let bulkCard = Color(hex: 0x11241D)

    /// Ambient emerald wash used behind scroll content for depth.
    static var canopy: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0x0E2A22), Theme.background, Theme.background],
            startPoint: .top,
            endPoint: .bottom
        )
    }

    static var emeraldSweep: LinearGradient {
        LinearGradient(
            colors: [Theme.primary, Theme.secondary],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

nonisolated extension Color {
    init(hex: UInt32) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: 1
        )
    }
}

nonisolated extension Double {
    /// Formats a monetary amount as `$12.34`.
    var currency: String {
        String(format: "$%.2f", self)
    }
}
