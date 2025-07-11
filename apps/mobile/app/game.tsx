import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTeam } from './team-context';
import demoRealization from '../assets/demo-realization.json';

// Funkcja pomocnicza do obsługi lokalnych i zdalnych obrazów
const getImageSource = (photoUrl: string) => {
  console.log('Loading image:', photoUrl);
  
  if (photoUrl.startsWith('http')) {
    return { uri: photoUrl };
  }
  
  // Obsługa lokalnych obrazów po nazwie
  switch (photoUrl) {
    case 'demo-bikers':
      console.log('Loading local demo-bikers.png');
      return require('../assets/images/demo/demo-bikers.png');
    default:
      // Fallback dla nieznanych obrazów
      console.log('Using fallback for:', photoUrl);
      return { uri: photoUrl };
  }
};

export default function GameScreen() {
  const { gameId } = useLocalSearchParams();
  const { teamId } = useTeam();
  const [team, setTeam] = useState<{ id: string; name: string; color: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  // Znajdź grę na podstawie gameId
  const game = demoRealization.games?.find((g: any) => g.id.toString() === gameId);

  // Wysokość headera i footera
  const HEADER_HEIGHT = 64;
  const FOOTER_HEIGHT = 80 + insets.bottom;
  const TEAMBAR_HEIGHT = team ? 48 : 0;

  // Obsługa zatwierdzenia kodu
  const handleSubmitCode = async () => {
    if (!game || !verificationCode.trim()) {
      Alert.alert('Błąd', 'Proszę wprowadzić kod weryfikacyjny.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Sprawdź czy kod jest poprawny
      if (verificationCode.trim().toUpperCase() === game.details?.verificationCode?.toUpperCase()) {
        Alert.alert(
          'Sukces!', 
          'Kod weryfikacyjny jest poprawny. Gra została zaliczona!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Możesz tutaj dodać logikę zapisu postępu
                router.back();
              }
            }
          ]
        );
      } else {
        Alert.alert('Błędny kod', 'Wprowadzony kod weryfikacyjny jest niepoprawny. Spróbuj ponownie.');
      }
    } catch (error) {
      console.log('Error submitting code:', error);
      Alert.alert('Błąd', 'Wystąpił błąd podczas sprawdzania kodu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId) {
        setTeam(null);
        return;
      }
      
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window?.localStorage?.getItem) {
          const saved = window.localStorage.getItem('demo-team');
          if (saved) {
            setTeam(JSON.parse(saved));
          }
        } else {
          const saved = await AsyncStorage.getItem('demo-team');
          if (saved) {
            setTeam(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.log('Error loading team:', error);
      }
    };
    fetchTeam();
  }, [teamId]);

  if (!game) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <Header />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-bold text-red-500 mb-4">Gra nie została znaleziona</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Powrót</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: undefined, position: 'relative' }} className="bg-background dark:bg-background-dark">
      <Header />
      
      {/* Pasek z nazwą drużyny */}
      {team && (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT - 10,
            left: 0,
            right: 0,
            height: TEAMBAR_HEIGHT,
            backgroundColor: team.color,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: -1,
            paddingTop: 10,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 1, textTransform: 'uppercase' }}>{team.name || 'Nazwa drużyny'}</Text>
        </View>
      )}

      <ScrollView
        className="flex-1 px-6 py-4"
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + TEAMBAR_HEIGHT - 70,
          paddingBottom: FOOTER_HEIGHT,
        }}
      >
        {/* Tytuł gry */}
        <View className="mb-6 p-4 rounded-2xl bg-white/90 dark:bg-black/60 border-2 border-primary/30 dark:border-primary-dark/30">
          <Text className="text-3xl font-bold text-primary dark:text-primary-dark text-center mb-2">
            {game.name}
          </Text>
          <Text className="text-lg text-center text-secondary dark:text-secondary-dark capitalize">
            {game.type === 'quiz' ? '🧠 Quiz' : '🎯 Stanowisko gry'}
          </Text>
        </View>

        {/* Zdjęcie gry */}
        {game.details?.photoUrls && game.details.photoUrls.length > 0 && (
          <View className="mb-6 rounded-2xl overflow-hidden border-2 border-accent/30 dark:border-accent-dark/30">
            <Image
              source={getImageSource(game.details.photoUrls[0])}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
              onError={(error) => console.log('Image failed to load:', error)}
            />
          </View>
        )}

        {/* Instrukcje/Opis */}
        <View className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-black/40 border border-accent/20 dark:border-accent-dark/20">
          <Text className="text-xl font-semibold text-accent dark:text-accent-dark mb-3">📋 Opis</Text>
          {game.details?.description ? (
            <Text className="text-base text-secondary dark:text-secondary-dark leading-6">
              {game.details.description}
            </Text>
          ) : (
            <Text className="text-base text-secondary dark:text-secondary-dark italic">
              Brak opisu dla tej gry.
            </Text>
          )}
        </View>

        {/* Cel zadania */}
        {game.details?.objective && (
          <View className="mb-6 p-4 rounded-2xl bg-orange-50/80 dark:bg-orange-900/20 border border-orange-300/30 dark:border-orange-600/30">
            <Text className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">🎯 Cel zadania</Text>
            <Text className="text-base text-secondary dark:text-secondary-dark leading-6">
              {game.details.objective}
            </Text>
          </View>
        )}

        {/* Pytania quizowe (jeśli to quiz) */}
        {game.type === 'quiz' && game.details?.questionsDetails && (
          <View className="mb-6 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-300/30 dark:border-blue-600/30">
            <Text className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">🧠 Pytania quizowe</Text>
            {game.details.questionsDetails.map((question: any, index: number) => (
              <View key={question.questionId} className="mb-4 p-3 rounded-xl bg-white/60 dark:bg-black/30">
                <Text className="font-semibold text-primary dark:text-primary-dark mb-2">
                  {index + 1}. {question.questionText}
                </Text>
                {question.answers && (
                  <View className="ml-4">
                    {question.answers.map((answer: any) => (
                      <Text key={answer.id} className="text-sm text-secondary dark:text-secondary-dark mb-1">
                        • {answer.text}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Sekcja kodu weryfikacyjnego */}
        <View className="mb-6 p-4 rounded-2xl bg-green-50/80 dark:bg-green-900/20 border-2 border-green-300/50 dark:border-green-600/50">
          <Text className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3 text-center">
            🔐 Kod weryfikacyjny
          </Text>
          <Text className="text-base text-secondary dark:text-secondary-dark mb-4 text-center">
            Wprowadź kod otrzymany od organizatora po ukończeniu zadania:
          </Text>
          
          <TextInput
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Wpisz kod weryfikacyjny"
            placeholderTextColor="#9CA3AF"
            className="w-full p-4 text-lg font-mono text-center border-2 border-green-300 dark:border-green-600 rounded-xl bg-white dark:bg-gray-800 text-primary dark:text-primary-dark mb-4"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={20}
          />

          <TouchableOpacity
            onPress={handleSubmitCode}
            disabled={isSubmitting || !verificationCode.trim()}
            className={`w-full py-4 rounded-xl ${
              isSubmitting || !verificationCode.trim()
                ? 'bg-gray-400 dark:bg-gray-600'
                : 'bg-green-500 dark:bg-green-600'
            }`}
          >
            <Text className="text-white font-bold text-lg text-center">
              {isSubmitting ? 'Sprawdzam...' : '✅ Zatwierdź kod'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Informacje dodatkowe */}
        <View className="mb-4 p-4 rounded-2xl bg-white/60 dark:bg-black/30 border border-primary/20 dark:border-primary-dark/20">
          <Text className="text-lg font-semibold text-accent dark:text-accent-dark mb-2">ℹ️ Informacje</Text>
          <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">
            <Text className="font-semibold">Typ: </Text>{game.type === 'quiz' ? 'Quiz' : 'Stanowisko gry'}
          </Text>
          <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">
            <Text className="font-semibold">Rozpoczęcie: </Text>{new Date(game.startTime).toLocaleString('pl-PL')}
          </Text>
          {game.endTime && (
            <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">
              <Text className="font-semibold">Zakończenie: </Text>{new Date(game.endTime).toLocaleString('pl-PL')}
            </Text>
          )}
          {game.score !== null && (
            <Text className="text-sm text-secondary dark:text-secondary-dark">
              <Text className="font-semibold">Punkty: </Text>{game.score}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer 
        score={0}
        timeRemaining="42:17"
        completedTasks={0}
        totalTasks={demoRealization.games?.length || 0}
      />
    </View>
  );
}
