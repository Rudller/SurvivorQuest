import { useState } from 'react';
import { Header } from '../components/Header';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router/build/hooks';

export default function HomeScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (code.trim().toUpperCase() === 'DEMO') {
        router.push('/demo');
      } else if (code.trim().length < 4) {
        setError('Podaj poprawny kod realizacji.');
      } else {
        setError('Połączono! (tu przejście dalej)');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-sans text-primary dark:text-primary-dark mb-8 text-center">Podaj kod realizacji, aby rozpocząć</Text>
        <TextInput
          className="w-full max-w-xs px-4 py-3 rounded-xl border-2 border-primary dark:border-primary-dark bg-white dark:bg-black text-lg text-center font-sans text-primary dark:text-primary-dark mb-4"
          placeholder="Kod realizacji"
          placeholderTextColor="#aaa"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          maxLength={12}
        />
        <TouchableOpacity
          className="w-full max-w-xs bg-accent dark:bg-accent-dark py-3 rounded-xl items-center mb-2"
          onPress={handleConnect}
          disabled={loading}
        >
          <Text className="text-lg font-bold text-white dark:text-black">{loading ? 'Łączenie...' : 'Połącz'}</Text>
        </TouchableOpacity>
        {/* Przycisk Skanuj QR (do rozbudowy) */}
        <TouchableOpacity
          className="w-full max-w-xs py-2 items-center"
          onPress={() => setError('Skanowanie QR niezaimplementowane')}
        >
          <Text className="text-base text-primary dark:text-primary-dark underline">Skanuj QR</Text>
        </TouchableOpacity>
        {!!error && (
          <Text className="mt-6 text-red-500 text-center font-sans">{error}</Text>
        )}
      </View>
    </View>
  );
}