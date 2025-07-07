
import { View, Text, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import { useRouter } from 'expo-router/build/hooks';

export function BurgerMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const handleRestart = () => {
    try {
      if (window?.localStorage?.removeItem) {
        window.localStorage.removeItem('demo-team');
      }
    } catch {}
    onClose();
    router.replace('/');
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/30" />
      </TouchableWithoutFeedback>
      <View className="absolute left-0 top-0 h-full w-1/3 bg-background dark:bg-background-dark shadow-2xl p-6 z-30">
        <Text className="text-xl font-bold mb-6 text-primary dark:text-primary-dark">Menu</Text>
        <View className="absolute top-6 right-6">
          <ThemeSwitch />
        </View>
        <View className="gap-4">
          <Pressable onPress={handleRestart} className="py-2 px-3 rounded-xl bg-accent dark:bg-accent-dark items-center mb-2">
            <Text className="text-white dark:text-black font-bold text-base">Restart</Text>
          </Pressable>
          <Text className="text-lg text-secondary dark:text-secondary-dark">Przykładowy element 1</Text>
          <Text className="text-lg text-secondary dark:text-secondary-dark">Przykładowy element 2</Text>
          <Text className="text-lg text-secondary dark:text-secondary-dark">Przykładowy element 3</Text>
        </View>
      </View>
    </Modal>
  );
}
