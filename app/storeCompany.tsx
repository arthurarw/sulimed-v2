import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>STORE COMPANY</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: StatusBar.currentHeight || 0,
  },
});
