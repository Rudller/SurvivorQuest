import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-lg text-red-500">Not Found</Text>
    </View>
  );
}
