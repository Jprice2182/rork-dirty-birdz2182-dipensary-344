// Previous imports remain the same...

export function AgeVerificationModal({ isVisible, onClose, onVerified }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (birthDate) {
      setMonth(String(birthDate.getMonth() + 1).padStart(2, '0'));
      setDay(String(birthDate.getDate()).padStart(2, '0'));
      setYear(String(birthDate.getFullYear()));
    }
  }, [birthDate]);

  // Rest of the component remains the same...