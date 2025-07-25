import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Alert, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header, getHeaderHeights } from '../components/Header';
import { Footer } from '../components/Footer';
import Map from '../components/Map';
import { BurgerMenu } from '../components/BurgerMenu';
import { CountdownScreen } from '../components/CountdownScreen';
import { useTeam } from './team-context';
import demoRealization from '../assets/demo-realization.json';

export default function DemoScreen() {
  const demo = demoRealization;
  const { teamId } = useTeam();
  const [team, setTeam] = useState<{ id: string; name: string; color: string } | null>(null);
  const [mapKey, setMapKey] = useState(0); // Klucz do przeładowania mapy
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [realizationActive, setRealizationActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("42:17");
  const insets = useSafeAreaInsets();

  // Wysokość headera (dostosuj jeśli inna!)
  const headerHeights = getHeaderHeights(insets, !!team, true);
  // Stała wysokość footera bez uwzględniania insets
  const FOOTER_HEIGHT = 80;

  // Oblicz statystyki z demo realizacji
  const totalGames = demo.games?.length || 0;
  const completedGames = demo.games?.filter((game: any) => game.status === 'completed').length || 0;
  const score = completedGames * 100; // Przykładowy system punktacji

  // Funkcja do otwarcia kamery
  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        // Otwórz ekran kamery
        router.push('/camera');
      } else {
        Alert.alert('Brak uprawnień', 'Potrzebujemy dostępu do kamery aby móc robić zdjęcia.');
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Błąd', 'Nie udało się otworzyć kamery.');
    }
  };

  // Funkcja do resetowania/przeładowania mapy
  const resetMap = () => {
    setMapKey(prev => prev + 1); // Zmiana klucza spowoduje przeładowanie mapy
    Alert.alert('Mapa', 'Mapa została przeładowana');
  };

  // Funkcja do żądania uprawnień i pobierania lokalizacji
  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Sprawdź obecne uprawnienia
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Poproś o uprawnienia
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status === 'granted') {
        setLocationPermission(true);
        // Pobierz obecną lokalizację
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
        console.log('Current location:', currentLocation);
      } else {
        setLocationPermission(false);
        Alert.alert(
          'Brak uprawnień do lokalizacji',
          'Aby wyświetlić Twoją pozycję na mapie, potrzebujemy dostępu do lokalizacji urządzenia.'
        );
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('Błąd lokalizacji', 'Nie udało się pobrać lokalizacji urządzenia.');
    } finally {
      setIsLoadingLocation(false);
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

  // Function to toggle burger menu
  const toggleBurgerMenu = () => {
    setShowBurgerMenu(prev => !prev);
  };

  // Function to start countdown
  const handleStartCountdown = () => {
    setShowCountdown(true);
  };

  // Function to start realization
  const handleStartRealization = () => {
    setShowCountdown(false);
    setRealizationActive(true);
    Alert.alert('Realizacja rozpoczęta', 'Realizacja SurvivorQuest została rozpoczęta!');
  };

  // Function to handle countdown completion
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setRealizationActive(true);
  };

  // Effect to handle realization time tracking
  useEffect(() => {
    if (!realizationActive) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(demo.realizationEndTime);
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeRemaining("00:00");
        Alert.alert("Koniec realizacji!", "Czas realizacji dobiegł końca.");
        return;
      }
      
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [realizationActive, demo.realizationEndTime]);

  // useEffect do żądania uprawnień do lokalizacji przy starcie
  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: undefined }} className="bg-background dark:bg-background-dark">
      {/* Mapa na cały ekran od góry do dołu */}
      <Map
        location={location}
        locationPermission={locationPermission}
        isLoadingLocation={isLoadingLocation}
        mapKey={mapKey}
        team={team}
        demo={demo}
        resetMap={resetMap}
        requestLocationPermission={requestLocationPermission}
        style={{
          position: 'absolute',
          top: 0, // pełna wysokość urządzenia
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10, // Dodajemy niższy zIndex, aby mapa była pod headerem i footerem
        }}
      />
      
      {/* Countdown Screen */}
      <CountdownScreen 
        startTime={demo.realizationStartTime} 
        visible={showCountdown}
        onComplete={handleCountdownComplete}
      />

      {/* Header z oliwkowym tłem i marginesami - przesunięty niżej */}
      <View style={{ 
        zIndex: 20, 
        position: 'absolute',
        margin: 10, // Margines 10px dookoła headera
        marginTop: 40, // Zwiększony margines górny - header niżej
        left: 0,
        right: 0,
        backgroundColor: '#697a47', // Oliwkowy/zielonkawy kolor tła jak na screenie
        borderRadius: 15, // Zaokrąglenie rogów dla lepszego wyglądu
        overflow: 'hidden', // Zapewnia że zaokrąglenie będzie widoczne
        elevation: 5, // Cień na Androidzie
        shadowColor: '#000', // Cień na iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
      }}>
        <Header 
          showTeamBar={true} // Włączamy showTeamBar, aby pokazać informację o drużynie w headerze
          demo={demo}
          totalGames={totalGames}
          completedGames={completedGames}
          onMenuPress={toggleBurgerMenu}
        />
      </View>
      
      {/* Panel bardziej wysunięty pod header ale z widocznym tekstem */}
      <View style={{
        position: 'absolute',
        top: headerHeights.TOTAL_HEIGHT - 50, // Przesuwamy panel jeszcze wyżej, aby zachodził 30px pod header
        left: 10, // Taki sam margines jak header
        right: 10, // Taki sam margines jak header
        height: 70, // Zwiększona wysokość panelu
        backgroundColor: team?.color || '#ff0000', // Używamy koloru drużyny lub czerwonego jako domyślny
        borderRadius: 10,
        zIndex: 15, // Między mapą a headerem (niższy niż header, który ma zIndex: 20)
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15, // Padding po bokach
        paddingTop: 35 // Jeszcze większy padding na górze, aby tekst był odpowiednio niżej
      }}>
        <Text style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2
        }}>
          {team ? team.name : 'Panel informacyjny'}
        </Text>
      </View>

      {/* Przycisk kamery nad footerem */}
      <View style={{ 
        position: 'absolute', 
        bottom: 140, // Dostosowana pozycja względem przesuniętego footera
        left: '80%', 
        transform: [{ translateX: -40 }], 
        zIndex: 40 // większy zIndex niż header i footer
      }}>
        <TouchableOpacity
          onPress={openCamera}
          style={{
            width: 80,
            height: 80,
            borderRadius: 100,
            backgroundColor: '#1f2937',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Ionicons 
            name="camera" 
            size={32} 
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Footer dockowany na dole, unoszący się nad mapą - przesunięty wyżej */}
      <View style={{ 
        position: 'absolute', 
        left: 10, 
        right: 10, 
        bottom: 40, // Zwiększony margines od dołu - footer wyżej
        zIndex: 30,
        borderRadius: 15, // Zaokrąglenie rogów
        overflow: 'hidden', // Zapewnia że zaokrąglenie będzie widoczne
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Półprzezroczyste tło
        backdropFilter: 'blur(10px)', // Efekt rozmycia tła
        elevation: 5, // Cień na Androidzie
        shadowColor: '#000', // Cień na iOS
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
      }}>
        <Footer 
          score={score}
          timeRemaining={timeRemaining}
          completedTasks={completedGames}
          totalTasks={totalGames}
        />
      </View>
      
      {/* Burger Menu */}
      <BurgerMenu 
        visible={showBurgerMenu} 
        onClose={() => setShowBurgerMenu(false)}
        demo={demo}
        totalGames={totalGames}
        completedGames={completedGames}
        onStartCountdown={handleStartCountdown}
        onStartRealization={handleStartRealization}
      />
    </View>
  );
}