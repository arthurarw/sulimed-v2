import { useAuth } from "@/contexts/AuthContext";
import { styleStore } from "@/styles/styles";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as EmailValidator from "email-validator";
import { appRepository } from "@/repositories/AppRepository";

export default function Screen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authState, onLogin } = useAuth();

  const login = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Ooops!!", "Preencha todos os campos!");
      return;
    }

    const isValidMail = EmailValidator.validate(email);
    if (!isValidMail) {
      Alert.alert("Ooops!!", "E-mail inválido!");
      return;
    }

    const result = await onLogin(email, password);
    if (result && result.authenticated) {
      setLoading(false);
      router.replace("/");
      Alert.alert("Sucesso", "Login efetuado com sucesso");
      return;
    }

    setLoading(false);
    Alert.alert("Ooops!!", "Erro ao efetuar o login!");
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
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          onChangeText={(value: string) => setPassword(value)}
          secureTextEntry
          autoCapitalize="none"
        />
        {loading ? (
          <ActivityIndicator size="large" color="##1D643B" />
        ) : (
          <TouchableOpacity style={styleStore.button} onPress={login}>
            <Text style={styleStore.buttonText}>Entrar</Text>
          </TouchableOpacity>
        )}
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
