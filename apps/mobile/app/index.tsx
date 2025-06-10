import { ThemeSwitch } from '../components/ThemeSwitch';
import { Header } from '../components/Header';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header />
      <View className="flex-1 items-center justify-center">
        <View className="absolute top-10 right-6">
          <ThemeSwitch />
        </View>
        <Text className="text-2xl font-sans text-primary dark:text-primary-dark">Hello World</Text>
        <Text className="mt-4 text-accent dark:text-accent-dark">Przykładowy akcent</Text>
        <Text className="mt-2 text-secondary dark:text-secondary-dark">Drugi akcent</Text>
        <Text className="mt-2 text-highlight dark:text-highlight-dark">Dodatkowy akcent</Text>
      </View>
    </View>
  );
}