
import { View, Text, Pressable, Modal, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import { useRouter } from 'expo-router/build/hooks';

interface BurgerMenuProps {
  visible: boolean;
  onClose: () => void;
  demo?: any;
  totalGames?: number;
  completedGames?: number;
}

export function BurgerMenu({ visible, onClose, demo, totalGames = 0, completedGames = 0 }: BurgerMenuProps) {
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
      <View className="absolute left-0 top-0 h-full w-4/5 bg-background dark:bg-background-dark shadow-2xl p-6 z-30">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-primary dark:text-primary-dark">Szczegóły Demo</Text>
          <ThemeSwitch />
        </View>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {demo && (
            <>
              <Text className="text-2xl font-bold text-primary dark:text-primary-dark mb-2">{demo.name}</Text>
              <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Data: {demo.date}</Text>
              <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Status: {demo.status}</Text>
              <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Lokalizacja: {demo.location}</Text>
              
              <View className="my-4 p-3 rounded-xl bg-white/80 dark:bg-black/40 border border-primary/20 dark:border-primary-dark/20">
                <Text className="text-lg font-semibold text-accent dark:text-accent-dark mb-2">Statystyki:</Text>
                <Text className="text-sm text-secondary dark:text-secondary-dark">Ukończone gry: {completedGames}/{totalGames}</Text>
                <Text className="text-sm text-secondary dark:text-secondary-dark">Punkty: {completedGames * 100}</Text>
              </View>
              
              <Text className="text-lg font-semibold text-accent dark:text-accent-dark mb-2">Gry / Stanowiska:</Text>
              {demo.games?.map((game: any) => (
                <TouchableOpacity 
                  key={game.id} 
                  onPress={() => {
                    onClose();
                    router.push(`/game?gameId=${game.id}`);
                  }}
                  className="mb-4 p-3 rounded-xl bg-white/80 dark:bg-black/40 border border-primary/20 dark:border-primary-dark/20 active:bg-white/60 dark:active:bg-black/60"
                >
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="font-bold text-primary dark:text-primary-dark flex-1">{game.name}</Text>
                    <Text className="text-xs text-accent dark:text-accent-dark ml-2">👆 Dotknij</Text>
                  </View>
                  <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Typ: {game.type || game.details?.type}</Text>
                  <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Status: {game.status || '-'}</Text>
                  {game.details?.description && (
                    <Text className="text-sm text-secondary dark:text-secondary-dark mb-1" numberOfLines={2}>
                      Opis: {game.details.description}
                    </Text>
                  )}
                  {game.details?.verificationCode && (
                    <Text className="text-sm text-highlight dark:text-highlight-dark mb-1">Kod: {game.details.verificationCode}</Text>
                  )}
                  {game.details?.questionsDetails && (
                    <View className="mt-2">
                      <Text className="font-semibold text-accent dark:text-accent-dark">Pytania quizowe:</Text>
                      {game.details.questionsDetails.map((q: any) => (
                        <View key={q.questionId} className="mb-1">
                          <Text className="text-sm text-primary dark:text-primary-dark" numberOfLines={1}>
                            • {q.questionText}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              <Text className="mt-6 text-base text-secondary dark:text-secondary-dark">Notatki:</Text>
              <Text className="text-sm text-primary dark:text-primary-dark mb-4">{demo.notes}</Text>
            </>
          )}
        </ScrollView>
        
        <View className="mt-4 pt-4 border-t border-primary/20 dark:border-primary-dark/20">
          <Pressable onPress={handleRestart} className="py-3 px-4 rounded-xl bg-accent dark:bg-accent-dark items-center">
            <Text className="text-white dark:text-black font-bold text-base">Restart Demo</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
