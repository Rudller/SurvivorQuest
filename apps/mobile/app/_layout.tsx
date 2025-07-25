import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";
import { TeamProvider } from './team-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TeamProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TeamProvider>
    </SafeAreaProvider>
  );
}
