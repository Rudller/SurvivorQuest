import { View, Text, Switch } from 'react-native';
import { useColorScheme } from 'nativewind';

export function ThemeSwitch() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row items-center">
      <Text className="mr-2 text-lg font-sans text-primary dark:text-primary-dark">{isDark ? '🌙' : '☀️'}</Text>
      <Switch
        value={isDark}
        onValueChange={() => setColorScheme(isDark ? 'light' : 'dark')}
        thumbColor={isDark ? '#606C38' : '#DDA15E'}
        trackColor={{ false: '#ddd', true: '#415A77' }}
      />
    </View>
  );
}
