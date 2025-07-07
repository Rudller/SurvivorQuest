import { Stack } from 'expo-router';
import "../global.css";
import { TeamProvider } from './team-context';

export default function RootLayout() {
  return (
    <TeamProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TeamProvider>
  );
}
