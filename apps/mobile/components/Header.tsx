import { View, Text, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
// @ts-ignore
import Logo from '../assets/Logo-SurvivorQuest.png';
import { BurgerMenu } from './BurgerMenu';

export function Header() {
  const insets = useSafeAreaInsets?.() || { top: 0 };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <View
      className="w-full flex-row items-center px-4 py-2 bg-primary dark:bg-primary-dark shadow-md rounded-b-2xl relative"
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
      <View style={{ position: 'absolute', left: '50%', top: '50%', transform: [{ translateX: -24 }, { translateY: -24 }], zIndex: 10 }}>
        <Image
          source={Logo}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
          accessibilityLabel="SurvivorQuest logo"
        />
      </View>
      {/* Placeholder na user info */}
      <View className="flex-1" />
      {/* Informacja o trybie demo po prawej stronie */}
      <View className="w-32 h-10 items-end justify-center">
        <Text className="px-3 py-1 rounded-xl bg-accent dark:bg-accent-dark text-white dark:text-black font-bold text-xs shadow text-right">
          DEMO
        </Text>
      </View>
      <BurgerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
