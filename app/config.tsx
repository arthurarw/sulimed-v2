import { appRepository } from "@/repositories/AppRepository";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function Screen() {
  const [refreshing, setRefreshing] = useState(false);

  const handleSyncContractsClick = () => {
    Alert.alert(
      "Você tem certeza que deseja sincronizar os contratos?",
      "Os contratos sincronizados serão excluídos do seu dispositivo e enviado ao servidor.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: handleSyncContracts,
        },
      ],
    );
  };

  const handleSyncContracts = async () => {
    setRefreshing(true);
    console.log("Syncing contracts...");
    await appRepository.syncContractsToServer();
    console.log("Contracts synced!");
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {refreshing ? (
        <ActivityIndicator size={"large"} color={"#1D643B"} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSyncContractsClick}
        >
          <Text style={styles.buttonText}>Sincronizar Contratos</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: StatusBar.currentHeight || 0,
  },
  button: {
    backgroundColor: "#1D643B", // Purple color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5, // Rounded corners
    marginTop: 50,
    marginVertical: 10, // Space between buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  buttonText: {
    color: "#fff", // White text
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
