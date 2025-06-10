// Previous imports remain the same...

export default function Index() {
  const router = useRouter();
  const isVerified = useUserStore(state => state.isVerified);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [showAgeVerification, setShowAgeVerification] = useState(false);

  useEffect(() => {
    // Move state update to useEffect to avoid render cycle issues
    if (!isVerified) {
      setShowAgeVerification(true);
    }
  }, [isVerified]);

  const handleVerification = useCallback(() => {
    setShowAgeVerification(false);
    useUserStore.getState().setVerified(true);
  }, []);

  useEffect(() => {
    if (isVerified && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isVerified, isAuthenticated, router]);

  // Rest of the component remains the same...