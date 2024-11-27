import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function Screen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>Contract {id}</Text>
    </SafeAreaView>
  );
}
