// Previous imports remain the same...

export default function PrivacyScreen() {
  const router = useRouter();

  const bulletPoints = {
    collect: [
      "Name and contact information",
      "Date of birth and age verification data",
      "Delivery address",
      "Payment information",
      "Order history"
    ],
    use: [
      "Process your orders",
      "Verify your age and identity",
      "Provide customer support",
      "Send order updates and notifications",
      "Improve our services"
    ],
    rights: [
      "Access your personal data",
      "Correct inaccurate data",
      "Request deletion of your data",
      "Opt out of marketing communications"
    ],
    share: [
      "Delivery partners (only delivery details)",
      "Payment processors",
      "Legal authorities when required by law"
    ]
  };

  // Rest of the component remains the same...