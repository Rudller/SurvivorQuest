import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

interface CountdownScreenProps {
  startTime: string;  // ISO string for realization start time
  visible: boolean;
  onComplete?: () => void;
}

export function CountdownScreen({ startTime, visible, onComplete }: CountdownScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [isFinalCountdown, setIsFinalCountdown] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const targetDate = new Date(startTime);
      const difference = targetDate.getTime() - now.getTime();
      
      // If we've reached the start time
      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete && onComplete();
        return;
      }

      // Check if we're in the final 10 second countdown
      if (difference <= 10000) {
        setIsFinalCountdown(true);
      }

      // Calculate remaining time
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate immediately and then set interval
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [visible, startTime, onComplete]);

  if (!visible) return null;

  const formattedTime = () => {
    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      // For final countdown, just show seconds
      return `${seconds}`;
    }
  };

  const getDateString = () => {
    const date = new Date(startTime);
    return date.toLocaleString('pl-PL', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <BlurView intensity={30} style={styles.blurContainer}>
        {isFinalCountdown ? (
          // Final countdown screen
          <View style={styles.finalCountdownContainer}>
            <Text style={styles.finalCountdownText}>{timeRemaining.seconds}</Text>
            <Text style={styles.finalCountdownLabel}>Realizacja zaraz się rozpocznie...</Text>
          </View>
        ) : (
          // Regular countdown screen
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Realizacja SurvivorQuest</Text>
            <Text style={styles.subtitle}>Rozpocznie się:</Text>
            <Text style={styles.date}>{getDateString()}</Text>
            
            <View style={styles.countdownContainer}>
              <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
              <Text style={styles.countdownTime}>{formattedTime()}</Text>
              <Text style={styles.countdownLabel}>Pozostało do startu</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Przygotuj się do rozpoczęcia realizacji!</Text>
              <Text style={styles.infoText}>Sprawdź potrzebny sprzęt i skompletuj zespół.</Text>
            </View>
          </View>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 4,
    textAlign: 'center',
  },
  date: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 40,
    textAlign: 'center',
  },
  countdownContainer: {
    width: '80%',
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loader: {
    marginBottom: 16,
  },
  countdownTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
  },
  infoContainer: {
    width: '90%',
    padding: 16,
    backgroundColor: 'rgba(31, 41, 55, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 8,
  },
  finalCountdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalCountdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  finalCountdownLabel: {
    fontSize: 20,
    color: '#4b5563',
    marginTop: 20,
  }
});
