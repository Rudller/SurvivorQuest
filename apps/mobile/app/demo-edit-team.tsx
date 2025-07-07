
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router/build/hooks';
import { View, Text, TextInput, TouchableOpacity, Animated, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components/Header';
import demoRealization from '../assets/demo-realization.json';
import { useTeam } from './team-context';



type Team = { id: string; name: string; color: string };

export default function DemoEditTeamScreen() {
  const router = useRouter();
  const { teamId } = useTeam();
  const team = (demoRealization.teams.find((t: any) => t.id === teamId) as Team) || { id: '', name: '', color: '#000000' };
  const [name, setName] = useState(team.name || '');
  const [color, setColor] = useState(team.color || '#000000');
  const [error, setError] = useState('');

  // Zapamiętaj wybraną drużynę w localStorage/AsyncStorage
  useEffect(() => {
    // Przy pierwszym wejściu ustaw wybraną drużynę jeśli istnieje w localStorage/AsyncStorage
    (async () => {
      try {
        let saved;
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window?.localStorage?.getItem) {
          saved = window.localStorage.getItem('demo-team');
        } else {
          saved = await AsyncStorage.getItem('demo-team');
        }
        
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id === teamId) {
            setName(parsed.name);
            setColor(parsed.color);
          }
        }
      } catch {}
    })();
  }, [teamId]);

  const otherTeams = demoRealization.teams.filter((t: any) => t.id !== teamId);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Nazwa drużyny nie może być pusta.');
      return;
    }
    if (otherTeams.some((t: any) => t.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      setError('Inna drużyna ma już taką nazwę.');
      return;
    }
    setError('');
    // Zapamiętaj wybraną drużynę (localStorage na web, AsyncStorage na native)
    try {
      const teamData = JSON.stringify({ id: teamId, name, color });
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window?.localStorage?.setItem) {
        window.localStorage.setItem('demo-team', teamData);
      } else {
        await AsyncStorage.setItem('demo-team', teamData);
      }
    } catch (error) {
      console.log('Error saving team:', error);
    }
    router.push('/demo');
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header />
      {/* Pasek z nazwą drużyny i kolorem na całą szerokość został przeniesiony do demo.tsx */}
      <View className="flex-1 px-6 py-8 items-center">
        <Text className="text-2xl font-bold text-primary dark:text-primary-dark mb-2 text-center">Edytuj drużynę</Text>
        {/* Podgląd kafelka drużyny (na górze) */}
        <Text className="text-base text-secondary dark:text-secondary-dark text-center mb-2">Oto jak twoja drużyna będzie się prezentować:</Text>
        <View className="w-full items-center mb-6">
          {/* Animated color transition for the team card */}
          <AnimatedTeamCard color={color} name={name} />
        </View>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Nazwa drużyny:</Text>
        <TextInput
          className="w-full max-w-xs px-4 py-3 rounded-xl border-2 border-primary dark:border-primary-dark bg-white dark:bg-black text-lg text-center mb-4"
          value={name}
          onChangeText={setName}
        />
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Kolor drużyny:</Text>
        <View className="w-full max-w-xs mb-4 items-center">
          {/* Kółko z kolorem drużyny */}
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: color, borderWidth: 2, borderColor: '#888', marginBottom: 8 }} />
          {/* Wybór koloru z palety */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
            {['#FF5733','#FF9800','#FFD600','#4CAF50','#2196F3','#3F51B5','#9C27B0','#E91E63','#795548','#607D8B','#00BCD4','#8BC34A'].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: c,
                  margin: 4,
                  borderWidth: c === color ? 3 : 1,
                  borderColor: c === color ? '#222' : '#ccc',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                accessibilityLabel={`Wybierz kolor ${c}`}
              >
                {c === color && (
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff', opacity: 0.8 }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {!!error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}
        <TouchableOpacity
          className="w-full max-w-xs bg-accent dark:bg-accent-dark py-3 rounded-xl items-center mb-2"
          onPress={handleSave}
        >
          <Text className="text-lg font-bold text-white dark:text-black">Zapisz i przejdź dalej</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// AnimatedTeamCard: minimalistyczny kafelek z płynną animacją koloru
type AnimatedTeamCardProps = { color: string; name: string };
const AnimatedTeamCard: React.FC<AnimatedTeamCardProps> = ({ color, name }) => {
  const prevColor = useRef(color);
  const bgColor = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (prevColor.current !== color) {
      bgColor.setValue(0);
      Animated.timing(bgColor, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      }).start(() => {
        prevColor.current = color;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const interpolated = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor.current, color],
  });

  return (
    <Animated.View
      style={{
        backgroundColor: interpolated,
        borderRadius: 18,
        minWidth: 160,
        minHeight: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0,
        marginBottom: 0,
        shadowColor: color,
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Text style={{
        color: '#fff',
        fontWeight: '600',
        fontSize: 22,
        letterSpacing: 0.5,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.10)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        textTransform: 'uppercase',
        paddingHorizontal: 8,
      }}>
        {name || 'Nazwa drużyny'}
      </Text>
    </Animated.View>
  );
};
