import { useAuth } from "@/contexts/AuthContext";
import { styleStore } from "@/styles/styles";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

export default function Screen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authState, onLogin } = useAuth();

  const login = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    const result = await onLogin(email, password);
    if (result && result.authenticated) {
      router.replace("/");
      alert("Login efetuado com sucesso!");
      return;
    }

    alert("Erro ao efetuar o login!");
    return;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/logo-sulimed.png")}
        style={styles.logo}
      />
      <View style={styles.form}>
        <Text>E-mail</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value: string) => setEmail(value)}
          placeholder="Digite seu e-mail"
        />
        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          onChangeText={(value: string) => setPassword(value)}
          secureTextEntry
        />
        <TouchableOpacity style={styleStore.button} onPress={login}>
          <Text style={styleStore.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  form: {
    gap: 10,
    width: "60%",
  },
  logo: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
});
