import SwiftUI

/// Async image that fills its slot without breaking the surrounding layout.
///
/// Uses the Color-as-anchor + overlay pattern so a `.fill` image can never
/// widen its parent, and lets taps fall through to whatever sits beneath.
struct RemoteImage: View {
    let urlString: String
    var height: CGFloat
    var cornerRadius: CGFloat = 16

    var body: some View {
        Color(hex: 0x233038)
            .frame(height: height)
            .overlay {
                AsyncImage(url: URL(string: urlString)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        Image(systemName: "leaf.fill")
                            .font(.system(size: height * 0.28))
                            .foregroundStyle(Theme.primary.opacity(0.35))
                    case .empty:
                        ProgressView()
                            .tint(Theme.primary)
                    @unknown default:
                        EmptyView()
                    }
                }
                .allowsHitTesting(false)
            }
            .clipShape(.rect(cornerRadius: cornerRadius))
    }
}
