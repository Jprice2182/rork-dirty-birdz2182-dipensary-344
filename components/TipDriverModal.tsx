// Previous imports remain the same...

export default function TipDriverModal({ 
  visible, 
  onClose, 
  subtotal,
  onSelectTip,
  initialTip = 0
}: TipDriverModalProps) {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState(initialTip ? initialTip.toFixed(2) : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const tipPercentages = [10, 15, 18, 20, 25];

  const handleSelectPercentage = (percentage: number) => {
    const tipAmount = (subtotal * (percentage / 100));
    setSelectedPercentage(percentage);
    setCustomTip(tipAmount.toFixed(2));
    onSelectTip(tipAmount);
  };

  // Rest of the component remains the same...
}

// Styles remain the same...