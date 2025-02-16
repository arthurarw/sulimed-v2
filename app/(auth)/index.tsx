import { styleStore } from "@/styles/styles";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

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
    <SafeAreaView style={styleStore.container}>
      <Image
        source={require("../../assets/images/logo-sulimed.png")} // Replace with your logo file path
        style={styles.logo}
      />
      <View>
        <Text>E-mail</Text>
        <TextInput style={styleStore.input} placeholder="Digite seu e-mail" />
        <Text>Senha</Text>
        <TextInput
          style={styleStore.input}
          placeholder="Digite sua senha"
          secureTextEntry
        />
        <TouchableOpacity
          style={styleStore.button}
          onPress={() => console.log("Login")}
        >
          <Text style={styleStore.buttonText}>Entrar</Text>
        </TouchableOpacity>
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
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
});
