import SwiftUI

/// Manage saved delivery addresses.
struct AddressesView: View {
    @Environment(UserStore.self) private var user
    @State private var showForm = false

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                if user.addresses.isEmpty {
                    EmptyStateView(
                        systemImage: "mappin.slash",
                        title: "No addresses saved",
                        message: "Add a delivery address so we know where to bring your order.",
                        actionTitle: "Add address",
                        action: { showForm = true }
                    )
                } else {
                    ForEach(Array(user.addresses.enumerated()), id: \.element.id) { index, address in
                        addressCard(address, index: index)
                    }

                    Button {
                        Haptics.tap()
                        showForm = true
                    } label: {
                        Label("Add another address", systemImage: "plus")
                    }
                    .buttonStyle(SecondaryButtonStyle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 32)
        }
        .background(Theme.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
        .navigationTitle("Addresses")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showForm) { AddressFormSheet() }
    }

    private func addressCard(_ address: Address, index: Int) -> some View {
        HStack(spacing: 12) {
            Button {
                Haptics.select()
                user.selectAddress(index: index)
            } label: {
                Image(systemName: index == user.selectedAddressIndex ? "largecircle.fill.circle" : "circle")
                    .font(.system(size: 20))
                    .foregroundStyle(index == user.selectedAddressIndex ? Theme.primary : Theme.border)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 3) {
                Text(address.street)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Theme.text)
                Text("\(address.city), \(address.state) \(address.zipCode)")
                    .font(.system(size: 13))
                    .foregroundStyle(Theme.subtext)
                if index == user.selectedAddressIndex {
                    Text("Default delivery address")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(Theme.primary)
                }
            }

            Spacer(minLength: 0)

            Button {
                Haptics.warning()
                withAnimation { user.removeAddress(id: address.id) }
            } label: {
                Image(systemName: "trash")
                    .font(.system(size: 14))
                    .foregroundStyle(Theme.error)
                    .frame(width: 36, height: 36)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Delete address")
        }
        .cardSurface(padding: 16)
    }
}

/// Form for creating a new delivery address.
struct AddressFormSheet: View {
    @Environment(UserStore.self) private var user
    @Environment(\.dismiss) private var dismiss

    @State private var street = ""
    @State private var city = "Atlanta"
    @State private var state = "GA"
    @State private var zipCode = ""

    private var isValid: Bool {
        !street.trimmingCharacters(in: .whitespaces).isEmpty
            && !city.trimmingCharacters(in: .whitespaces).isEmpty
            && state.count == 2
            && zipCode.filter(\.isNumber).count == 5
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    field("Street address", text: $street, placeholder: "123 Peachtree St NE")
                    field("City", text: $city, placeholder: "Atlanta")

                    HStack(spacing: 12) {
                        field("State", text: $state, placeholder: "GA")
                            .frame(maxWidth: 110)
                        field("ZIP code", text: $zipCode, placeholder: "30303", keyboard: .numberPad)
                    }

                    Text("We deliver throughout the Atlanta metro area.")
                        .font(.system(size: 12))
                        .foregroundStyle(Theme.subtext)

                    Button("Save address") {
                        user.addAddress(
                            Address(
                                street: street.trimmingCharacters(in: .whitespaces),
                                city: city.trimmingCharacters(in: .whitespaces),
                                state: state.uppercased(),
                                zipCode: zipCode
                            )
                        )
                        Haptics.success()
                        dismiss()
                    }
                    .buttonStyle(PrimaryButtonStyle(isEnabled: isValid))
                    .disabled(!isValid)
                }
                .padding(20)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle("New Address")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationContentInteraction(.scrolls)
    }

    private func field(
        _ title: String,
        text: Binding<String>,
        placeholder: String,
        keyboard: UIKeyboardType = .default
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(Theme.subtext)
            TextField(placeholder, text: text)
                .keyboardType(keyboard)
                .foregroundStyle(Theme.text)
                .padding(.horizontal, 12)
                .frame(height: 48)
                .background(Theme.card, in: .rect(cornerRadius: 12))
                .overlay {
                    RoundedRectangle(cornerRadius: 12).stroke(Theme.border, lineWidth: 1)
                }
        }
    }
}
