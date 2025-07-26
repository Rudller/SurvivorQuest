import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FooterProps {
  score?: number;
  timeRemaining?: string;
  completedTasks?: number;
  totalTasks?: number;
}

export function Footer({ 
  score = 0, 
  timeRemaining = "00:00", 
  completedTasks = 0, 
  totalTasks = 0 
}: FooterProps) {
  // Zostawiamy pobranie insets, ale oznaczamy jako nieużywane
  const _insets = useSafeAreaInsets();
  
  return (
    <View 
      className="w-full bg-primary dark:bg-primary-dark px-6 py-4 flex-row justify-between items-center"
      style={{ paddingBottom: 16 }} // Stały padding, bez uwzględnienia safe area
    >
      {/* Score */}
      <View className="flex-1 items-center">
        <Text className="text-xs font-semibold text-secondary dark:text-secondary-dark uppercase tracking-wider mb-1">
          SCORE
        </Text>
        <Text className="text-2xl font-bold text-background dark:text-background-dark">
          {score}
        </Text>
      </View>

      {/* Time */}
      <View className="flex-1 items-center">
        <Text className="text-xs font-semibold text-secondary dark:text-secondary-dark uppercase tracking-wider mb-1">
          TIME
        </Text>
        <Text className="text-2xl font-bold text-background dark:text-background-dark">
          {timeRemaining}
        </Text>
      </View>

      {/* Tasks */}
      <View className="flex-1 items-center">
        <Text className="text-xs font-semibold text-secondary dark:text-secondary-dark uppercase tracking-wider mb-1">
          TASKS
        </Text>
        <Text className="text-2xl font-bold text-background dark:text-background-dark">
          {completedTasks}/{totalTasks}
        </Text>
      </View>
    </View>
  );
}
