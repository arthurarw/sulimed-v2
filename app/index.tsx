import { Image, StatusBar, StyleSheet, View } from "react-native";

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
    backgroundColor: "#f0f0f0",
    marginTop: StatusBar.currentHeight || 0,
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
});
