import { View, Text, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';

export function BurgerMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
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
      <View className="absolute left-0 top-0 h-full w-64 bg-background dark:bg-background-dark shadow-2xl p-6 z-30">
        <Text className="text-xl font-bold mb-6 text-primary dark:text-primary-dark">Menu</Text>
        <View className="gap-4">
          <Text className="text-lg text-secondary dark:text-secondary-dark">Przykładowy element 1</Text>
          <Text className="text-lg text-secondary dark:text-secondary-dark">Przykładowy element 2</Text>
          <Text className="text-lg text-secondary dark:text-secondary-dark">Przykładowy element 3</Text>
        </View>
      </View>
    </Modal>
  );
}
