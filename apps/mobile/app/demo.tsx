
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTeam } from './team-context';
import demoRealization from '../assets/demo-realization.json';
import MapView, { Marker } from 'react-native-maps';

export default function DemoScreen() {
  const demo = demoRealization;
  const { teamId } = useTeam();
  const [team, setTeam] = useState<{ id: string; name: string; color: string } | null>(null);
  const insets = useSafeAreaInsets();

  // Pobierz wymiary ekranu
  const { height: screenHeight } = Dimensions.get('window');
  const MAP_HEIGHT = screenHeight * 0.5; // 50% wysokości ekranu

  // Wysokość headera (dostosuj jeśli inna!)
  const HEADER_HEIGHT = 64;
  const FOOTER_HEIGHT = 80 + insets.bottom; // Dodaj wysokość dolnego safe area
  const TEAMBAR_HEIGHT = team ? 48 : 0;

  // Oblicz statystyki z demo realizacji
  const totalGames = demo.games?.length || 0;
  const completedGames = demo.games?.filter((game: any) => game.status === 'completed').length || 0;
  const score = completedGames * 100; // Przykładowy system punktacji
  const timeRemaining = "42:17"; // Przykładowy czas - można później zrobić countdown

  // Funkcja do otwarcia kamery
  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        // Tutaj można otworzyć ekran kamery lub modal z kamerą
        Alert.alert('Kamera', 'Funkcjonalność kamery będzie wkrótce dostępna!');
      } else {
        Alert.alert('Brak uprawnień', 'Potrzebujemy dostępu do kamery aby móc robić zdjęcia.');
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Błąd', 'Nie udało się otworzyć kamery.');
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId) {
        console.log('No teamId in context');
        setTeam(null);
        return;
      }
      
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window?.localStorage?.getItem) {
          const saved = window.localStorage.getItem('demo-team');
          console.log('Web - saved team:', saved);
          if (saved) {
            setTeam(JSON.parse(saved));
          }
        } else {
          const saved = await AsyncStorage.getItem('demo-team');
          console.log('Mobile - saved team:', saved);
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

  return (
    <View style={{ flex: 1, backgroundColor: undefined, position: 'relative' }} className="bg-background dark:bg-background-dark">
      <Header />
      {/* Pasek z nazwą drużyny i kolorem na całą szerokość, pozycjonowany absolutnie pod headerem */}
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
          paddingBottom: FOOTER_HEIGHT, // padding na wysokość footera
        }}
      >
        {/* Mapa z markerem lokalizacji realizacji */}
        <View className="w-full mb-6 rounded-2xl overflow-hidden border border-primary/30 dark:border-primary-dark/30" style={{ height: MAP_HEIGHT }}>
          <MapView
            key={`52.497961-21.066870-0.001-0.001`}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 52.497961,
              longitude: 21.066870,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            mapType="satellite"
          >
            <Marker
              coordinate={{ latitude: 52.2297, longitude: 21.0122 }}
              title={demo.name}
              description={demo.location}
            />
          </MapView>
        </View>
        {/* ...existing code... */}
        <Text className="text-2xl font-bold text-primary dark:text-primary-dark mb-2">{demo.name}</Text>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Data: {demo.date}</Text>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Status: {demo.status}</Text>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Lokalizacja: {demo.location}</Text>
        {/* <Text className="mb-4 text-base text-secondary dark:text-secondary-dark">Organizator: {demo.organizer?.name} ({demo.organizer?.email})</Text> */}
        <Text className="text-lg font-semibold text-accent dark:text-accent-dark mb-2">Gry / Stanowiska:</Text>
        {demo.games?.map((game: any) => (
          <View key={game.id} className="mb-4 p-3 rounded-xl bg-white/80 dark:bg-black/40 border border-primary/20 dark:border-primary-dark/20">
            <Text className="font-bold text-primary dark:text-primary-dark mb-1">{game.name}</Text>
            <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Typ: {game.type || game.details?.type}</Text>
            <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Status: {game.status || '-'}</Text>
            {game.details?.description && (
              <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Opis: {game.details.description}</Text>
            )}
            {game.details?.verificationCode && (
              <Text className="text-sm text-highlight dark:text-highlight-dark mb-1">Kod zaliczenia: {game.details.verificationCode}</Text>
            )}
            {game.details?.questionsDetails && (
              <View className="mt-2">
                <Text className="font-semibold text-accent dark:text-accent-dark">Pytania quizowe:</Text>
                {game.details.questionsDetails.map((q: any) => (
                  <View key={q.questionId} className="mb-1">
                    <Text className="text-sm text-primary dark:text-primary-dark">{q.questionText}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        {/* <Text className="mt-6 text-base text-secondary dark:text-secondary-dark">Uczestnicy:</Text>
        {demo.participants?.map((p: any) => (
          <Text key={p.id} className="text-sm text-primary dark:text-primary-dark">{p.name} ({p.role})</Text>
        ))} */}
        <Text className="mt-6 text-base text-secondary dark:text-secondary-dark">Notatki:</Text>
        <Text className="text-sm text-primary dark:text-primary-dark mb-4">{demo.notes}</Text>
      </ScrollView>
      
      {/* Przycisk kamery nad footerem */}
      <View style={{ 
        position: 'absolute', 
        bottom: 100, // Umieszczamy nad footerem
        left: '50%', 
        transform: [{ translateX: -30 }], 
        zIndex: 100
      }}>
        <TouchableOpacity
          onPress={openCamera}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#007AFF',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>📷</Text>
        </TouchableOpacity>
      </View>
      
      {/* Footer z wynikami */}
      <Footer 
        score={score}
        timeRemaining={timeRemaining}
        completedTasks={completedGames}
        totalTasks={totalGames}
      />
    </View>
  );
}
