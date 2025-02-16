import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Screen() {
  const db = useSQLiteContext();
  const [version, setVersion] = useState("");

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
        "SELECT sqlite_version()",
      );

      if (!result) {
        setVersion("v1");
        return;
      }

      setVersion(`v${result["sqlite_version()"]}`);
    }

    setup();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logo-sulimed.png")} // Replace with your logo file path
        style={styles.logo}
      />
      <Text>{version}</Text>
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
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
});
