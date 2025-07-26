import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTeam } from '../app/team-context';
// @ts-ignore
import Logo from '../assets/Logo-SurvivorQuest.png';
import { BurgerMenu } from './BurgerMenu';

interface HeaderProps {
  showTeamBar?: boolean;
  demo?: any;
  totalGames?: number;
  completedGames?: number;
  onMenuPress?: () => void;
}

// Helper function to calculate header heights
export const getHeaderHeights = (insets: { top: number }, hasTeam: boolean, showTeamBar: boolean) => {
  const HEADER_HEIGHT = 80; // Zwiększona wysokość headera z 64 na 80
  const TEAMBAR_HEIGHT = hasTeam && showTeamBar ? 48 : 0;
  // Ignorujemy insets.top w obliczeniach
  const TOTAL_HEIGHT = HEADER_HEIGHT + TEAMBAR_HEIGHT;
  
  return {
    HEADER_HEIGHT,
    TEAMBAR_HEIGHT,
    TOTAL_HEIGHT
  };
};

export function Header({ showTeamBar = false, demo, totalGames = 0, completedGames = 0, onMenuPress }: HeaderProps) {
  // Zostawiamy pobranie insets, ale oznaczamy jako nieużywane
  const _insets = useSafeAreaInsets?.() || { top: 0 };
  const { teamId } = useTeam();
  const [menuOpen, setMenuOpen] = useState(false);
  const [team, setTeam] = useState<{ id: string; name: string; color: string } | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId || !showTeamBar) {
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
  }, [teamId, showTeamBar]);

  const HEADER_HEIGHT = 80; // Zwiększona wysokość headera z 64 na 80
  const TEAMBAR_HEIGHT = team && showTeamBar ? 48 : 0;

  return (
    <View style={{ position: 'relative' }}>
      {/* Pasek z nazwą drużyny - pod headerem */}
      {team && showTeamBar && (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT - 10, // Przesunięcie w górę żeby był przykryty przez header (bez uwzględniania insets)
            left: 0,
            right: 0,
            height: TEAMBAR_HEIGHT,
            backgroundColor: team.color,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            elevation: 2, // Niższa niż header
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            zIndex: 1,
          }}
        >
          <Text style={{ 
            color: '#fff', 
            fontWeight: 'bold', 
            fontSize: 18, 
            letterSpacing: 1, 
            textTransform: 'uppercase',
            marginTop: 8 // Dodatkowy margines żeby tekst nie był przykryty
          }}>
            {team.name || 'Nazwa drużyny'}
          </Text>
        </View>
      )}

      {/* Główny header - na wierzchu - wyśrodkowany */}
      <View
        className="w-full flex-row items-center px-4 py-2 bg-primary dark:bg-primary-dark shadow-md rounded-b-2xl relative"
        style={{ 
          paddingTop: 0, // Nie używamy insets.top
          height: HEADER_HEIGHT, // Nie używamy insets.top
          zIndex: 10, // Wyższy z-index żeby był na wierzchu
          elevation: 6, // Wyższa niż team bar
          justifyContent: 'space-between', // Równomierne rozłożenie elementów
          alignItems: 'center' // Wyśrodkowanie w pionie
        }}
      >
        {/* Burger menu button - lewa strona */}
        <Pressable
          className="w-12 h-12 items-center justify-center rounded-lg bg-transparent"
          style={{ marginLeft: 8 }}
          onPress={() => onMenuPress ? onMenuPress() : setMenuOpen(true)}
        >
          <Text className="sr-only">Menu</Text>
          <View className="flex-col justify-center items-center w-full h-full">
            {/* Ikona burgera */}
            <View className="w-6 h-0.5 bg-black dark:bg-white mb-1" />
            <View className="w-6 h-0.5 bg-black dark:bg-white mb-1" />
            <View className="w-6 h-0.5 bg-black dark:bg-white" />
          </View>
        </Pressable>
        {/* Logo na środku - lepiej wyśrodkowane */}
        <View style={{ 
          position: 'absolute', 
          left: '50%', 
          top: '50%', 
          transform: [{ translateX: -35 }, { translateY: -35 }], // Dostosowane do połowy rozmiaru logo (70/2)
          zIndex: 15 
        }}>
          <Image
            source={Logo}
            style={{ width: 70, height: 70 }}
            resizeMode="contain"
            accessibilityLabel="SurvivorQuest logo"
          />
        </View>
        {/* Placeholder na user info */}
        <View className="flex-1" />
        {/* Informacja o trybie demo po prawej stronie */}
        <View className="w-32 h-12 items-end justify-center" style={{ marginRight: 8 }}>
          <Text className="px-3 py-1 rounded-xl bg-accent dark:bg-accent-dark text-white dark:text-black font-bold text-xs shadow text-center">
            {teamId ? `DEMO-${teamId}` : 'DEMO'}
          </Text>
        </View>
        {!onMenuPress && (
          <BurgerMenu 
            visible={menuOpen} 
            onClose={() => setMenuOpen(false)} 
            demo={demo}
            totalGames={totalGames}
            completedGames={completedGames}
          />
        )}
      </View>
    </View>
  );
}
