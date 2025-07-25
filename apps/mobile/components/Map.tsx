import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapProps {
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

export default function Map({ 
  location, 
  locationPermission, 
  isLoadingLocation, 
  mapKey, 
  team, 
  demo, 
  resetMap, 
  requestLocationPermission,
  style 
}: MapProps) {
  // Stan dla mapy
  const [mapRef, setMapRef] = useState<any>(null);
  const [followUser, setFollowUser] = useState(false);

  // Funkcja do centrowania mapy na pozycji użytkownika
  const centerOnUserLocation = () => {
    if (location && mapRef) {
      mapRef.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
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
  };

  // Funkcja do przełączania śledzenia użytkownika
  const toggleFollowUser = () => {
    setFollowUser(!followUser);
    if (!followUser && location && mapRef) {
      // Jeśli włączamy śledzenie, wycentruj od razu
      mapRef.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
    Alert.alert(
      'Śledzenie', 
      followUser ? 'Wyłączono śledzenie pozycji' : 'Włączono śledzenie pozycji'
    );
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <MapView
        ref={ref => setMapRef(ref)}
        style={style ? style : { width: '100%', height: '100%' }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsPointsOfInterest={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        toolbarEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor="#22c55e"
        loadingBackgroundColor="#1f2937"
      >
        {/* Marker użytkownika */}
        {location && locationPermission && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
            title="📍 Twoja pozycja"
            description={`Dokładność: ${Math.round(location.coords.accuracy || 0)}m | Wysokość: ${Math.round(location.coords.altitude || 0)}m`}
            anchor={{ x: 0.5, y: 0.5 }}
            centerOffset={{ x: 0, y: 0 }}
          >
            <View style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: team?.color || '#007AFF',
              borderWidth: 3,
              borderColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: 'white',
              }} />
            </View>
            
            <View style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: `${team?.color || '#007AFF'}20`,
              borderWidth: 1,
              borderColor: `${team?.color || '#007AFF'}50`,
              top: -15,
              left: -15,
            }} />
          </Marker>
        )}

        {/* Marker głównej lokalizacji */}
        <Circle
          center={{ latitude: 52.497961, longitude: 21.066870 }}
          radius={5}
          strokeColor="#22c55e"
          strokeWidth={3}
          fillColor="rgba(34, 197, 94, 0.15)"
        />
        <Marker
          coordinate={{ latitude: 52.497961, longitude: 21.066870 }}
          title={demo.name}
          description={demo.location}
          pinColor="#22c55e"
        />
        
        {/* Markery stanowisk gier */}
        {demo.games?.map((game: any) => {
          if (game.coordinates) {
            return (
              <React.Fragment key={game.id}>
                <Circle
                  center={{
                    latitude: game.coordinates.latitude,
                    longitude: game.coordinates.longitude
                  }}
                  radius={5}
                  strokeColor={game.type === 'quiz' ? '#3b82f6' : '#f59e0b'}
                  strokeWidth={2}
                  fillColor={game.type === 'quiz' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)'}
                />
                
                <Marker
                  coordinate={{
                    latitude: game.coordinates.latitude,
                    longitude: game.coordinates.longitude
                  }}
                  title={game.name}
                  description={game.details?.description || `${game.type} - ${game.details?.verificationCode}`}
                  pinColor={game.type === 'quiz' ? '#3b82f6' : '#f59e0b'}
                />
              </React.Fragment>
            );
          }
          return null;
        })}
      </MapView>
      
      {/* Legenda */}
      <View className="absolute top-2 left-2 bg-black/70 rounded-lg px-3 py-2">
        <Text className="text-white text-xs font-semibold">🎯 Lokalizacja główna</Text>
        {locationPermission && location ? (
          <Text className="text-blue-400 text-xs">📍 Twoja pozycja</Text>
        ) : (
          <Text className="text-gray-400 text-xs">📍 Lokalizacja niedostępna</Text>
        )}
        <Text className="text-green-400 text-xs">🟢 Główna lokalizacja</Text>
        <Text className="text-blue-400 text-xs">🔵 Quiz</Text>
        <Text className="text-yellow-500 text-xs">🟡 Stanowiska gier</Text>
        <Text className="text-white text-xs">○ Obszar 5m wokół stanowisk</Text>
        <View className="border-t border-white/30 mt-1 pt-1">
          <Text className="text-white text-xs">🎯 Wycentruj na mnie</Text>
          <Text className="text-white text-xs">👁️ Śledź pozycję</Text>
          <Text className="text-white text-xs">🔄 Przeładuj mapę</Text>
          <Text className="text-white text-xs">📡 Odśwież GPS</Text>
          {isLoadingLocation && (
            <Text className="text-yellow-400 text-xs">📡 Szukam lokalizacji...</Text>
          )}
          {followUser && (
            <Text className="text-green-400 text-xs">👁️ Śledzenie ON</Text>
          )}
        </View>
      </View>
      
      {/* Przyciski mapy */}
      <View className="absolute bottom-2 right-2 flex-col space-y-2">
        <TouchableOpacity 
          className={`rounded-full p-2 shadow-lg ${
            locationPermission && location ? 'bg-blue-500' : 'bg-gray-500'
          }`}
          onPress={centerOnUserLocation}
        >
          <Text className="text-white text-lg">🎯</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={`rounded-full p-2 shadow-lg ${
            followUser ? 'bg-green-600' : 'bg-blue-600'
          }`}
          onPress={toggleFollowUser}
          disabled={!locationPermission || !location}
        >
          <Text className="text-white text-lg">
            {followUser ? '👁️' : '👀'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-purple-500 rounded-full p-2 shadow-lg"
          onPress={resetMap}
        >
          <Text className="text-white text-lg">🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-orange-500 rounded-full p-2 shadow-lg"
          onPress={requestLocationPermission}
          disabled={isLoadingLocation}
        >
          <Text className="text-white text-lg">
            {isLoadingLocation ? '⏳' : '📡'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
