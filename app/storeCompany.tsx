import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <View style={styles.container}>
      <View>
        <Text>STORE COMPANY</Text>
      </View>
    </View>
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
