import { Image, StyleSheet, Text, View } from "react-native";

export default function Screen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo-sulimed.png")} // Replace with your logo file path
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Background color
  },
  logo: {
    width: 350, // Adjust width
    height: 350, // Adjust height
    resizeMode: "contain", // Adjust logo display
  },
});
