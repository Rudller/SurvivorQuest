import { View, Text, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import Logo from '../assets/Logo-SurvivorQuest.png';
import { BurgerMenu } from './BurgerMenu';

export function Header() {
  const insets = useSafeAreaInsets?.() || { top: 0 };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <View
      className="w-full flex-row items-center justify-between px-4 py-2 bg-primary dark:bg-primary-dark shadow-md rounded-b-2xl relative"
      style={{ paddingTop: insets.top }}
    >
      {/* Burger menu button */}
      <Pressable
        className="w-10 h-10 items-center justify-center rounded-lg bg-transparent"
        onPress={() => setMenuOpen(true)}
      >
        <Text className="sr-only">Menu</Text>
        <View className="flex-col justify-center items-center w-full h-full">
          {/* Ikona burgera */}
          <View className="w-6 h-0.5 bg-black dark:bg-white mb-1" />
          <View className="w-6 h-0.5 bg-black dark:bg-white mb-1" />
          <View className="w-6 h-0.5 bg-black dark:bg-white" />
        </View>
      </Pressable>
      {/* Logo na środku */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={Logo}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
          accessibilityLabel="SurvivorQuest logo"
        />
      </View>
      {/* Placeholder na user info lub ThemeSwitch */}
      <View className="w-10 h-10 items-end justify-center" />
      <BurgerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
