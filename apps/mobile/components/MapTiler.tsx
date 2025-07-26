import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapboxGL from '@rnmapbox/maps';

// Ustawienie klucza API MapTiler
// WAŻNE: W prawdziwej aplikacji przechowuj to w zmiennych środowiskowych lub bezpiecznym magazynie
const MAPTILER_API_KEY = 'BSNRPvJAJIakBIDAxdTx';

// Inicjalizacja MapboxGL - bez użycia global
try {
  MapboxGL.setAccessToken(MAPTILER_API_KEY);
} catch (e) {
  console.error("Error setting MapboxGL access token:", e);
}

// Styl mapy z MapTiler - niestandardowy styl z panelu MapTiler
const MAP_STYLE_URL = 'https://api.maptiler.com/maps/0198485d-473a-75fc-a0b0-3a2b70d03337/style.json?key=BSNRPvJAJIakBIDAxdTx';

interface MapTilerProps {
  location: Location.LocationObject | null;
  locationPermission: boolean;
  isLoadingLocation: boolean;
  mapKey: number;
  team: { id: string; name: string; color: string } | null;
  demo: any;
  resetMap: () => void;
  requestLocationPermission: () => void;
  style?: any;
}

export default function MapTiler({
  location,
  locationPermission,
  isLoadingLocation,
  mapKey,
  team,
  demo,
  resetMap,
  requestLocationPermission,
  style
}: MapTilerProps) {
  const [followUser, setFollowUser] = useState(true); // Domyślnie włączone śledzenie
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [mapReady, setMapReady] = useState(false);

  // Ustawienie domyślnej lokalizacji, jeśli nie ma rzeczywistej lokalizacji
  const defaultCoords = {
    latitude: 52.229676, // Domyślnie środek Polski
    longitude: 21.012229,
  };
  
  const currentCoords = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  } : defaultCoords;

  // Funkcja do centrowania mapy na użytkowniku z useCallback
  const centerOnUserLocation = useCallback(() => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.coords.longitude, location.coords.latitude],
        zoomLevel: 16, // Większe przybliżenie dla lepszej widoczności
        animationDuration: 1000,
      });
    } else {
      Alert.alert(
        'Brak pozycji',
        'Nie udało się ustalić Twojej pozycji. Sprawdź czy masz włączone uprawnienia do lokalizacji.',
        [
          { text: 'Anuluj', style: 'cancel' },
          { text: 'Spróbuj ponownie', onPress: requestLocationPermission }
        ]
      );
    }
  }, [location, cameraRef, requestLocationPermission]);
  
  // Centruj mapę na pozycji użytkownika gdy mapa jest gotowa i mamy pozycję
  useEffect(() => {
    if (mapReady && location && cameraRef.current) {
      // Używamy setTimeout z opóźnieniem 0ms, aby zapewnić, że wykona się to po wszystkich innych operacjach
      setTimeout(() => {
        centerOnUserLocation();
      }, 0);
    }
  }, [mapReady, location, centerOnUserLocation]);

  // Funkcja do przełączania śledzenia użytkownika
  const toggleFollowUser = useCallback(() => {
    setFollowUser((prev) => !prev);
    if (!followUser && location) {
      centerOnUserLocation();
    }
    Alert.alert(
      'Śledzenie', 
      followUser ? 'Wyłączono śledzenie pozycji' : 'Włączono śledzenie pozycji'
    );
  }, [followUser, location, centerOnUserLocation]);

  // Dodawanie punktów POI z pliku demo
  const renderPoints = () => {
    if (!demo || !demo.games) return null;
    
    return demo.games.map((game: any, index: number) => {
      if (!game.location || !game.location.latitude || !game.location.longitude) return null;
      
      // Określ kolor punktu na podstawie statusu
      const markerColor = game.status === 'completed' ? '#22c55e' : 
                          game.status === 'active' ? '#f59e0b' : '#ef4444';
      
      return (
        <MapboxGL.PointAnnotation
          key={`point-${index}`}
          id={`point-${index}`}
          coordinate={[game.location.longitude, game.location.latitude]}
          title={game.title || `Punkt #${index + 1}`}
        >
          <View style={[styles.markerContainer, { backgroundColor: markerColor }]}>
            <Text style={styles.markerText}>{index + 1}</Text>
          </View>
        </MapboxGL.PointAnnotation>
      );
    });
  };

  return (
    <View style={[styles.container, style]}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MAP_STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        compassEnabled={true}
        onDidFinishLoadingMap={() => setMapReady(true)}
        key={`mapbox-${mapKey}`} // Używamy klucza dla przeładowania mapy
      >
        <MapboxGL.Camera
          ref={cameraRef}
          followUserLocation={followUser}
          followUserMode={MapboxGL.UserTrackingModes.Follow}
          followZoomLevel={15}
          centerCoordinate={[currentCoords.longitude, currentCoords.latitude]}
          zoomLevel={15} // Zwiększone przybliżenie domyślne
        />
        
        {/* Warstwa lokalizacji użytkownika */}
        {locationPermission && (
          <MapboxGL.UserLocation 
            visible={true}
            showsUserHeadingIndicator={true}
          />
        )}

        {/* Wyświetlanie punktów POI z pliku demo */}
        {renderPoints()}
        
        {/* Tutaj możesz dodać więcej warstw MapTiler */}
      </MapboxGL.MapView>

      {/* Przyciski kontrolne mapy */}
      <View style={styles.controlsContainer}>
        {/* Przycisk do centrowania mapy na użytkowniku */}
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={centerOnUserLocation}
        >
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>

        {/* Przycisk do przełączania śledzenia użytkownika */}
        <TouchableOpacity 
          style={[styles.controlButton, followUser && styles.activeButton]} 
          onPress={toggleFollowUser}
        >
          <Text style={styles.controlButtonText}>👁️</Text>
        </TouchableOpacity>

        {/* Przycisk do resetowania mapy */}
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={resetMap}
        >
          <Text style={styles.controlButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Wskaźnik ładowania lokalizacji */}
      {isLoadingLocation && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Pobieranie lokalizacji...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -75 }],
    backgroundColor: 'transparent',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: '#22c55e',
  },
  controlButtonText: {
    fontSize: 18,
  },
  loadingContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  loadingText: {
    color: 'white',
    fontSize: 12,
  },
});
