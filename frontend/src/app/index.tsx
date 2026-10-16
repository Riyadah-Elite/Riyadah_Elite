import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
      <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
        NativeWind is working
      </Text>
    </View>
  );
}